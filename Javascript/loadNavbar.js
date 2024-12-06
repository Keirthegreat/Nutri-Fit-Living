document.addEventListener('DOMContentLoaded', () => {
    fetch('/navbar.html') // Replace with the actual path to navbar.html
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load navbar. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Insert the navbar HTML into the container
            const navbarContainer = document.getElementById('navbar-container');
            navbarContainer.innerHTML = data;
  
            // Reinitialize navbar.js after the navbar is loaded
            initializeNavbar();
  
            // Initialize additional event listeners for the navbar
            initializeLogoutButton();
        })
        .catch(error => console.error('Error loading navbar:', error));
  });
  
  // Function to initialize the navbar functionality
  function initializeNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
  
    if (menuToggle && nav && overlay) {
        // Toggle menu on click
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
  
        // Close menu on overlay click
        overlay.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
  
        // Close menu on Escape key press
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
  
        // Close menu on window resize (for larger screens)
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    } else {
        console.error('Navbar elements not found for initialization.');
    }
  }
  
  // Function to initialize the logout button functionality
  function initializeLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
  
    if (logoutButton) {
        console.log('Logout button found:', logoutButton);
  
        logoutButton.addEventListener('click', (event) => {
            console.log('Logout button clicked');
            event.preventDefault();
  
            // Clear session and local storage
            console.log('Clearing user data...');
            localStorage.clear();
            sessionStorage.clear();
  
            // Clear cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
  
            // Redirect to login page
            console.log('Redirecting to login.html');
            window.location.href = 'index.html';
        });
    } else {
        console.error('Logout button not found in the DOM.');
    }
  }
  






