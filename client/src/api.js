const API_BASE = 'http://localhost:3001';

export async function fetchDocument() {
  const response = await fetch(`${API_BASE}/api/document`);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function verifyDocument(documentText, annotations = []) {
  const response = await fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentText, annotations }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Verification failed: ${response.status}`);
  }

  return data;
}
