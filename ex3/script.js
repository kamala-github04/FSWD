document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const commentSection = document.getElementById('comment-section');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const newCommentInput = document.getElementById('new-comment');
    const addCommentBtn = document.getElementById('add-comment-btn');
    const commentsContainer = document.getElementById('comments-container');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
        showCommentSection();
    }

    // Login function
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            // Save user info in localStorage
            localStorage.setItem('user', username);
            showCommentSection();
        }
    });

    function showCommentSection() {
        loginSection.style.display = 'none';
        commentSection.style.display = 'block';
        loadComments();
    }

    // Logout function
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user'); // Remove the user data
        loginSection.style.display = 'block'; // Show login section again
        commentSection.style.display = 'none'; // Hide comment section
    });

    // Add comment function
    addCommentBtn.addEventListener('click', () => {
        const newComment = newCommentInput.value.trim();
        if (newComment) {
            const comments = getComments();
            const comment = {
                text: `${newComment} 😊🎉`,  // Adds emoji after the text
                likes: 0,
                dislikes: 0,
                id: Date.now()
            };
            comments.push(comment);
            localStorage.setItem('comments', JSON.stringify(comments));
            displayComments(comments);
            newCommentInput.value = '';
            commentsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Load comments from localStorage
    function loadComments() {
        const comments = getComments();
        displayComments(comments);
    }

    // Get comments from localStorage
    function getComments() {
        return JSON.parse(localStorage.getItem('comments')) || [];
    }

    // Display comments in the UI
    function displayComments(comments) {
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';

            const commentText = document.createElement('p');
            commentText.textContent = comment.text;

            const likeBtn = document.createElement('button');
            likeBtn.className = 'like-dislike-btn like';
            likeBtn.innerHTML = `👍 (${comment.likes})`;  // Thumbs up emoji
            likeBtn.addEventListener('click', () => handleLike(comment.id));

            const dislikeBtn = document.createElement('button');
            dislikeBtn.className = 'like-dislike-btn dislike';
            dislikeBtn.innerHTML = `👎 (${comment.dislikes})`;  // Thumbs down emoji
            dislikeBtn.addEventListener('click', () => handleDislike(comment.id));

            commentBox.appendChild(commentText);
            commentBox.appendChild(likeBtn);
            commentBox.appendChild(dislikeBtn);
            commentsContainer.appendChild(commentBox);
        });
    }

    // Handle like
    function handleLike(id) {
        const comments = getComments();
        const updatedComments = comments.map(comment => {
            if (comment.id === id) {
                comment.likes += 1;
            }
            return comment;
        });
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        displayComments(updatedComments);
    }

    // Handle dislike
    function handleDislike(id) {
        const comments = getComments();
        const updatedComments = comments.map(comment => {
            if (comment.id === id) {
                comment.dislikes += 1;
            }
            return comment;
        });
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        displayComments(updatedComments);
    }
});



