/**
 * Base44 Client Compatibility Layer
 * 
 * This file provides compatibility with the existing Base44 API calls
 * by wrapping the mock API. When you're ready to connect to your actual
 * backend, replace the imports here with real API calls.
 */

import { apiClient } from './mockAPI';

export const base44 = apiClient;
export default apiClient;
