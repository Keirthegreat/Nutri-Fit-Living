document.addEventListener('DOMContentLoaded', async function () {
    // Detect user session
    const userId = detectUserSession();

    if (!userId) {
        showNotification('User session not found. Redirecting to login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to login if session is not found
        }, 3000);
        return;
    }

    console.log('User session detected. User ID:', userId);

    // Initialize default values
    let dailyCalorieGoal = 2000; // Default daily calorie goal
    let totalCaloriesConsumed = 0; // Initialize consumed calories

    // Get DOM elements
    const toggleGoalEdit = document.getElementById('toggleGoalEdit');
    const dailyGoalInput = document.getElementById('dailyGoal');
    const calorieGoalDisplay = document.getElementById('calorieGoalDisplay');
    const progressFill = document.getElementById('progressFill');
    const caloriesConsumedDisplay = document.getElementById('caloriesConsumed');
    const mealList = document.getElementById('mealList');
    const addMealButton = document.getElementById('addMealButton');
    const mealNameInput = document.getElementById('mealName');
    const mealCaloriesInput = document.getElementById('mealCalories');
    const saveCaloriesButton = document.getElementById('saveCaloriesButton');

    // Toggle edit for daily goal
    toggleGoalEdit.addEventListener('click', () => {
        dailyGoalInput.style.display = dailyGoalInput.style.display === 'none' ? 'block' : 'none';
        dailyGoalInput.focus();
    });

    // Update daily goal
    dailyGoalInput.addEventListener('input', function () {
        dailyCalorieGoal = parseInt(dailyGoalInput.value) || 2000; // Fallback to default goal
        calorieGoalDisplay.textContent = `${dailyCalorieGoal} cal`;
        updateProgress();
    });

    // Update progress bar dynamically
    function updateProgress() {
        const progressPercentage = (totalCaloriesConsumed / dailyCalorieGoal) * 100;
        progressFill.style.setProperty('--progress-width', `${Math.min(progressPercentage, 100)}%`); // Update CSS variable
    }

    // Update calories consumed display
    function updateCaloriesConsumed() {
        caloriesConsumedDisplay.textContent = `${totalCaloriesConsumed} cal`;
        calorieGoalDisplay.textContent = `${dailyCalorieGoal} cal`;
        updateProgress();
    }

    // Add meal and update calories
    addMealButton.addEventListener('click', function () {
        const mealName = mealNameInput.value.trim();
        const mealCalories = parseInt(mealCaloriesInput.value);

        if (mealName && mealCalories && mealCalories > 0) {
            // Add meal to the list
            const mealItem = document.createElement('li');
            mealItem.className = 'meal-list-item';
            mealItem.innerHTML = `
                <span>${mealName} (${mealCalories} cal)</span>
                <button class="delete-meal-btn" aria-label="Delete meal">✖</button>
            `;
            mealList.appendChild(mealItem);

            // Update the total calories consumed
            totalCaloriesConsumed += mealCalories;
            updateCaloriesConsumed();

            // Add delete functionality to the new meal item
            mealItem.querySelector('.delete-meal-btn').addEventListener('click', function () {
                totalCaloriesConsumed -= mealCalories;
                mealItem.remove();
                updateCaloriesConsumed();
            });

            // Clear input fields
            mealNameInput.value = '';
            mealCaloriesInput.value = '';
        } else {
            showNotification('Please enter a valid meal name and calorie amount.', 'error');
        }
    });

 // Save daily goal and calories consumed to backend
 saveCaloriesButton.addEventListener('click', async function () {
    const payload = {
        user_id: parseInt(userId, 10),
        calories_consumed: totalCaloriesConsumed,
        Target: dailyCalorieGoal,
    };

    console.log('Payload to send:', payload);

    try {
        const response = await fetch('https://nutrifit-backend.onrender.com/update_dashboard.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorMessage = 'Failed to save calories. Please try again.';
            showNotification(errorMessage, 'error'); // Display custom notification
            return;
        }

        const result = await response.json();
        if (result.status === 'success') {
            const successMessage = 'Calories and daily goal saved successfully.';
            showNotification(successMessage, 'success'); // Display custom notification
        } else {
            const errorMessage = `Failed to save data: ${result.message}`;
            showNotification(errorMessage, 'error'); // Display custom notification
        }
    } catch (error) {
        const errorMessage = 'An unexpected error occurred. Please try again.';
        showNotification(errorMessage, 'error'); // Display custom notification
    }
});

// Function to display notifications
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;

    // Set message and type
    notificationContainer.textContent = message;
    notificationContainer.className = `notification-container ${type}`;
    notificationContainer.style.display = 'block'; // Show the notification

    // Hide after 3 seconds
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 3000);
}


// Function to display notifications
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;

    // Set message and type
    notificationContainer.textContent = message;
    notificationContainer.className = `notification-container ${type}`;
    notificationContainer.style.display = 'block'; // Show the notification

    // Hide after 3 seconds
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 3000);
}



    // Initial update of the progress bar and calorie displays
    updateCaloriesConsumed();
});

// Function to detect user session
function detectUserSession() {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID not found in session storage.');
        return null;
    }
    return userId;
}

// Function to display notifications
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;

    notificationContainer.textContent = message;
    notificationContainer.className = `notification-container ${type}`;
    notificationContainer.classList.add('show');

    setTimeout(() => {
        notificationContainer.classList.remove('show');
    }, 3000);
}






























        // Food Search and Suggestions
        const foodInput = document.getElementById('foodInput');
        const suggestionsList = document.getElementById('suggestions');
        const searchButton = document.getElementById('searchButton');
        const loadingElement = document.getElementById('loading');
        const errorMessage = document.getElementById('error-message');
        const resultCard = document.getElementById('results');
        const foodImage = document.getElementById('food-image');

        // Hide results and error message initially
        resultCard.style.display = 'none';
        errorMessage.style.display = 'none';
        loadingElement.style.display = 'none';

        foodInput.addEventListener('input', function () {
            const query = this.value;
            if (query.length > 2) {
                const apiUrl = "https://trackapi.nutritionix.com/v2/search/instant?query=" + query;

                fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "x-app-id": "2eb6eb6f",
                        "x-app-key": "14ea7c7ef2a61f33851d4e78353cce08"
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const suggestions = data.common;
                        suggestionsList.innerHTML = '';
                        suggestions.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item.food_name;
                            li.addEventListener('click', function () {
                                foodInput.value = item.food_name;
                                suggestionsList.style.display = 'none'; // Hide suggestions when selected
                            });
                            suggestionsList.appendChild(li);
                        });

                        suggestionsList.style.display = suggestions.length > 0 ? 'block' : 'none'; // Show or hide suggestions
                    });
            } else {
                suggestionsList.style.display = 'none'; // Hide suggestions when input is empty or too short
            }
        });

        searchButton.addEventListener('click', function () {
            const food = foodInput.value.trim();

            if (!food) {
                alert('Please enter a food to search.');
                return;
            }

            const apiUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients";

            searchButton.classList.add('searching');
            loadingElement.style.display = 'block'; // Show the loading spinner
            errorMessage.style.display = 'none';
            resultCard.style.display = 'none'; // Hide previous results on new search

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": "2eb6eb6f",
                    "x-app-key": "14ea7c7ef2a61f33851d4e78353cce08"
                },
                body: JSON.stringify({
                    query: food
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.foods && data.foods.length > 0) {
                        const foodItem = data.foods[0];
                        document.getElementById('food-name').innerText = foodItem.food_name;
                        document.getElementById('calories').innerText = Math.round(foodItem.nf_calories);
                        document.getElementById('proteins').innerText = Math.round(foodItem.nf_protein);
                        document.getElementById('fats').innerText = Math.round(foodItem.nf_total_fat);
                        document.getElementById('carbs').innerText = Math.round(foodItem.nf_total_carbohydrate);

                        foodImage.src = foodItem.photo ? foodItem.photo.highres : 'default-image.jpg';
                        resultCard.style.display = 'flex'; // Show the result card after a successful search
                    } else {
                        errorMessage.style.display = 'block'; // Show error if no food is found
                        errorMessage.innerText = 'No food data found. Try another search.';
                    }
                })
                .catch(error => {
                    errorMessage.style.display = 'block'; // Show error on failure
                    errorMessage.innerText = `Error retrieving food data: ${error.message}`;
                })
                .finally(() => {
                    searchButton.classList.remove('searching');
                    loadingElement.style.display = 'none'; // Hide the loading spinner
                });
        });

        // Allow Enter key to trigger search
        foodInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
   
   document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    menuToggle.addEventListener('click', function() {
        // Toggle active classes
        this.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        this.classList.remove('active');
        body.classList.remove('menu-open');
    });

    // Close menu when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Prevent menu from staying open on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});











function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error('Notification container not found in the DOM.');
        return;
    }

    notificationContainer.textContent = message; // Set the message
    notificationContainer.className = `notification-container ${type}`; // Apply type class
    notificationContainer.classList.add('show'); // Add the show class

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notificationContainer.classList.remove('show');
    }, 3000);
}
