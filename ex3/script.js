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
    const imageUpload = document.getElementById('image-upload');
    const emojiPicker = document.getElementById('emoji-picker');
    let uploadedImage = '';

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
        
        if (newComment || uploadedImage) { // Either comment or image should be provided
            const comments = getComments();
            const comment = {
                text: newComment,
                image: uploadedImage, // Store image in comment object
                likes: 0,
                dislikes: 0,
                id: Date.now()
            };
            comments.push(comment);
            localStorage.setItem('comments', JSON.stringify(comments));
            displayComments(comments);
            newCommentInput.value = '';
            imageUpload.value = ''; // Clear image input after posting
            uploadedImage = ''; // Reset uploadedImage
            commentsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Handle image upload and convert to Base64
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = e.target.result; // Base64 string of the image
            };
            reader.readAsDataURL(file);
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
            commentBox.innerHTML = `
                <p>${comment.text}</p>
                ${comment.image ? `<img src="${comment.image}" alt="Comment image" class="comment-image" />` : ''}
                <button class="like-dislike-btn like" data-id="${comment.id}">👍 ${comment.likes}</button>
                <button class="like-dislike-btn dislike" data-id="${comment.id}">👎 ${comment.dislikes}</button>
            `;
            commentsContainer.appendChild(commentBox);
        });
        attachLikeDislikeHandlers();
    }

    // Attach event handlers for like/dislike buttons
    function attachLikeDislikeHandlers() {
        const likeButtons = document.querySelectorAll('.like-dislike-btn.like');
        const dislikeButtons = document.querySelectorAll('.like-dislike-btn.dislike');

        likeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                updateComment(id, 'like');
            });
        });

        dislikeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                updateComment(id, 'dislike');
            });
        });
    }

    // Update likes/dislikes in localStorage
    function updateComment(id, action) {
        const comments = getComments();
        const comment = comments.find(c => c.id === Number(id));
        if (action === 'like') {
            comment.likes += 1;
        } else if (action === 'dislike') {
            comment.dislikes += 1;
        }
        localStorage.setItem('comments', JSON.stringify(comments));
        displayComments(comments);
    }

    // Emoji picker functionality
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('emoji')) {
            const emoji = event.target.getAttribute('data-emoji');
            newCommentInput.value += emoji; // Append emoji to the comment input
        }
    });

    // Show/hide emoji picker
    newCommentInput.addEventListener('focus', () => {
        emojiPicker.style.display = 'flex'; // Show emoji picker on focus
    });

    newCommentInput.addEventListener('blur', () => {
        emojiPicker.style.display = 'none'; // Hide emoji picker when input loses focus
    });
});





