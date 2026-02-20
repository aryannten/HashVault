const API_BASE = 'http://localhost:5000/api';

export const submitFile = async (formData) => {
  const response = await fetch(`${API_BASE}/submit`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const verifyFile = async (formData) => {
  const response = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signup = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};
