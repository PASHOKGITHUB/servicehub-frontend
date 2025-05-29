// lib/formatters.ts

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

// Alternative date formatting functions
export const formatDateLong = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};