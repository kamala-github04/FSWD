document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const postSection = document.getElementById('post-section');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const newPostInput = document.getElementById('new-post');
    const addPostBtn = document.getElementById('add-post-btn');
    const postsContainer = document.getElementById('posts-container');
    const logoutBtn = document.getElementById('logout-btn');
    const postImageUpload = document.getElementById('post-image-upload');
    const emojiPicker = document.getElementById('emoji-picker');
    const followersContainer = document.getElementById('followers-container');
    let uploadedPostImage = '';
    let followers = [];

    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
        showPostSection();
    }

    // Login function
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            // Save user info in localStorage
            localStorage.setItem('user', username);
            showPostSection();
        }
    });

    function showPostSection() {
        loginSection.style.display = 'none';
        postSection.style.display = 'block';
        loadPosts();
        displayFollowers();
    }

    // Logout function
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user'); // Remove the user data
        loginSection.style.display = 'block'; // Show login section again
        postSection.style.display = 'none'; // Hide post section
    });

    // Add post function
    addPostBtn.addEventListener('click', () => {
        const newPost = newPostInput.value.trim();
        
        if (newPost || uploadedPostImage) { // Either post or image should be provided
            const posts = getPosts();
            const post = {
                text: newPost,
                image: uploadedPostImage,
                comments: [],
                id: Date.now()
            };
            posts.push(post);
            localStorage.setItem('posts', JSON.stringify(posts));
            displayPosts(posts);
            newPostInput.value = '';
            postImageUpload.value = '';
            uploadedPostImage = '';
        }
    });

    // Handle image upload and convert to Base64 for posts
    postImageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedPostImage = e.target.result; // Base64 string of the image
            };
            reader.readAsDataURL(file);
        }
    });

    // Load posts from localStorage
    function loadPosts() {
        const posts = getPosts();
        displayPosts(posts);
    }

    // Get posts from localStorage
    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    // Display posts in the UI
    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postBox = document.createElement('div');
            postBox.className = 'post-box';
            postBox.innerHTML = `
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" />` : ''}
                <h4>Comments</h4>
                <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                <button class="add-comment-btn" data-id="${post.id}">Comment</button>
                <div class="comments-container" data-id="${post.id}"></div>
                <button class="delete-post-btn" data-id="${post.id}">Delete Post</button>
            `;
            postsContainer.appendChild(postBox);
            attachCommentHandler(postBox, post.id);
            displayComments(post.comments, post.id);
            attachDeletePostHandler(postBox, post.id);
        });
    }

    // Attach event handler for comment button
    function attachCommentHandler(postBox, postId) {
        const addCommentBtn = postBox.querySelector('.add-comment-btn');
        const commentInput = postBox.querySelector('.comment-input');
        const commentsContainer = postBox.querySelector('.comments-container');

        addCommentBtn.addEventListener('click', () => {
            const newComment = commentInput.value.trim();
            if (newComment) {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                const comment = {
                    text: newComment,
                    likes: 0,
                    dislikes: 0,
                    id: Date.now()
                };
                post.comments.push(comment);
                localStorage.setItem('posts', JSON.stringify(posts));
                displayComments(post.comments, postId);
                commentInput.value = ''; // Clear the comment input
            }
        });
    }

    // Attach event handler for delete post button
    function attachDeletePostHandler(postBox, postId) {
        const deletePostBtn = postBox.querySelector('.delete-post-btn');
        deletePostBtn.addEventListener('click', () => {
            let posts = getPosts();
            posts = posts.filter(p => p.id !== postId); // Remove post
            localStorage.setItem('posts', JSON.stringify(posts));
            loadPosts(); // Reload posts
        });
    }

    // Display comments for a specific post
    function displayComments(comments, postId) {
        const commentsContainer = document.querySelector(`.comments-container[data-id="${postId}"]`);
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';
            commentBox.innerHTML = `
                <p>${comment.text}</p>
                <button class="like-dislike-btn like" data-id="${comment.id}">👍 ${comment.likes}</button>
                <button class="like-dislike-btn dislike" data-id="${comment.id}">👎 ${comment.dislikes}</button>
            `;
            commentsContainer.appendChild(commentBox);
        });
    }

   // Followers functionality


function displayFollowers() {
    followersContainer.innerHTML = '';
    followers.forEach(follower => {
        const followerBox = document.createElement('div');
        followerBox.className = 'follower-box'; // Added class here
        followerBox.innerHTML = `
            <span>${follower}</span>
            <button class="unfollow-btn" data-follower="${follower}">Unfollow</button>
        `;
        followersContainer.appendChild(followerBox);
    });
}

// Follow button functionality
document.getElementById('follow-btn').addEventListener('click', () => {
    const username = prompt("Enter the username to follow:");
    if (username && !followers.includes(username)) {
        followers.push(username);
        displayFollowers();
    }
});

// Unfollow button functionality
followersContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('unfollow-btn')) {
        const followerToRemove = event.target.getAttribute('data-follower');
        followers = followers.filter(follower => follower !== followerToRemove);
        displayFollowers();
    }
});


    // Emoji picker functionality
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('emoji')) {
            const emoji = event.target.getAttribute('data-emoji');
            const activeCommentInput = document.querySelector('.comment-input:focus');
            if (activeCommentInput) {
                activeCommentInput.value += emoji; // Append emoji to the comment input
            }
        }
    });

    // Show/hide emoji picker
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('focus', () => {
            emojiPicker.style.display = 'flex'; // Show emoji picker when the input is focused
        });
        input.addEventListener('blur', () => {
            setTimeout(() => {
                emojiPicker.style.display = 'none'; // Hide emoji picker when focus is lost
            }, 200); // Delay to allow emoji click
        });
    });
});
