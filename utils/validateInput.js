function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isValidUsername(username) {
  return typeof username === 'string' && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
};

