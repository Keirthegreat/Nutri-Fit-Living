const BASE_URL = 'https://nutrifit-backend.onrender.com';


// Display notifications for login/signup

let isLoginInProgress = false; // Global flag to track if login is in progress
let isSignupInProgress = false; // Global flag to track if signup is in progress

function showNotification(id, message, type) {
  const notification = document.getElementById(id);
  if (!notification) {
    console.error(`Notification element with ID "${id}" not found.`);
    return;
  }

  // Set the notification message and style
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.display = 'block';

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function clearNotification(id) {
  const notification = document.getElementById(id);
  if (notification) {
    notification.style.display = 'none'; // Hide notification immediately
    notification.textContent = ''; // Clear content
  }
}

function toggleForm(form) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (form === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  }
}

function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  field.type = field.type === 'password' ? 'text' : 'password';
}

function handleLogin(event) {
  event.preventDefault(); // Prevent default form submission

  if (isLoginInProgress) return; // Prevent duplicate login attempts during progress

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const notificationId = 'loginNotification'; // ID of the notification element

  // Clear any previous notifications immediately
  clearNotification(notificationId);

  // Mark login as in progress
  isLoginInProgress = true;

  // Simulate an AJAX request (replace with actual AJAX implementation)
  simulateLoginRequest(username, password, notificationId);
}

function simulateLoginRequest(username, password, notificationId) {
  // Simulating a backend response with a slight delay
  setTimeout(() => {
    if (username === 'correctUsername' && password === 'correctPassword') {
      // Show success notification
      showNotification(notificationId, 'Login successful! Redirecting...', 'success');

      // Redirect after showing success notification
      setTimeout(() => {
        isLoginInProgress = false; // Reset the flag after redirection
        window.location.href = 'main.html'; // Replace with your actual redirection URL
      }, 3000);

      return; // Exit to ensure no further logic executes
    }

    // If success logic is triggered, skip error notifications
    if (isLoginInProgress) return;

    // Only show error notification if success logic has NOT been triggered
    showNotification(notificationId, 'Error: Invalid username or password.', 'error');
    isLoginInProgress = false; // Reset the flag if login fails
  }, 1000); // Simulate a network delay of 1 second
}




function handleSignup(event) {
  event.preventDefault(); // Prevent default form submission

  if (isSignupInProgress) return; // Prevent duplicate signup attempts during progress

  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const notificationId = 'signupNotification'; // ID of the notification element

  // Clear any previous notifications immediately
  clearNotification(notificationId);

  // Mark signup as in progress
  isSignupInProgress = true;

  // Simulate an AJAX request (replace with actual AJAX implementation)
  simulateSignupRequest(username, email, password, notificationId);
}


let activeNotification = null; // Track the active notification ID

function simulateSignupRequest(username, email, password, notificationId) {
  // Simulating a backend response with a slight delay
  setTimeout(() => {
    if (username && email && password) { 
      // If all fields are filled, simulate a successful signup
      showNotification(notificationId, 'Signup successful! Redirecting to login...', 'success');

      // Redirect to login form after showing success notification
      setTimeout(() => {
        isSignupInProgress = false; // Reset the flag after redirection
        toggleForm('login');
      }, 3000);

      return; // Exit to ensure no further logic executes
    }

    // If any field is incomplete, show an error notification
    showNotification(notificationId, 'Please fill out all fields correctly.', 'error');

    // Reset signup progress silently if fields are incomplete
    isSignupInProgress = false; // Reset the flag for retry
  }, 1000); // Simulate a network delay of 1 second
}

function showNotification(notificationId, message, type) {
  // Ensure only one notification is active at a time
  if (activeNotification && activeNotification !== notificationId) {
    clearNotification(activeNotification); // Clear the previous notification
  }

  activeNotification = notificationId; // Set the current notification as active

  const notificationElement = document.getElementById(notificationId);
  if (notificationElement) {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block'; // Show the notification

    // Automatically clear the notification after 5 seconds
    setTimeout(() => {
      clearNotification(notificationId);
    }, 5000);
  }
}

function clearNotification(notificationId) {
  const notificationElement = document.getElementById(notificationId);
  if (notificationElement) {
    notificationElement.style.display = 'none'; // Hide the notification
    notificationElement.textContent = ''; // Clear the notification content
    notificationElement.className = ''; // Reset the notification class
  }

  // Reset activeNotification only if it matches the cleared one
  if (activeNotification === notificationId) {
    activeNotification = null;
  }
}

function toggleForm(formType) {
  // Example function to toggle forms (e.g., signup and login)
  console.log(`Switching to ${formType} form.`);
}


// Handle login with AJAX
function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  $.ajax({
      url: `${BASE_URL}/index.php`,
      method: 'POST',
      data: { username, password },
      dataType: 'json', // Automatically parses JSON
      success: function (result) {
          if (result.status === 'success') {
              // Store user data in Session Storage
              sessionStorage.setItem('user_id', result.user_id);
              sessionStorage.setItem('username', result.username);

              // Show notification and redirect
              showNotification('loginNotification', 'Login successful!', 'success');
              setTimeout(() => (window.location.href = 'main.html'), 3000);
          } else {
              showNotification('loginNotification', 'Error: ' + result.message, 'error');
          }
      },
      error: function (xhr, status, error) {
          console.error('Login Error:', xhr.responseText);
          showNotification('loginNotification', 'Login error. Please try again.', 'error');
      },
  });
}


// Handle signup with AJAX
function signupUser(event) {
  event.preventDefault();
  const fullName = document.getElementById('signupFullName').value;
  const email = document.getElementById('signupEmail').value;
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  $.ajax({
      url: `${BASE_URL}/signup.php`,
      method: 'POST',
      data: { full_name: fullName, email, username, password },
      dataType: 'json', // Automatically parses JSON
      success: function (result) {
          if (result.status === 'success') {
              showNotification('signupNotification', 'Signup successful! Please log in.', 'success');
              setTimeout(() => toggleForm('login'), 3000);
          }
      },
      error: function (xhr, status, error) {
          console.error('Signup Error:', xhr.responseText);
          
      },
  });
}


// Toggle between login and signup forms
function toggleForm(formType) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    loginForm.style.display = formType === 'signup' ? 'none' : 'block';
    signupForm.style.display = formType === 'signup' ? 'block' : 'none';
}

// Toggle password visibility
function togglePasswordVisibility(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

// Check password strength dynamically
function checkPasswordStrength() {
    const password = document.getElementById("signupPassword").value;
    const strengthMeterFill = document.getElementById("strengthMeterFill");
    const strengthText = document.getElementById("strengthText");
    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    strengthMeterFill.style.width = (strength * 20) + '%';

    if (strength <= 1) {
        strengthMeterFill.className = 'strength-meter-fill strength-weak';
        strengthText.textContent = "Weak";
        strengthText.style.color = "red";
    } else if (strength === 2) {
        strengthMeterFill.className = 'strength-meter-fill strength-medium';
        strengthText.textContent = "Medium";
        strengthText.style.color = "orange";
    } else if (strength === 3) {
        strengthMeterFill.className = 'strength-meter-fill strength-strong';
        strengthText.textContent = "Strong";
        strengthText.style.color = "yellowgreen";
    } else if (strength >= 4) {
        strengthMeterFill.className = 'strength-meter-fill strength-very-strong';
        strengthText.textContent = "Very Strong";
        strengthText.style.color = "green";
    }
}

// Attach event listeners
$(document).ready(function () {
    $('#loginFormElement').on('submit', loginUser);
    $('#signupFormElement').on('submit', signupUser);
});
