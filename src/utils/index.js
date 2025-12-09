/**
 * Utility Functions
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Create page URL for routing
 * Converts page names to URL paths
 */
export function createPageUrl(pageName) {
  // Handle query parameters
  if (pageName.includes('?')) {
    const [page, query] = pageName.split('?');
    return `/${page.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}?${query}`;
  }
  
  // Convert PascalCase to kebab-case
  return `/${pageName.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate email
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Generate case number
 */
export function generateCaseNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CASE-${year}-${random}`;
}

/**
 * Get risk color
 */
export function getRiskColor(risk) {
  const colors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-amber-600 bg-amber-100',
    low: 'text-emerald-600 bg-emerald-100',
  };
  return colors[risk] || 'text-gray-600 bg-gray-100';
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  const colors = {
    processing: 'text-blue-600 bg-blue-100',
    awaiting_review: 'text-amber-600 bg-amber-100',
    completed: 'text-emerald-600 bg-emerald-100',
    archived: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Get TI-RADS color
 */
export function getTiradsColor(category) {
  const colors = {
    1: 'text-emerald-600 bg-emerald-100',
    2: 'text-green-600 bg-green-100',
    3: 'text-yellow-600 bg-yellow-100',
    4: 'text-orange-600 bg-orange-100',
    5: 'text-red-600 bg-red-100',
  };
  return colors[category] || 'text-gray-600 bg-gray-100';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate text
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
