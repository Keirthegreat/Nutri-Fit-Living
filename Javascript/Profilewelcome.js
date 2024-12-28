document.addEventListener("DOMContentLoaded", async function() {
    const userId = localStorage.getItem('user_id');  // Get the user ID from local storage

    if (!userId) {
        console.error("User ID not found in local storage");
        return;
    }

    // Fetch user profile data using the retrieved user ID
    const response = await fetch(`https://nutrifit-backend.onrender.com/fetchUserFitnessProfile.php?user_id=${userId}`);
    if (response.ok) {
        const result = await response.json();
        console.log(result);  // Log the entire response to see its structure
        const data = result.data;  // Access the data object within the result
        const welcomeMessage = document.getElementById("welcomeMessage");
        if (data && welcomeMessage) {
            const { full_name, age, height, weight, target_weight, ideal_bmi } = data;
            welcomeMessage.innerHTML = `
                Hi ${full_name}! I'm Nutribot, your fitness assistant.
                Here’s your profile fitness data summary:
                <br> Age: ${age}
                <br> Height: ${height} cm
                <br> Weight: ${weight} kg
                <br> Target Weight: ${target_weight} kg
                <br> Ideal BMI: ${ideal_bmi}
                <br> How can I assist you today?
            `;
        }
    } else {
        console.error("Failed to fetch user profile data");
    }
});
