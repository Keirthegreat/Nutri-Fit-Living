  // Simulate a Community Page
const feed = document.getElementById("feed"); // Reference to the feed section
const newQuestionInput = document.getElementById("newQuestionInput"); // Input field for new questions

// Function to post a question
function postQuestion() {
    const questionText = newQuestionInput.value.trim();

    if (questionText === "") {
        alert("Please enter a question to post.");
        return;
    }

    // Create a new question card
    const questionCard = createQuestionCard("You", "just now", questionText, ["#Community"]);

    // Append the new question card to the feed
    feed.prepend(questionCard);

    // Clear the input field
    newQuestionInput.value = "";
}

// Function to post an answer
function postAnswer() {
    const questionText = newQuestionInput.value.trim();

    if (questionText === "") {
        alert("Please enter an answer to post.");
        return;
    }

    // Create a new answer card
    const answerCard = createQuestionCard("You", "just now", questionText, ["#Answer"]);

    // Append the new answer card to the feed
    feed.prepend(answerCard);

    // Clear the input field
    newQuestionInput.value = "";
}

// Function to post a general update
function postUpdate() {
    const updateText = newQuestionInput.value.trim();

    if (updateText === "") {
        alert("Please enter some text to post an update.");
        return;
    }

    // Create a new update card
    const updateCard = createQuestionCard("You", "just now", updateText, ["#Update"]);

    // Append the new update card to the feed
    feed.prepend(updateCard);

    // Clear the input field
    newQuestionInput.value = "";
}

// Helper function to create a question/answer/update card
function createQuestionCard(userName, timestamp, text, tags) {
    // Create the card container
    const card = document.createElement("div");
    card.classList.add("question-card");

    // Create the card header
    const header = document.createElement("div");
    header.classList.add("question-header");

    const avatar = document.createElement("img");
    avatar.src = "https://via.placeholder.com/40";
    avatar.alt = "User Avatar";
    avatar.classList.add("question-avatar");

    const userInfo = document.createElement("div");
    userInfo.classList.add("question-user-info");

    const userNameElement = document.createElement("h4");
    userNameElement.textContent = userName;

    const timestampElement = document.createElement("span");
    timestampElement.textContent = timestamp;

    userInfo.appendChild(userNameElement);
    userInfo.appendChild(timestampElement);
    header.appendChild(avatar);
    header.appendChild(userInfo);

    // Create the card text
    const questionText = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.textContent = text;

    // Create the card tags
    const tagContainer = document.createElement("div");
    tagContainer.classList.add("question-tags");

    tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tagContainer.appendChild(tagElement);
    });

    // Create the comment section
    const commentSection = document.createElement("div");
    commentSection.classList.add("comment-section");

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Write a comment...";
    commentInput.classList.add("comment-input");

    const commentButton = document.createElement("button");
    commentButton.textContent = "Post Comment";
    commentButton.classList.add("comment-button");

    // Append the input and button to the comment section
    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentButton);

    // Append the comments list
    const commentsList = document.createElement("div");
    commentsList.classList.add("comments-list");

    commentSection.appendChild(commentsList);

    // Add functionality to the comment button
    commentButton.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (commentText === "") {
            alert("Please enter a comment.");
            return;
        }

        // Add comment to the comments list
        const commentItem = document.createElement("p");
        commentItem.classList.add("comment-item");
        commentItem.textContent = `You: ${commentText}`;
        commentsList.appendChild(commentItem);

        // Clear the comment input
        commentInput.value = "";
    });

    // Assemble the card
    card.appendChild(header);
    card.appendChild(questionText);
    card.appendChild(tagContainer);
    card.appendChild(commentSection);

    return card;
}


