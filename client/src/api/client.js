const BASE_URL = import.meta.env.VITE_API_BASE || window.location.origin;

/**
 * Handles API requests with error handling
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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
  return apiRequest('/register_face', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Collects a gesture with the backend
 * @param {FormData} formData - FormData with gesture_name, binding, and file
 * @returns {Promise} - Collection response
 */
export async function collectGesture(formData) {
  return apiRequest('/collect_gesture', {
    method: 'POST',
    body: formData,
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
  return apiRequest('/predict', {
    method: 'POST',
    body: formData,
  });
}
