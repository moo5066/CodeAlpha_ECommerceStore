const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      `Cannot connect to the server at ${API_URL}. Start the backend API and try again.`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
