document.addEventListener("DOMContentLoaded", async function() {
    const userId = "your_user_id_here";  // Replace with actual user ID or method to get user ID
    const response = await fetch(`https://nutrifit-backend.onrender.com/get_profile.php?user_id=${userId}`);
    if (response.ok) {
        const data = await response.json();
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
