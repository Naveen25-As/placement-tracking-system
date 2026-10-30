export const APPLICATION_STATUSES = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'ONLINE_ASSESSMENT', label: 'Online Assessment' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'REJECTED', label: 'Rejected' },
];

function parseDate(dateStr) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  return new Date(dateStr);
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return parseDate(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusBadgeClass(status) {
  const map = {
    APPLIED: 'badge-info',
    SHORTLISTED: 'badge-warning',
    ONLINE_ASSESSMENT: 'badge-purple',
    INTERVIEW: 'badge-primary',
    OFFERED: 'badge-success',
    REJECTED: 'badge-danger',
    ONLINE: 'badge-success',
    OFFLINE: 'badge-secondary',
  };
  return map[status] || 'badge-secondary';
}

export function statusLabel(status) {
  const found = APPLICATION_STATUSES.find((s) => s.value === status);
  return found ? found.label : status?.replace(/_/g, ' ');
}

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    const fieldErrors = Object.values(data.data).filter((v) => typeof v === 'string');
    if (fieldErrors.length) return fieldErrors.join('. ');
  }
  if (data?.message) return data.message;
  if (error.request && !error.response) return 'Unable to reach the server. Please check that the backend is running.';
  return error.message || 'Something went wrong';
}
