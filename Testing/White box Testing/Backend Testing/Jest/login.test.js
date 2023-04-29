const chai = require('chai');
const expect = chai.expect;

// Function to validate login
function validateLogin(email, password) {
  if (email && password && email.includes('@') && password.length >= 8) {
    return true;
  } else {
    return false;
  }
}

describe('Login validation', function() {

  // Valid email and password should return true
  it('should validate a valid email and password', function() {
    const email = 'dhruvchokshi25@gmail.com';
    const password = 'Dhruv@12295';
    const isValid = validateLogin(email, password);
    expect(isValid).to.be.true;
  });

  // Invalid email should return false
  it('should return false for an invalid email', function() {
    const email = 'dhruvchokshi.com';
    const password = 'password123';
    const isValid = validateLogin(email, password);
    expect(isValid).to.be.false;
  });

  // Invalid password should return false
  it('should return false for an invalid password', function() {
    const email = 'dhruvchokshi25@gmail.com';
    const password = '0l';
    const isValid = validateLogin(email, password);
    expect(isValid).to.be.false;
  });

  // Empty email should return false
  it('should return false for an empty email', function() {
    const email = '';
    const password = 'password123';
    const isValid = validateLogin(email, password);
    expect(isValid).to.be.false;
  });

  // Empty password should return false
  it('should return false for an empty password', function() {
    const email = 'dhruvchokshi25@gmail.com';
    const password = '';
    const isValid = validateLogin(email, password);
    expect(isValid).to.be.false;
  });

})
