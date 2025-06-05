import { Book } from "./book.js";
import { API } from "./json.js";
import { UI } from "./ui.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWl2Cjkkg8MegHgUH0VQkEpUv5wwpKFL4",
  authDomain: "izgi-sahaf.firebaseapp.com",
  projectId: "izgi-sahaf",
  storageBucket: "izgi-sahaf.firebasestorage.app",
  messagingSenderId: "395681053729",
  appId: "1:395681053729:web:738ace264c303ed9cbb760",
  measurementId: "G-MDJLPLWLM0",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const bkname = document.getElementById("name");
const writer = document.getElementById("writer");
const type = document.getElementById("type");
const publisher = document.getElementById("publisher");
const year = document.getElementById("year");
const price = document.getElementById("price");
const loc = document.getElementById("location");
const piece = document.getElementById("piece");

const filterList = document.getElementById("filter-list");
const filterInput = document.getElementById("filter-input");

const inputs = document.querySelectorAll(".form-control");

document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const book = new Book(
    bkname.value,
    writer.value,
    type.value,
    publisher.value,
    year.value,
    price.value,
    loc.value,
    piece.value
  );
  UI.clearinputs(inputs);
  API.saveToDatabase(book);
  UI.addBook(book, 1);

  const deletes = document.querySelectorAll(".dlt-book");

  for (const e of deletes) {
    e.addEventListener("click", function (e) {
      const item = e.target;
      UI.dltBook(item);
    });
  }

  const edits = document.querySelectorAll(".edit-book");

  for (const e of edits) {
    e.addEventListener("click", function (pressed) {
      const item = pressed.target;
      UI.editBook(item);
    });
  }
});

document.getElementById("filter-input").addEventListener("input", function (e) {
  const value = e.target.value;
  UI.filtering(filterList.value, value);
});

const deletes = document.querySelectorAll(".dlt-book");

const edits = document.querySelectorAll(".edit-book");

const bookTableBody = document.querySelector("#books-table");

bookTableBody.addEventListener("click", (e) => {
  const target = e.target;
  const tr = target.closest("tr");

  if (target.classList.contains("dlt-book")) {
    const bookId = UI.dltBook(target);

    API.deleteBook(bookId).then(() => {
      tr.remove();
    });
  } else if (target.classList.contains("edit-book")) {
    UI.editBook(target);
  } else if (target.classList.contains("sell-book")) {
    const bookId = tr.getAttribute("data-id");
    if (!bookId) return;

    API.markAsSold(bookId).then(() => {
      // UI'da butonu pasifleştir
      target.disabled = true;
      target.textContent = "Satıldı";

      // İsteğe bağlı: Satıldı satırını farklı renkle göstermek istersen
      tr.classList.add("sold");
    });
  }
});

API.fetchBooks((books) => {
  books.forEach((book) => {
    console.log(book.key, book.name, book.writer);
    UI.addBook(book, book.key);
  });
});

const isSelledCheckbox = document.querySelector("#is-selled");

isSelledCheckbox.addEventListener("change", () => {
  API.fetchBooks((books) => {
    const filteredBooks = isSelledCheckbox.checked
      ? books.filter((book) => book.selled === true)
      : books;

    UI.clearTable(); // varsa tabloyu temizle
    for (const [id, book] of Object.entries(filteredBooks)) {
      UI.addSelledBook(book, id);
    }
  });
});
