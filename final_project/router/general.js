const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username) {
    return res.status(400).json({message: "Username missing"});
  } else if (!password) {
    return res.status(400).json({message: "Password missing"});
  } else {
    if(isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "Username already exists"});
    }
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const promise = new Promise((resolve) => {
      resolve(Object.values(books));
    });
    const response = await promise;
    return res.status(200).send(JSON.stringify({ books: response }, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  // try {
  const promise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  });
  return promise.then((book) => {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }).catch((error) => {
    return res.status(404).json(error);
  });
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  try {
    const promise = new Promise((resolve, reject) => {
      resolve(Object.values(books).filter(book => book.author === author));
    });
    const response = await promise;
    return res.status(200).send(JSON.stringify({ booksbyauthor: response }, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error by fetching books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  try {
    const promise = new Promise((resolve, reject) => {
      resolve(Object.values(books).filter(book => book.title === title));
    });
    const response = await promise;
    return res.status(200).send(JSON.stringify({ booksbytitle: response }, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
