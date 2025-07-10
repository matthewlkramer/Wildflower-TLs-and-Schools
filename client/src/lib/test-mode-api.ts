import { getTestMode } from '@/components/TestModeToggle';

// Test mode API wrapper that simulates operations without actually calling the server
export const testModeApiWrapper = {
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    if (!getTestMode()) {
      // Normal mode - make real API call
      return fetch(url, options);
    }

    // Test mode - simulate responses
    const method = options?.method || 'GET';
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    if (method === 'GET') {
      // For GET requests, make the real call to show existing data
      return fetch(url, options);
    }

    // For POST, PUT, PATCH, DELETE - simulate success responses
    if (method === 'POST') {
      return new Response(JSON.stringify({
        id: `test_${Date.now()}`,
        message: 'Test mode: Record created successfully (not saved to database)',
        ...getSimulatedData(url)
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'PUT' || method === 'PATCH') {
      return new Response(JSON.stringify({
        message: 'Test mode: Record updated successfully (not saved to database)',
        ...getSimulatedData(url)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      return new Response(JSON.stringify({
        message: 'Test mode: Record deleted successfully (not removed from database)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default success response
    return new Response(JSON.stringify({
      message: 'Test mode: Operation completed successfully (no data modified)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function getSimulatedData(url: string) {
  // Return appropriate simulated data based on the URL endpoint
  if (url.includes('/schools')) {
    return {
      name: 'Test School',
      shortName: 'Test',
      status: 'Active'
    };
  }
  
  if (url.includes('/teachers') || url.includes('/educators')) {
    return {
      fullName: 'Test Educator',
      email: 'test@example.com',
      status: 'Active'
    };
  }
  
  if (url.includes('/charters')) {
    return {
      shortName: 'Test Charter',
      fullName: 'Test Charter School',
      status: 'Active'
    };
  }

  return {};
}

// Override global fetch in test mode
export function setupTestModeApi() {
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override with test mode wrapper
  window.fetch = testModeApiWrapper.fetch;
  
  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
  };
}