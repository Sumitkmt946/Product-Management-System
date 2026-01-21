const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing Slooze Backend API...\n');

    // Configure axios with timeout
    const instance = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await instance.get(`${BASE_URL}/health`);
    console.log('✓ Health check passed:', healthResponse.data);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Manager',
      email: 'testmanager@slooze.com',
      password: 'password123',
      role: 'MANAGER'
    });
    console.log('✓ User registration passed:', registerResponse.data.data.user);

    // Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testmanager@slooze.com',
      password: 'password123'
    });
    const token = loginResponse.data.data.token;
    console.log('✓ Login passed, token received');

    // Test get current user
    console.log('\n4. Testing get current user...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Get current user passed:', meResponse.data.data.user);

    // Test create product
    console.log('\n5. Testing create product...');
    const productResponse = await axios.post(`${BASE_URL}/products`, {
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test Category',
      price: 99.99,
      stock: 10,
      minStock: 5,
      sku: 'TEST-001',
      barcode: '1234567890123'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productId = productResponse.data.data.product.id;
    console.log('✓ Product creation passed:', productResponse.data.data.product);

    // Test get products
    console.log('\n6. Testing get products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Get products passed, found', productsResponse.data.data.products.length, 'products');

    // Test get single product
    console.log('\n7. Testing get single product...');
    const singleProductResponse = await axios.get(`${BASE_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Get single product passed:', singleProductResponse.data.data.product.name);

    // Test dashboard stats
    console.log('\n8. Testing dashboard stats...');
    const statsResponse = await axios.get(`${BASE_URL}/products/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Dashboard stats passed:', statsResponse.data.data);

    console.log('\n🎉 All API tests passed successfully!');

  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Request setup error:', error.message);
    }
  }
}

// Run tests
testAPI();