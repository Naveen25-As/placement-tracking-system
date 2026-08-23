export const APPLICATION_STATUSES = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'ONLINE_ASSESSMENT', label: 'Online Assessment' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'REJECTED', label: 'Rejected' },
];

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
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
  return error.response?.data?.message || error.message || 'Something went wrong';
}
