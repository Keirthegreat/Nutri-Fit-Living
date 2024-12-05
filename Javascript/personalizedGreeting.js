document.addEventListener('DOMContentLoaded', async function () {
    const userId = sessionStorage.getItem('user_id'); // Get user ID from session storage

    if (!userId) {
        console.error("No user_id found in session storage. Redirecting to login...");
        window.location.href = 'login.html'; // Redirect to login if user_id is not found
        return;
    }

    try {
        console.log("Fetching user profile for user_id:", userId);
        const response = await fetch(`https://nutrifit-backend.onrender.com/get_profile.php?user_id=${userId}`);
        const result = await response.json();

        if (result.status === 'success') {
            const profileData = result.data;
            console.log("Profile Data Retrieved:", profileData);

            // Update the Hero Section with personalized greeting
            const greetingElement = document.getElementById('greeting');
            if (greetingElement) {
                const fullName = profileData.full_name || "User"; // Fallback if name is missing
                greetingElement.textContent = `Welcome, ${fullName}!`;
            } else {
                console.error("Greeting element is missing in the HTML.");
            }
        } else {
            console.error("Error fetching profile:", result.message);
        }
    } catch (error) {
        console.error("Error loading profile:", error.message);
    }
});
