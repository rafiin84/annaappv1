import Constants from "expo-constants";
import { Platform } from "react-native";

const cfg = (Constants.expoConfig?.extra?.zoho ?? {}) as {
  clientId: string;
  redirectUri: string;
  scope: string;
  authEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
};

export interface ZohoProfile {
  ZUID: string;
  First_Name: string;
  Last_Name: string;
  Display_Name: string;
  Email: string;
  Profile_Photo?: string;
}

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function randomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((x) => chars[x % chars.length]).join("");
}

function base64UrlEncode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomString(64);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: base64UrlEncode(hash) };
}

// ── Auth URL ──────────────────────────────────────────────────────────────────

export function buildAuthUrl(challenge: string, state: string): string {
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: "code",
    scope: cfg.scope,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "online",
    state,
  });
  return `${cfg.authEndpoint}?${params.toString()}`;
}

// ── Token exchange ─────────────────────────────────────────────────────────────

export async function exchangeCode(code: string, verifier: string): Promise<string> {
  const body = new URLSearchParams({
    code,
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    grant_type: "authorization_code",
    code_verifier: verifier,
  });

  const res = await fetch(cfg.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await res.json();
  if (data.error || !data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "Token exchange failed");
  }
  return data.access_token as string;
}

// ── User profile ──────────────────────────────────────────────────────────────

export async function fetchProfile(accessToken: string): Promise<ZohoProfile> {
  const res = await fetch(cfg.userInfoEndpoint, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Zoho profile");
  return res.json();
}

// ── Session storage helpers (web only) ───────────────────────────────────────

export function saveVerifier(verifier: string, state: string) {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("pkce_verifier", verifier);
    sessionStorage.setItem("pkce_state", state);
  }
}

export function loadVerifier(): { verifier: string; state: string } | null {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    const verifier = sessionStorage.getItem("pkce_verifier");
    const state = sessionStorage.getItem("pkce_state");
    if (verifier && state) {
      sessionStorage.removeItem("pkce_verifier");
      sessionStorage.removeItem("pkce_state");
      return { verifier, state };
    }
  }
  return null;
}

// ── Redirect (web only) ───────────────────────────────────────────────────────

export function redirectToZoho(url: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.href = url;
  }
}

// ── Parse OAuth callback from current URL (web only) ─────────────────────────

export function parseCallbackParams(): { code: string; state: string } | null {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  if (code && state) {
    // Clear params from URL so navigation doesn't get confused
    window.history.replaceState({}, "", "/");
    return { code, state };
  }
  return null;
}
