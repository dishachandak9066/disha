// Point to Python FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  data?: any;
}

// Helper to get user email from localStorage
function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('readeverse_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.email || null;
    }
  } catch (error) {
    console.error('Failed to get user email:', error);
  }
  return null;
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('readeverse_token') : null;
  const userEmail = getUserEmail();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add authentication headers
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add user email header for authenticated endpoints
  if (userEmail) {
    headers['user_email'] = userEmail;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  // Construct full URL to Python backend
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    
    let json;
    try {
      json = await response.json();
    } catch (err) {
      if (!response.ok) {
        throw new Error(`API Request failed with status ${response.status}`);
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(json.message || json.error || json.detail || 'API Request failed');
    }

    return json;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
    
  }
}
