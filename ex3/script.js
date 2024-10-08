document.addEventListener('DOMContentLoaded', () => {
    const newPostInput = document.getElementById('new-post-input');
    const imageUpload = document.getElementById('image-upload');
    const addPostBtn = document.getElementById('add-post-btn');
    const postsContainer = document.getElementById('posts-container');
    const followBtn = document.getElementById('follow-btn');
    const followerCountDisplay = document.getElementById('follower-count');
    
    let uploadedImage = '';
    let followers = 0;
    let isFollowing = false;

    // Add a new post
    addPostBtn.addEventListener('click', () => {
        const newPost = newPostInput.value.trim();
        
        if (newPost || uploadedImage) { // Either post or image should be provided
            const post = {
                text: newPost,
                image: uploadedImage,
                id: Date.now(),
                comments: []
            };
            addPost(post);
            newPostInput.value = '';
            imageUpload.value = ''; // Clear image input after posting
            uploadedImage = ''; // Reset uploadedImage
            postsContainer.scrollIntoView({ behavior: 'smooth' });
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

    // Add post to the DOM
    function addPost(post) {
        const postBox = document.createElement('div');
        postBox.className = 'post-box';
        
        const postText = document.createElement('p');
        postText.textContent = post.text;
        
        if (post.image) {
            const postImage = document.createElement('img');
            postImage.src = post.image;
            postImage.alt = 'Uploaded image';
            postImage.className = 'comment-image';
            postBox.appendChild(postImage);
        }

        const commentInput = document.createElement('textarea');
        commentInput.placeholder = "Add a comment...";
        const addCommentBtn = document.createElement('button');
        addCommentBtn.textContent = "Add Comment";
        addCommentBtn.className = "add-comment-btn";

        const deletePostBtn = document.createElement('button');
        deletePostBtn.textContent = "Delete Post";
        deletePostBtn.className = "delete-post";

        deletePostBtn.addEventListener('click', () => {
            postBox.remove();
        });

        addCommentBtn.addEventListener('click', () => {
            const newComment = commentInput.value.trim();
            if (newComment) {
                const comment = {
                    text: newComment,
                    id: Date.now(),
                };
                post.comments.push(comment);
                displayComments(postBox, post.comments);
                commentInput.value = ''; // Clear input after adding comment
            }
        });

        postBox.appendChild(postText);
        postBox.appendChild(commentInput);
        postBox.appendChild(addCommentBtn);
        postBox.appendChild(deletePostBtn);

        postsContainer.appendChild(postBox);
        displayComments(postBox, post.comments);
    }

    function displayComments(postBox, comments) {
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-container';
        commentsContainer.style.marginTop = '10px';

        comments.forEach(comment => {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';
            commentBox.innerHTML = `<p>${comment.text}</p>`;
            commentsContainer.appendChild(commentBox);
        });

        postBox.appendChild(commentsContainer);
    }

    // Follow/Unfollow Logic
    followBtn.addEventListener('click', () => {
        if (isFollowing) {
            isFollowing = false;
            followers--;
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('unfollow');
        } else {
            isFollowing = true;
            followers++;
            followBtn.textContent = 'Unfollow';
            followBtn.classList.add('unfollow');
        }
        followerCountDisplay.textContent = `Followers: ${followers}`;
    });
});
