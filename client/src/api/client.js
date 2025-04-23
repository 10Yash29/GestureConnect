const BASE_URL = import.meta.env.VITE_API_BASE || 'https://gesture-backend-wrn9.onrender.com';

// Add CORS headers to all requests
const defaultOptions = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

/**
 * Handles API requests with error handling
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  try {
    // For FormData, don't set Content-Type, let the browser handle it
    const fetchOptions = {
      ...defaultOptions,
      ...options,
    };

    // For FormData, don't manually set Content-Type header
    // Let the browser handle it with the proper multipart/form-data boundary
    if (options.body instanceof FormData) {
      // Create a new headers object without the Content-Type
      const headers = { ...options.headers };
      delete headers['Content-Type'];
      fetchOptions.headers = headers;

      // Log the FormData content for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('FormData contents:');
        for (const pair of options.body.entries()) {
          const [key, value] = pair;
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
      }
    }

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get content type and check if empty response
      const contentType = response.headers.get('content-type');

      // For empty responses or responses without content-type, return empty object
      if (response.status === 204 || !contentType) {
        return {};
      }

      // For JSON responses
      if (contentType && contentType.includes('application/json')) {
        try {
          return await response.json();
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          return {}; // Return empty object on parse error
        }
      }

      // For other content types, try to parse as JSON, but return as text if that fails
      try {
        const text = await response.text();
        if (!text) return {}; // Empty response

        try {
          return JSON.parse(text);
        } catch (e) {
          // Not JSON, return the text if it's short enough
          if (text.length < 100) {
            return { message: text };
          } else {
            console.error('Response is not JSON and too large to return as message');
            return { success: true }; // Assume success if we got an OK status
          }
        }
      } catch (e) {
        console.error('Error reading response:', e);
        return {}; // Return empty object on error
      }
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

/**
 * Registers a face with the backend
 * @param {FormData} formData - FormData with username and file
 * @returns {Promise} - Registration response
 */
export async function registerFace(formData) {
  // Ensure no Content-Type header is set when sending FormData
  // This allows the browser to set the correct Content-Type with boundary
  return apiRequest('/register_face', {
    method: 'POST',
    body: formData,
    headers: {}, // Explicitly empty to ensure no content-type is set
  });
}

/**
 * Collects a gesture with the backend
 * @param {FormData} formData - FormData with gesture_name, binding, and file
 * @returns {Promise} - Collection response
 */
export async function collectGesture(formData) {
  // Ensure no Content-Type header is set when sending FormData
  // This allows the browser to set the correct Content-Type with boundary
  return apiRequest('/collect_gesture', {
    method: 'POST',
    body: formData,
    headers: {}, // Explicitly empty to ensure no content-type is set
  });
}

/**
 * Trains the model
 * @returns {Promise} - Training response
 */
export async function trainModel() {
  return apiRequest('/train_model', {
    method: 'POST',
  });
}

/**
 * Predicts a gesture from an image
 * @param {FormData} formData - FormData with file
 * @returns {Promise} - Prediction response
 */
export async function predictGesture(formData) {
  // Ensure no Content-Type header is set when sending FormData
  // This allows the browser to set the correct Content-Type with boundary
  return apiRequest('/predict', {
    method: 'POST',
    body: formData,
    headers: {}, // Explicitly empty to ensure no content-type is set
  });
}