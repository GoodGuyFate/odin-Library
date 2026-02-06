class Book {
  constructor(title, author, pages, read, cover) {
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

  toggleRead() {
    this.read = !this.read;
  }
}

class Library {
  #books = [];

  constructor(containerElement) {
    this.container = containerElement;
    this.loadFromLocalStorage();
  }

  get allBooks() {
    return this.#books;
  }

  addBook(newBook) {
    this.#books.push(newBook);
    this.saveToLocalStorage();
    this.render();
  }

  removeBook(id) {
    this.#books = this.#books.filter((book) => book.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  saveToLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(this.#books));
  }

  loadFromLocalStorage() {
    const savedBooks = localStorage.getItem("myLibrary");
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);

      this.#books = parsedBooks.map(
        (b) => new Book(b.title, b.author, b.pages, b.read, b.cover),
      );
    }
  }

  render() {
    this.container.innerHTML = "";

    this.#books.forEach((book) => {
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
        book.toggleRead();
        this.saveToLocalStorage();
        this.render();
      };

      card.appendChild(toggleBtnElement);

      const removeBtnElement = document.createElement("button");
      removeBtnElement.textContent = "Remove Book";
      removeBtnElement.classList.add("remove-btn");

      removeBtnElement.onclick = () => {
        this.removeBook(book.id);
      };
      card.appendChild(removeBtnElement);

      this.container.appendChild(card);
    });
  }
}

const cardContainer = document.querySelector(".book-card-container");

const myLibrary = new Library(cardContainer);

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

  if (!bookForm.checkValidity()) {
    showAllErrors();
  } else {
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
    myLibrary.addBook(newBook);
    bookForm.reset();
    modal.style.display = "none";
    document.querySelectorAll(".error").forEach((span) => {
      span.textContent = "";
      span.className = "error";
    });
  }
});

bookForm.querySelectorAll("input[required]").forEach((input) => {
  input.addEventListener("input", () => {
    const errorSpan = input.nextElementSibling;
    if (input.validity.valid) {
      errorSpan.textContent = "";
      errorSpan.className = "error";
    }
  });
});

const errorMessages = {
  title: {
    valueMissing: "Every book needs a title! What are we reading?",
  },
  author: {
    valueMissing: "Who wrote this? Please provide an author.",
  },
  pages: {
    valueMissing: "How many pages is it? Even a pamphlet has 1 page.",
  },
};

function showAllErrors() {
  const inputs = bookForm.querySelectorAll("input[required]");

  inputs.forEach((input) => {
    const errorSpan = input.nextElementSibling;
    const fieldId = input.id;

    if (!input.validity.valid) {
      if (input.validity.valueMissing) {
        errorSpan.textContent = errorMessages[fieldId].valueMissing;
      } else if (input.validity.tooShort) {
        errorSpan.textContent = errorMessages[fieldId].tooShort;
      } else if (input.validity.typeMismatch) {
        errorSpan.textContent = errorMessages[fieldId].typeMismatch;
      }

      errorSpan.className = "error active";
    }
  });
}

function updateCopyrightYear() {
  const yearSpan = document.getElementById("current-year");
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
}
updateCopyrightYear();
myLibrary.render();
