(function () {
  'use strict';

  const form = document.getElementById('loginForm');
  const roleInput = document.getElementById('role');
  const roleCards = document.querySelectorAll('.role-card');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const rememberMe = document.getElementById('rememberMe');
  const passwordToggle = document.getElementById('passwordToggle');
  const loginButton = document.getElementById('loginButton');
  const formMessage = document.getElementById('formMessage');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const forgotPassword = document.getElementById('forgotPassword');
  const forgotModal = document.getElementById('forgotModal');
  const modalClose = document.getElementById('modalClose');
  const resetEmail = document.getElementById('resetEmail');
  const resetError = document.getElementById('resetError');
  const resetSubmit = document.getElementById('resetSubmit');

  function setMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + (type || '');
  }

  function clearFieldError(field, errorElement) {
    field.classList.remove('invalid');
    errorElement.textContent = '';
  }

  function validateUsername() {
    const value = username.value.trim();
    if (!value) {
      usernameError.textContent = 'Email or username is required.';
      return false;
    }
    if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      usernameError.textContent = 'Enter a valid email address.';
      return false;
    }
    usernameError.textContent = '';
    return true;
  }

  function validatePassword() {
    const value = password.value;
    if (!value) {
      passwordError.textContent = 'Password is required.';
      return false;
    }
    if (value.length < 6) {
      passwordError.textContent = 'Password must contain at least 6 characters.';
      return false;
    }
    passwordError.textContent = '';
    return true;
  }

  roleCards.forEach((card) => {
    card.addEventListener('click', function () {
      roleCards.forEach((item) => {
        item.classList.remove('selected');
        item.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('selected');
      this.setAttribute('aria-pressed', 'true');
      roleInput.value = this.dataset.role;
      setMessage('', '');
    });
  });

  passwordToggle.addEventListener('click', function () {
    const isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';
    this.setAttribute('aria-pressed', String(isPassword));
    this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    this.textContent = isPassword ? '◉' : '◉';
  });

  username.addEventListener('input', () => clearFieldError(username, usernameError));
  password.addEventListener('input', () => clearFieldError(password, passwordError));

  const rememberedRole = localStorage.getItem('greensRememberRole');
  const rememberedUsername = localStorage.getItem('greensRememberUsername');
  if (rememberedRole) {
    const rememberedCard = document.querySelector(`[data-role="${rememberedRole}"]`);
    if (rememberedCard) rememberedCard.click();
  }
  if (rememberedUsername) {
    username.value = rememberedUsername;
    rememberMe.checked = true;
  }

  form.addEventListener('submit', function () {

  const validUsername = validateUsername();
  const validPassword = validatePassword();

  if (!validUsername || !validPassword) {
    return;
  }

  if (rememberMe.checked) {
    localStorage.setItem('greensRememberRole', roleInput.value);
    localStorage.setItem('greensRememberUsername', username.value.trim());
  } else {
    localStorage.removeItem('greensRememberRole');
    localStorage.removeItem('greensRememberUsername');
  }

  loginButton.disabled = true;
  loginButton.classList.add('loading');

});

  function openModal() {
    forgotModal.hidden = false;
    resetEmail.focus();
  }

  function closeModal() {
    forgotModal.hidden = true;
    resetError.textContent = '';
    resetEmail.value = '';
  }

  forgotPassword.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  forgotModal.addEventListener('click', (event) => {
    if (event.target === forgotModal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !forgotModal.hidden) closeModal();
  });

  resetSubmit.addEventListener('click', () => {
    const email = resetEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      resetError.textContent = 'Please enter a valid email address.';
      return;
    }
    resetError.textContent = '';
    resetSubmit.disabled = true;
    resetSubmit.textContent = 'Request received';
    window.setTimeout(() => closeModal(), 900);
  });
})();
