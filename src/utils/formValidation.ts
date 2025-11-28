export function validateField(name: string, value: string) {
  let message = '';

  if (!value.trim()) {
    message = `${name} is required`;
  }

  if (name === 'Email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      message = 'Invalid email format';
    }
  }

  return message;
}
