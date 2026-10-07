// API Helper to connect Frontend React App to Node.js/Express Backend

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchFullData() {
  try {
    const res = await fetch(`${API_BASE}/data`);
    if (!res.ok) throw new Error('API server returned error status');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unreachable, using local storage fallback:', err.message);
    return null;
  }
}

export async function apiSaveRoom(room) {
  try {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    return await res.json();
  } catch (err) {
    console.error('API save room failed:', err);
    return null;
  }
}

export async function apiDeleteRoom(id) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (err) {
    console.error('API delete room failed:', err);
    return null;
  }
}

export async function apiSaveResident(resident) {
  try {
    const res = await fetch(`${API_BASE}/residents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resident)
    });
    return await res.json();
  } catch (err) {
    console.error('API save resident failed:', err);
    return null;
  }
}

export async function apiVacateBed(roomId, bedNo, residentId) {
  try {
    const res = await fetch(`${API_BASE}/residents/vacate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, bedNo, residentId })
    });
    return await res.json();
  } catch (err) {
    console.error('API vacate bed failed:', err);
    return null;
  }
}

export async function apiSavePayment(payment) {
  try {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    return await res.json();
  } catch (err) {
    console.error('API save payment failed:', err);
    return null;
  }
}

export async function apiSaveNotice(notice) {
  try {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice)
    });
    return await res.json();
  } catch (err) {
    console.error('API save notice failed:', err);
    return null;
  }
}

export async function apiDeleteNotice(id) {
  try {
    const res = await fetch(`${API_BASE}/notices/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (err) {
    console.error('API delete notice failed:', err);
    return null;
  }
}
