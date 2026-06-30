const API_BASE_URL = 'http://localhost:8000';

export const startInterview = async (candidateName, domain) => {
  const response = await fetch(`${API_BASE_URL}/start-interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate_name: candidateName, domain }),
  });
  if (!response.ok) throw new Error('Failed to start interview');
  return response.json();
};

export const chat = async (domain, history, userMessage) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, history, user_message: userMessage }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const evaluateInterview = async (candidateName, domain, history) => {
  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate_name: candidateName, domain, history }),
  });
  if (!response.ok) throw new Error('Failed to evaluate interview');
  return response.json();
};

export const getHistory = async (candidateName) => {
  const response = await fetch(`${API_BASE_URL}/history/${encodeURIComponent(candidateName)}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

export const getSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);
  if (!response.ok) throw new Error('Failed to fetch session');
  return response.json();
};
