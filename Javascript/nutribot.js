function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatArea = document.getElementById('chatArea');
    const botAvatarUrl = chatArea.getAttribute('data-bot-avatar');

    console.log("botAvatarUrl:", botAvatarUrl);  // Log the URL to debug

    if (userInput.value.trim() !== "") {
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `<div class="message">${userInput.value}</div>`;
        chatArea.appendChild(userMessage);

        chatArea.scrollTop = chatArea.scrollHeight;
        const messageContent = userInput.value;
        userInput.value = '';

        const thinkingIndicator = document.createElement('div');
        thinkingIndicator.className = 'typing-indicator-container bot-message';
        thinkingIndicator.innerHTML = `
            <img src="${botAvatarUrl}" alt="Nutribot Avatar" />
            <div class="message">Nutribot is typing...</div>
            <div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatArea.appendChild(thinkingIndicator);
        chatArea.scrollTop = chatArea.scrollHeight;

        const userId = sessionStorage.getItem('user_id');  // Retrieve user ID from session storage

        fetch("https://nutribot-backend.onrender.com/nutribot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: messageContent,
                user_id: userId  // Include user ID in the request body
            })
        })
        .then(response => response.json())
        .then(data => {
            chatArea.removeChild(thinkingIndicator);

            const botMessage = document.createElement('div');
            botMessage.className = 'bot-message';
            botMessage.innerHTML = `<img src="${botAvatarUrl}" alt="Nutribot Avatar" /><div class="message">${data.response || "I'm here to help you with that!"}</div>`;
            chatArea.appendChild(botMessage);

            chatArea.scrollTop = chatArea.scrollHeight;
        })
        .catch(error => {
            chatArea.removeChild(thinkingIndicator);

            const errorMessage = document.createElement('div');
            errorMessage.className = 'bot-message';
            errorMessage.innerHTML = `<img src="${botAvatarUrl}" alt="Nutribot Avatar" /><div class="message">Error: ${error.message}</div>`;
            chatArea.appendChild(errorMessage);
            chatArea.scrollTop = chatArea.scrollHeight;
        });
    }
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
