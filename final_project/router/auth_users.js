const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "erica", password: "secret" }];  // Example: [{ username: "erica", password: "secret" }]

// Function to check if a username is valid (i.e., already registered)
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Function to check if username and password match a registered user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    let accessToken = jwt.sign(
        { username: username },
        'my-secret-key',  // use the same secret key everywhere
        { expiresIn: '1h' }
    );

    // Save token in session
    req.session.authorization = {
        token: accessToken,
        username: username
    };

    return res.status(200).json({ message: "Login successful" });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized: please login first" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Missing review query parameter" });
    }

    // Add or update the review under this username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
