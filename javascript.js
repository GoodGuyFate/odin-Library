function Book(title, author, pages, read, cover) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  if (typeof read !== "boolean") {
    throw TypeError("The 'read' parameter must be true or false");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.cover = cover;
}

Book.prototype.info = function () {
  let readStatus = this.read ? "read" : "not read";
  return `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
};
Book.prototype.sayHello = function () {
  console.log("Hello!");
};
Book.prototype.getTitle = function () {
  return `${this.title}`;
};

const myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}

function displayBooks(arr) {
  arr.forEach((book, index) => {
    console.log(`Book ${index + 1}: ${book.getTitle()}`);
  });
}

const modal = document.getElementById("form-modal");
const closeBtn = document.querySelector(".close-button");

const openBtn = document.getElementById("add-book-btn");

openBtn.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const bookForm = document.getElementById("new-book-form");

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const read = document.getElementById("read").checked;

  const fileInput = document.getElementById("cover");
  const file = fileInput.files[0];
  let coverPath = "images/blank-cover.jpg";

  if (file) {
    coverPath = URL.createObjectURL(file);
  }

  const newBook = new Book(title, author, pages, read, coverPath);
  myLibrary.push(newBook);

  renderLibrary();
  bookForm.reset();
  modal.style.display = "none";
});

const cardContainer = document.querySelector(".book-card-container");

function renderLibrary() {
  cardContainer.innerHTML = "";

  myLibrary.forEach((book, index) => {
    const card = document.createElement("div");
    card.classList.add("book-card-item");
    const coverImage = document.createElement("img");
    coverImage.src = book.cover || "images/blank-cover.jpg";
    coverImage.alt = "Book cover";
    card.appendChild(coverImage);

    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;
    titleElement.classList.add("book-title");
    card.appendChild(titleElement);

    const authorElement = document.createElement("p");
    authorElement.textContent = book.author;
    card.appendChild(authorElement);

    const readElement = document.createElement("p");
    readElement.textContent = book.read ? "Read" : "Not Read";
    card.appendChild(readElement);

    const toggleBtnElement = document.createElement("button");
    toggleBtnElement.textContent = "Toggle Read";
    toggleBtnElement.classList.add("toggle-btn");

    toggleBtnElement.onclick = () => {
      book.read = !book.read;
      renderLibrary();
    };

    card.appendChild(toggleBtnElement);

    const removeBtnElement = document.createElement("button");
    removeBtnElement.textContent = "Remove Book";
    removeBtnElement.classList.add("remove-btn");

    removeBtnElement.onclick = () => {
      myLibrary.splice(index, 1);
      renderLibrary();
    };
    card.appendChild(removeBtnElement);

    cardContainer.appendChild(card);
  });
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}
updateCopyrightYear();