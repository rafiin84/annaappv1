import { loadToken, clearToken } from "./zohoAuth";

// ── Base URL — India datacenter ───────────────────────────────────────────────
const BASE = "https://www.zohoapis.in/crm/v6";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CRMRecord {
  id: string;
  [key: string]: any;
}

export interface CRMListResponse {
  data: CRMRecord[];
  info?: {
    per_page: number;
    count: number;
    page: number;
    more_records: boolean;
  };
}

export interface CRMContact {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  Full_Name?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Account_Name?: { name: string; id: string };
  Title?: string;
  Department?: string;
  Lead_Source?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

export interface CRMLead {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  Full_Name?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Company?: string;
  Lead_Source?: string;
  Lead_Status?: string;
  Industry?: string;
  State?: string;
  City?: string;
  Created_Time?: string;
}

export interface CRMUser {
  id: string;
  full_name?: string;
  email?: string;
  role?: { name: string; id: string };
  profile?: { name: string; id: string };
  status?: string;
  created_time?: string;
}

export interface CRMOrg {
  id?: string;
  company_name?: string;
  alias?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  employee_count?: number;
  country?: string;
  state?: string;
  city?: string;
}

// ── Core request ──────────────────────────────────────────────────────────────

async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: object,
  params?: Record<string, string | number>
): Promise<T> {
  const token = await loadToken();
  if (!token) throw new Error("NOT_AUTHENTICATED");

  let url = `${BASE}${path}`;
  if (params && method === "GET") {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    );
    url += `?${q.toString()}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token expired
  if (res.status === 401) {
    await clearToken();
    throw new Error("TOKEN_EXPIRED");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `CRM request failed: ${res.status}`);
  }

  return res.json();
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export const Contacts = {
  list: (page = 1, perPage = 20): Promise<CRMListResponse> =>
    request("GET", "/Contacts", undefined, { page, per_page: perPage }),

  get: (id: string): Promise<{ data: CRMContact[] }> =>
    request("GET", `/Contacts/${id}`),

  search: (query: string): Promise<CRMListResponse> =>
    request("GET", "/Contacts/search", undefined, { criteria: query }),

  create: (data: Partial<CRMContact>): Promise<any> =>
    request("POST", "/Contacts", { data: [data] }),

  update: (id: string, data: Partial<CRMContact>): Promise<any> =>
    request("PUT", `/Contacts/${id}`, { data: [{ id, ...data }] }),

  delete: (id: string): Promise<any> =>
    request("DELETE", `/Contacts/${id}`),
};

// ── Leads ─────────────────────────────────────────────────────────────────────

export const Leads = {
  list: (page = 1, perPage = 20): Promise<CRMListResponse> =>
    request("GET", "/Leads", undefined, { page, per_page: perPage }),

  get: (id: string): Promise<{ data: CRMLead[] }> =>
    request("GET", `/Leads/${id}`),

  search: (query: string): Promise<CRMListResponse> =>
    request("GET", "/Leads/search", undefined, { criteria: query }),

  create: (data: Partial<CRMLead>): Promise<any> =>
    request("POST", "/Leads", { data: [data] }),

  update: (id: string, data: Partial<CRMLead>): Promise<any> =>
    request("PUT", `/Leads/${id}`, { data: [{ id, ...data }] }),

  convert: (id: string): Promise<any> =>
    request("POST", `/Leads/${id}/actions/convert`, { data: [{ id }] }),
};

// ── Accounts ──────────────────────────────────────────────────────────────────

export const Accounts = {
  list: (page = 1, perPage = 20): Promise<CRMListResponse> =>
    request("GET", "/Accounts", undefined, { page, per_page: perPage }),

  get: (id: string): Promise<{ data: CRMRecord[] }> =>
    request("GET", `/Accounts/${id}`),

  search: (query: string): Promise<CRMListResponse> =>
    request("GET", "/Accounts/search", undefined, { criteria: query }),

  create: (data: Record<string, any>): Promise<any> =>
    request("POST", "/Accounts", { data: [data] }),
};

// ── Deals ─────────────────────────────────────────────────────────────────────

export const Deals = {
  list: (page = 1, perPage = 20): Promise<CRMListResponse> =>
    request("GET", "/Deals", undefined, { page, per_page: perPage }),

  get: (id: string): Promise<{ data: CRMRecord[] }> =>
    request("GET", `/Deals/${id}`),

  create: (data: Record<string, any>): Promise<any> =>
    request("POST", "/Deals", { data: [data] }),

  update: (id: string, data: Record<string, any>): Promise<any> =>
    request("PUT", `/Deals/${id}`, { data: [{ id, ...data }] }),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const Tasks = {
  list: (page = 1, perPage = 20): Promise<CRMListResponse> =>
    request("GET", "/Tasks", undefined, { page, per_page: perPage }),

  create: (data: Record<string, any>): Promise<any> =>
    request("POST", "/Tasks", { data: [data] }),

  update: (id: string, data: Record<string, any>): Promise<any> =>
    request("PUT", `/Tasks/${id}`, { data: [{ id, ...data }] }),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const Users = {
  list: (): Promise<{ users: CRMUser[] }> =>
    request("GET", "/users", undefined, { type: "AllUsers" }),

  me: (): Promise<{ users: CRMUser[] }> =>
    request("GET", "/users/me"),
};

// ── Org ───────────────────────────────────────────────────────────────────────

export const Org = {
  get: (): Promise<{ org: CRMOrg[] }> =>
    request("GET", "/org"),
};

// ── COQL — custom SQL-like queries ────────────────────────────────────────────

export const COQL = {
  query: (selectQuery: string): Promise<CRMListResponse> =>
    request("POST", "/coql", { select_query: selectQuery }),
};

// ── Search across all modules ─────────────────────────────────────────────────

export const Search = {
  all: (word: string): Promise<CRMListResponse> =>
    request("GET", "/search", undefined, { word }),
};
