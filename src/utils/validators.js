export function validateRegistration(formData) {
  const errors = {};

  if (!formData.full_name || !formData.full_name.trim()) {
    errors.full_name = 'Full Name is required';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateScanInput(input) {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      error: 'Please enter content to analyze.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
