// Base URL for the JSON server
const baseUrl = "http://localhost:3000/posts";

/**
 * Fetches all blog posts from the server and displays them in the post list
 */
function displayPosts() {
  fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = ""; // Clear previous posts

      posts.forEach(post => appendPostToList(post)); // Render each post
    });
}

/**
 * Appends a single post title to the #post-list with a click handler
 */
function appendPostToList(post) {
  const postList = document.getElementById("post-list");

  const postDiv = document.createElement("div");
  postDiv.className = "post-preview";

  const title = document.createElement("h3");
  title.textContent = post.title;

  postDiv.appendChild(title);

  // Show details when clicked
  postDiv.addEventListener("click", () => handlePostClick(post.id));

  postList.appendChild(postDiv);
}

/**
 * Fetches and displays the full details of a single post
 * Includes Edit and Delete buttons
 */
function handlePostClick(postId) {
  fetch(`${baseUrl}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detailDiv = document.getElementById("post-detail");

      detailDiv.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="${post.title}" width="200" />
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button onclick="editPost(${post.id})">EDIT THIS POST</button>
        <button onclick="deletePost(${post.id})">DELETE THIS POST</button>
      `;
    });
}

/**
 * Adds event listener to the form for creating a new blog post
 * Submits the data to the server and displays the post in the list
 */
function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    // Grab input values
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    // Create a new post object
    const newPost = {
      title,
      author,
      content,
      image: "https://photos.google.com/photo/AF1QipM-16X45kF99KxZQCGby8_C-iJZIPQP1Z3QWSD4" // Default image
    };

    // POST the new post to the server
    fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        appendPostToList(post); // Display the new post
        form.reset(); // Clear form inputs
      });
  });
}

/**
 * Displays an editable form to update an existing blog post
 * Submits a PATCH request with the updated content
 */
function editPost(postId) {
  fetch(`${baseUrl}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detailDiv = document.getElementById("post-detail");

      detailDiv.innerHTML = `
        <h2>Edit Post</h2>
        <form id="edit-post-form">
          <input type="text" id="edit-title" value="${post.title}" required />
          <input type="text" id="edit-author" value="${post.author}" required />
          <textarea id="edit-content" required>${post.content}</textarea>
          <input type="submit" value="Update" />
        </form>
      `;

      // Listen for form submission
      document.getElementById("edit-post-form").addEventListener("submit", e => {
        e.preventDefault();

        // Prepare updated data
        const updatedPost = {
          title: document.getElementById("edit-title").value,
          author: document.getElementById("edit-author").value,
          content: document.getElementById("edit-content").value
        };

        // Send PATCH request to update post
        fetch(`${baseUrl}/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost)
        })
          .then(() => {
            displayPosts();         // Refresh post list
            handlePostClick(postId); // Show updated post
          });
      });
    });
}

/**
 * Deletes a post from the server and refreshes the UI
 */
function deletePost(postId) {
  fetch(`${baseUrl}/${postId}`, {
    method: "DELETE"
  }).then(() => {
    document.getElementById("post-detail").innerHTML = ""; // Clear details view
    displayPosts(); // Refresh the post list
  });
}

/**
 * Starts the application logic after DOM has loaded
 */
function main() {
  displayPosts();         // Show all posts in list
  addNewPostListener();   // Enable new post form
}

// Wait for DOM to load before starting app
document.addEventListener("DOMContentLoaded", main);
