// lib/apiUtils.js

/**
 * Get the correct API path considering Next.js basePath configuration
 * @param {string} path - The API path (e.g., '/api/generateQuiz')
 * @returns {string} - The full API path with basePath if needed
 */
export function getApiPath(path) {
  // Use environment variable if set, otherwise no base path for Vercel deployment
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * Fetch wrapper that handles API calls with proper error handling
 * @param {string} path - The API path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} - Parsed JSON response
 * @throws {Error} - If response is not ok or not JSON
 */
export async function apiFetch(path, options = {}) {
  const url = getApiPath(path);
  
  try {
    const response = await fetch(url, options);
    
    // Check if response is ok (status 200-299)
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          // If it's HTML (like a 404 page), provide a helpful message
          const text = await response.text();
          if (text.includes('<!DOCTYPE') || text.includes('<html')) {
            errorMessage = 'API route not found. This app requires a Node.js server to run API routes. GitHub Pages only serves static files. Please deploy to Vercel, Netlify, or another platform that supports Next.js API routes.';
          }
        }
      } catch (parseError) {
        // If we can't parse the error, use the default message
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON. The API might be returning an error page.');
    }
    
    // Parse and return JSON
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach the API. Make sure the server is running.');
    }
    throw error;
  }
}