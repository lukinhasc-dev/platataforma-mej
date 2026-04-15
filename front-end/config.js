const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_URL = isLocal ? "http://localhost:3000" : "https://platataforma-mej.onrender.com";

export const SUPABASE_URL = "https://heamrvsbpsyfsybnwofj.supabase.co"
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYW1ydnNicHN5ZnN5Ym53b2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODg0NjEsImV4cCI6MjA4ODc2NDQ2MX0.5cnqLWMWW1XUs55cBJ5gRy_1DcWL7lCSRR3NsWz3eWo"
