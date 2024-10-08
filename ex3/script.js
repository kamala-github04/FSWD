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
    const followersList = document.getElementById('followers-list');
    const followBtn = document.getElementById('follow-btn');
    const followerNameInput = document.getElementById('follower-name');
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
            localStorage.setItem('user', username);
            showPostSection();
        }
    });

    function showPostSection() {
        loginSection.style.display = 'none';
        postSection.style.display = 'block';
        loadPosts();
        loadFollowers();
    }

    // Logout function
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        loginSection.style.display = 'block';
        postSection.style.display = 'none';
    });

    // Add post function
    addPostBtn.addEventListener('click', () => {
        const newPost = newPostInput.value.trim();
        
        if (newPost || uploadedPostImage) {
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

    // Handle image upload
    postImageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedPostImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Load posts
    function loadPosts() {
        const posts = getPosts();
        displayPosts(posts);
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postBox = document.createElement('div');
            postBox.className = 'post-box';
            postBox.innerHTML = `
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" />` : ''}
                <button class="delete-post-btn" data-id="${post.id}">Delete Post</button>
                <h4>Comments</h4>
                <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                <button class="add-comment-btn" data-id="${post.id}">Comment</button>
                <div class="comments-container" data-id="${post.id}"></div>
            `;
            postsContainer.appendChild(postBox);
            attachCommentHandler(postBox, post.id);
            attachDeleteHandler(postBox, post.id);
            displayComments(post.comments, post.id);
        });
    }

    function attachDeleteHandler(postBox, postId) {
        const deletePostBtn = postBox.querySelector('.delete-post-btn');
        deletePostBtn.addEventListener('click', () => {
            const posts = getPosts().filter(post => post.id !== postId);
            localStorage.setItem('posts', JSON.stringify(posts));
            displayPosts(posts);
        });
    }

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
                commentInput.value = '';
            }
        });
    }

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
        attachLikeDislikeHandlers(comments, postId);
    }

    function attachLikeDislikeHandlers(comments, postId) {
        const commentBoxes = document.querySelectorAll(`.comments-container[data-id="${postId}"] .comment-box`);
        commentBoxes.forEach((commentBox, index) => {
            const likeButton = commentBox.querySelector('.like');
            const dislikeButton = commentBox.querySelector('.dislike');

            likeButton.addEventListener('click', () => {
                updateComment(postId, comments[index].id, 'like');
            });
            dislikeButton.addEventListener('click', () => {
                updateComment(postId, comments[index].id, 'dislike');
            });
        });
    }

    function updateComment(postId, commentId, action) {
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        const comment = post.comments.find(c => c.id === commentId);
        if (action === 'like') {
            comment.likes += 1;
        } else if (action === 'dislike') {
            comment.dislikes += 1;
        }
        localStorage.setItem('posts', JSON.stringify(posts));
        displayComments(post.comments, postId);
    }

    // Followers functionality
    followBtn.addEventListener('click', () => {
        const followerName = followerNameInput.value.trim();
        if (followerName && !followers.includes(followerName)) {
            followers.push(followerName);
            localStorage.setItem('followers', JSON.stringify(followers));
            followerNameInput.value = '';
            loadFollowers();
        }
    });

    function loadFollowers() {
        followersList.innerHTML = '';
        const savedFollowers = JSON.parse(localStorage.getItem('followers')) || [];
        followers = savedFollowers;
        savedFollowers.forEach(follower => {
            const followerItem = document.createElement('div');
            followerItem.textContent = follower;
            const unfollowBtn = document.createElement('button');
            unfollowBtn.className = 'unfollow-btn';
            unfollowBtn.textContent = 'Unfollow';
            unfollowBtn.addEventListener('click', () => {
                unfollow(follower);
            });
            followerItem.appendChild(unfollowBtn);
            followersList.appendChild(followerItem);
        });
    }

    function unfollow(followerName) {
        followers = followers.filter(follower => follower !== followerName);
        localStorage.setItem('followers', JSON.stringify(followers));
        loadFollowers();
    }

    // Load followers on login
    if (user) {
        loadFollowers();
    }

    // Emoji picker functionality
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('emoji')) {
            const emoji = event.target.getAttribute('data-emoji');
            const activeCommentInput = document.querySelector('.comment-input:focus');
            if (activeCommentInput) {
                activeCommentInput.value += emoji;
            }
        }
    });

    // Show/hide emoji picker
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('focus', () => {
            emojiPicker.style.display = 'flex';
        });
        input.addEventListener('blur', () => {
            setTimeout(() => {
                emojiPicker.style.display = 'none';
            }, 200);
        });
    });
});

