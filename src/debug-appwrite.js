// Debug Appwrite Configuration
export const debugAppwrite = () => {
  console.log('=== Appwrite Debug Info ===');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT);
  console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
  console.log('Current URL:', window.location.origin);
  console.log('User Agent:', navigator.userAgent);
  
  // Test basic connectivity
  fetch(import.meta.env.VITE_APPWRITE_ENDPOINT + '/health')
    .then(response => {
      console.log('Appwrite Health Check:', response.status);
      return response.json();
    })
    .then(data => console.log('Health Data:', data))
    .catch(error => console.error('Health Check Failed:', error));
};

// Auto-run in development
if (import.meta.env.DEV) {
  debugAppwrite();
}
