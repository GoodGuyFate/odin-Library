function Book(title, author, pages, read) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  if (typeof read !== "boolean") {
    throw TypeError("The 'read' parameter must be true or false")
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function () {
  let readStatus = this.read ? "read" : "not read";
  return `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
};
Book.prototype.sayHello = function() {
    console.log("Hello!")
}
Book.prototype.getTitle = function() {
    return`${this.title}`
}

const myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}
addBookToLibrary("The Hobbit", "J.R.R Tolkien", 300, false);
addBookToLibrary("Harry Potter and the Philosopher's Stone", "JK Rowling", 360, true);
addBookToLibrary("Percy Jackson The Lightning Thief", "Rick Riordan", 375, true )

function displayBooks(arr) {
    arr.forEach((book, index) => {
        console.log(`Book ${index + 1}: ${book.getTitle()}`)
    })
}
console.table(myLibrary)
displayBooks(myLibrary)

const modal = document.getElementById('form-modal')
const closeBtn = document.querySelector('.close-button')

const openBtn = document.getElementById('add-book-btn')

openBtn.onclick = () => modal.style.display = 'block'
closeBtn.onclick = () => modal.style.display = 'none'

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none'
    }
}
// console.log(myLibrary);
// console.log(Object.getPrototypeOf(myLibrary[0]) === Book.prototype);
// console.log(myLibrary[0].info())
