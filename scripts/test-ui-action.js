#!/usr/bin/env node

/**
 * UI Testing Helper Script
 * Simulates user actions and verifies results
 */

const fs = require('fs');
const path = require('path');

// Test action simulator
async function simulateAction(action, data = {}) {
  const baseUrl = 'http://localhost:5000';
  
  const actions = {
    // School CRUD
    createSchool: {
      method: 'POST',
      url: '/api/schools',
      body: data
    },
    updateSchool: {
      method: 'PATCH',
      url: `/api/schools/${data.id}`,
      body: data
    },
    deleteSchool: {
      method: 'DELETE',
      url: `/api/schools/${data.id}`
    },
    
    // Teacher associations
    addTeacherToSchool: {
      method: 'POST',
      url: '/api/educator-school-associations',
      body: data
    },
    updateTeacherAssociation: {
      method: 'PATCH',
      url: `/api/educator-school-associations/${data.id}`,
      body: data
    },
    deleteTeacherAssociation: {
      method: 'DELETE',
      url: `/api/educator-school-associations/${data.id}`
    },
    
    // Locations
    addLocation: {
      method: 'POST',
      url: '/api/locations',
      body: data
    },
    updateLocation: {
      method: 'PATCH',
      url: `/api/locations/${data.id}`,
      body: data
    },
    deleteLocation: {
      method: 'DELETE',
      url: `/api/locations/${data.id}`
    }
  };

  const actionConfig = actions[action];
  if (!actionConfig) {
    console.error(`Unknown action: ${action}`);
    return null;
  }

  try {
    const response = await fetch(baseUrl + actionConfig.url, {
      method: actionConfig.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: actionConfig.body ? JSON.stringify(actionConfig.body) : undefined
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Log test results
function logResult(testName, result) {
  const logFile = path.join(__dirname, '../test-results.json');
  
  let results = {};
  if (fs.existsSync(logFile)) {
    results = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  }
  
  results[testName] = {
    ...result,
    testName,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  
  console.log(`Test: ${testName}`);
  console.log(`Result: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
  if (!result.success) {
    console.log(`Error: ${result.error || `HTTP ${result.status}`}`);
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('Usage: node test-ui-action.js <action> [data]');
  console.log('Example: node test-ui-action.js createSchool \'{"name":"Test School"}\'');
  process.exit(1);
}

const action = process.argv[2];
const data = process.argv[3] ? JSON.parse(process.argv[3]) : {};

simulateAction(action, data).then(result => {
  logResult(action, result);
});