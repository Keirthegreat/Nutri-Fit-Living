 // Animate progress bars
        document.addEventListener('DOMContentLoaded', () => {
            // Animate progress bars
            setTimeout(() => {
                document.querySelectorAll('.progress-bar').forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = `${progress}%`;
                });
            }, 500);

            // Initialize weight chart
            const ctx = document.getElementById('weightChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Weight Progress',
                        data: [85, 84, 82.5, 81.8],
                        borderColor: '#00b4d8',
                        backgroundColor: 'rgba(0, 180, 216, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    }
                }
            });
        });







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
        
                    // Update the Current Weight dynamically
                    const currentWeight = parseFloat(profileData.weight_kg) || 0; // Default to 0 if missing
                    const targetWeight = parseFloat(profileData.target_weight) || 0; // Default to 0 if missing
                    const idealBMI = parseFloat(profileData.ideal_bmi) || 0; // Default to 0 if missing
                    const currentBMI = ((currentWeight / Math.pow((profileData.height_cm / 100), 2)) || 0).toFixed(1); // Calculate BMI
        
                    const currentWeightElement = document.querySelector('.metric-card .metric-values span:nth-child(1)');
                    const targetWeightElement = document.querySelector('.metric-card .metric-values span:nth-child(2)');
                    const progressBarElement = document.querySelector('.metric-card .progress-bar');
                    const bmiValuesElement = document.querySelector('.metric-card:nth-of-type(2) .metric-values'); // BMI metric card selector
        
                    // Update Current and Target Weight
                    if (currentWeightElement) {
                        currentWeightElement.textContent = `Current: ${currentWeight}kg`;
                    } else {
                        console.error("Current weight element not found in the DOM.");
                    }
        
                    if (targetWeightElement) {
                        targetWeightElement.textContent = `Target: ${targetWeight}kg`;
                    } else {
                        console.error("Target weight element not found in the DOM.");
                    }
        
                    // Update the progress bar
                    if (progressBarElement && currentWeight > 0 && targetWeight > 0) {
                        const progressPercentage = Math.max(
                            0,
                            Math.min(100, ((targetWeight - currentWeight) / targetWeight) * 100)
                        );
        
                        progressBarElement.style.width = `${progressPercentage}%`;
                        progressBarElement.setAttribute('data-progress', progressPercentage.toFixed(1));
                        console.log(`Progress updated: ${progressPercentage.toFixed(1)}%`);
                    } else {
                        console.error("Progress bar element not found or invalid data for progress calculation.");
                    }
        
                    // Update the BMI status
                    if (bmiValuesElement) {
                        bmiValuesElement.innerHTML = `
                            <span>Current: ${currentBMI}</span>
                            <span>Ideal: ${idealBMI}</span>
                        `;
                    } else {
                        console.error("BMI metric element not found in the DOM.");
                    }
        
                } else {
                    console.error("Error fetching profile:", result.message);
                }
            } catch (error) {
                console.error("Error loading profile:", error.message);
            }
        });






        

        document.addEventListener('DOMContentLoaded', function () {
            const userId = detectUserSession(); // Function to detect the user ID from the session
        
            if (!userId) {
                showNotification('User session not found. Redirecting to login...', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login page
                }, 3000);
                return;
            }
        
            // API URL
            const apiUrl = `https://nutrifit-backend.onrender.com/fetch_dashboard.php?user_id=${userId}`;
        
            // Fetch data from API
            async function fetchDashboardData() {
                try {
                    const response = await fetch(apiUrl);
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
        
                    const data = await response.json();
        
                    if (data.status === 'success') {
                        updateMetrics(data.data);
                        showNotification('Data loaded successfully.', 'success');
                    } else {
                        showNotification(data.message || 'Error loading data.', 'error');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                    showNotification('An unexpected error occurred while fetching data.', 'error');
                }
            }
        
            // Update metric cards with fetched data
            function updateMetrics(data) {
                // BMI Card
                const currentBmiSpan = document.querySelector('.metric-card:nth-child(2) .metric-values span:nth-child(1)');
                const idealBmiSpan = document.querySelector('.metric-card:nth-child(2) .metric-values span:nth-child(2)');
                const bmiProgressBar = document.querySelector('.metric-card:nth-child(2) .progress-bar');
        
                // Update BMI values
                currentBmiSpan.textContent = `Current: ${data.current_bmi || 'N/A'}`;
                idealBmiSpan.textContent = `Ideal: 23.0`; // Assuming a fixed ideal BMI; update if dynamic.
                const bmiProgress = Math.min((data.current_bmi / 23.0) * 100, 100); // Calculate BMI progress percentage
                bmiProgressBar.style.width = `${bmiProgress}%`;
        
                // Calories Card
                const consumedCaloriesSpan = document.querySelector('.metric-card:nth-child(3) .metric-values span:nth-child(1)');
                const targetCaloriesSpan = document.querySelector('.metric-card:nth-child(3) .metric-values span:nth-child(2)');
                const caloriesProgressBar = document.querySelector('.metric-card:nth-child(3) .progress-bar');
        
                // Update Calories values
                consumedCaloriesSpan.textContent = `Consumed: ${data.calories_consumed || 'N/A'}`;
                targetCaloriesSpan.textContent = `Target: ${data.Target || 'N/A'}`;
                const caloriesProgress = Math.min((data.calories_consumed / data.Target) * 100, 100); // Calculate calories progress percentage
                caloriesProgressBar.style.width = `${caloriesProgress}%`;
            }
        
            // Call the API function to fetch and update metrics
            fetchDashboardData();
        });
        
        // Function to detect user session
        function detectUserSession() {
            return sessionStorage.getItem('user_id'); // Replace with your logic to retrieve user ID
        }
        
        // Function to show notifications
        function showNotification(message, type = 'success') {
            const notificationContainer = document.getElementById('notification-container');
            if (!notificationContainer) return;
        
            notificationContainer.textContent = message;
            notificationContainer.className = `notification-container ${type}`;
            notificationContainer.style.display = 'block';
        
            setTimeout(() => {
                notificationContainer.style.display = 'none';
            }, 3000);
        }
        
        
        
         
         
        

     



