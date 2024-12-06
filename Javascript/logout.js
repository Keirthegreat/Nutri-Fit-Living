const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                console.log('Logout button detected in DOM:', logoutButton);

                // Attach the event listener
                logoutButton.addEventListener('click', (event) => {
                    console.log('Logout button clicked');
                    event.preventDefault();

                    // Clear session and redirect
                    console.log('Clearing user data...');
                    localStorage.clear();
                    sessionStorage.clear();
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });

                    console.log('Redirecting to index.html');
                    window.location.href = 'index.html';
                });

                // Stop observing once the button is found
                observer.disconnect();
            }
        }
    });
});

// Observe the navbar container for changes
const navbarContainer = document.getElementById('navbar-container');
if (navbarContainer) {
    observer.observe(navbarContainer, { childList: true, subtree: true });
} else {
    console.error('Navbar container not found in the DOM');
}
