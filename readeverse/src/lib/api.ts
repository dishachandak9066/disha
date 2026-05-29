export const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('readeverse_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  // Prevent double '/api/api/...' if the endpoint already starts with '/api'
  const url = endpoint.startsWith('/api') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, config);
  
  let json;
  try {
    json = await response.json();
  } catch (err) {
    // If the server returns HTML (like a 404 page) or empty response, JSON parsing fails
    if (!response.ok) {
      throw new Error(`API Request failed with status ${response.status}`);
    }
    return null;
  }

  if (!response.ok) {
    throw new Error(json.message || json.error || 'API Request failed');
  }

  return json;
}
