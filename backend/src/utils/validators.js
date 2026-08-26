export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
}

export function validateRegistration(data) {
  const errors = [];
  const fullName = data.full_name || data.fullName || '';
  const email = data.email || '';
  const password = data.password || '';
  const confirmPassword = data.confirm_password || data.confirmPassword || '';

  if (!fullName.trim()) {
    errors.push('Full Name is required.');
  }

  if (!email.trim()) {
    errors.push('Email is required.');
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  } else if (!validatePassword(password)) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
