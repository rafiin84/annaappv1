import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// ── Capture token from URL hash IMMEDIATELY at module load ────────────────────
// Must happen before React Navigation mounts and clears the hash.
let _pendingToken: string | null = null;

if (typeof window !== "undefined") {
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const p = new URLSearchParams(hash);
      const t = p.get("access_token");
      if (t) {
        _pendingToken = t;
        window.history.replaceState({}, "", window.location.pathname);
        console.log("[ZohoAuth] Token captured from hash");
      }
    } catch (_) {}
  }
}

export function consumePendingToken(): string | null {
  const t = _pendingToken;
  _pendingToken = null;
  return t;
}

// ── Config ────────────────────────────────────────────────────────────────────
const CLIENT_ID = "1000.4WQZDKTLHYLVLBOTRFI3HOY439FHFJ";

// All Zoho CRM scopes
const SCOPE = [
  "AaaServer.profile.READ",
  "ZohoCRM.modules.ALL",
  "ZohoCRM.users.ALL",
  "ZohoCRM.org.ALL",
  "ZohoCRM.settings.ALL",
  "ZohoCRM.bulk.ALL",
  "ZohoCRM.notifications.ALL",
  "ZohoCRM.coql.READ",
].join(",");

const AUTH_ENDPOINT = "https://accounts.zoho.in/oauth/v2/auth";
const USERINFO_ENDPOINT = "https://accounts.zoho.in/oauth/v2/userinfo";

const REDIRECT_URI = __DEV__
  ? "http://localhost:8081"
  : "https://annaapp.vercel.app";

const STORAGE_KEY = "zoho_access_token";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ZohoProfile {
  Zuid?: string;
  First_Name?: string;
  Last_Name?: string;
  Display_Name?: string;
  Email?: string;
  Profile_Photo?: string;
}

// ── Auth URL (implicit flow — response_type=token) ────────────────────────────

export function buildAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: SCOPE,
    access_type: "online",
    prompt: "consent",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

// ── Redirect to Zoho ──────────────────────────────────────────────────────────

export function redirectToZoho() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.href = buildAuthUrl();
  }
}

// ── Token storage: SecureStore on mobile, localStorage on web ─────────────────
// iOS   → Keychain (encrypted)
// Android → Keystore (encrypted)
// Web   → localStorage

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    await SecureStore.setItemAsync(STORAGE_KEY, token);
  }
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(STORAGE_KEY);
  }
  return SecureStore.getItemAsync(STORAGE_KEY);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }
}

// ── Fetch user profile ────────────────────────────────────────────────────────

export async function fetchProfile(accessToken: string): Promise<ZohoProfile> {
  const res = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

