export async function fetch_with_auth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('access_token');

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && !url.includes('/refresh') && !url.includes('/login')) {
    const refresh_token = localStorage.getItem('refresh_token');
    const refresh_response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh_token }),
    });

    if (refresh_response.ok) {
      const tokens = await refresh_response.json();
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);

      headers.set('Authorization', `Bearer ${tokens.access_token}`);
      response = await fetch(url, { ...options, headers });
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login';
    }
  }

  return response;
}
