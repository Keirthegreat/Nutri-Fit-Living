// Event Listeners
document.getElementById('calculate-btn').addEventListener('click', calculateBMI);
document.getElementById('reset-btn').addEventListener('click', resetForm);
document.getElementById('record-btn').addEventListener('click', recordBMI);

let bmiRecords = []; // Array to store BMI records

function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);

    if (!height || !weight || !age) {
        alert('Please enter all fields');
        return;
    }

    const bmi = weight / (height * height);
    const bmiRounded = bmi.toFixed(1);

    displayResult(bmiRounded);
}

function displayResult(bmi) {
    const bmiValue = document.getElementById('bmi-value');
    const bmiStatusText = document.getElementById('bmi-status-text');
    const needle = document.querySelector('.needle');
    let status = '';

    bmiValue.innerText = bmi;

    if (bmi < 18.5) {
        status = 'Underweight';
        bmiStatusText.style.color = '#007bff';
        needle.style.transform = 'rotate(-45deg)';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        status = 'Normal';
        bmiStatusText.style.color = '#28a745';
        needle.style.transform = 'rotate(-15deg)';
    } else if (bmi >= 25 && bmi < 29.9) {
        status = 'Overweight';
        bmiStatusText.style.color = '#ffc107';
        needle.style.transform = 'rotate(15deg)';
    } else {
        status = 'Obese';
        bmiStatusText.style.color = '#dc3545';
        needle.style.transform = 'rotate(45deg)';
    }

    bmiStatusText.innerText = status;
}

function resetForm() {
    // Reset input fields
    document.getElementById('age').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';

    // Reset BMI result
    document.getElementById('bmi-value').innerText = '--';
    document.getElementById('bmi-status-text').innerText = '--';

    // Reset the needle position
    const needle = document.querySelector('.needle');
    needle.style.transform = 'rotate(0deg)';

    // No alert here as requested
}







document.addEventListener('DOMContentLoaded', async function () {
    // Detect user session
    const userId = detectUserSession();

    if (!userId) {
        displayNotification('User session not found. Redirecting to login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to login if session is not found
        }, 3000);
        return;
    }

    console.log('User session detected. User ID:', userId);

    // Attach event listener for recording BMI
    const recordButton = document.getElementById('record-btn');
    if (recordButton) {
        recordButton.addEventListener('click', function () {
            recordBMI(userId); // Pass userId to the recordBMI function
        });
    } else {
        console.error('Record button not found in the DOM.');
    }
});

// Function to detect user session from sessionStorage
function detectUserSession() {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID not found in session storage.');
        return null;
    }
    return userId;
}

// Function to record BMI
async function recordBMI(userId) {
    const bmiValueElement = document.getElementById('bmi-value');
    const statusElement = document.getElementById('bmi-status-text');

    if (!bmiValueElement || !statusElement) {
        console.error('BMI value or status element not found.');
        displayNotification('BMI data is unavailable. Please calculate your BMI first.', 'error');
        return;
    }

    const bmiValue = bmiValueElement.innerText;
    const status = statusElement.innerText;

    console.log('BMI Value:', bmiValue);
    console.log('BMI Status:', status);

    // Check if BMI is calculated
    if (bmiValue === '--' || status === '--') {
        displayNotification('Please calculate your BMI before recording.', 'error');
        return;
    }

    const record = {
        user_id: parseInt(userId, 10), // Ensure user_id is a number
        current_bmi: parseFloat(bmiValue), // Ensure current_bmi is a number
        timestamp: new Date().toISOString(),
    };

    console.log('Payload:', record);

    try {
        const response = await fetch('https://nutrifit-backend.onrender.com/save_dashboard.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(record),
        });

        if (!response.ok) {
            console.error('HTTP error:', response.status, response.statusText);
            displayNotification(`Failed to record BMI: HTTP error ${response.status}`, 'error');
            return;
        }

        const result = await response.json();

        if (result.status === 'success') {
            displayNotification('BMI recorded successfully.', 'success');
            console.log('Dashboard updated:', result.data);
        } else {
            console.error('Server response error:', result.message);
            displayNotification(`Failed to record BMI: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error recording BMI:', error.message);
        displayNotification('An unexpected error occurred. Please try again.', 'error');
    }
}

// Function to display notifications
function displayNotification(message, type = 'success') {
    const notification = document.getElementById('notification-container');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification-container ${type}`;
    notification.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}










