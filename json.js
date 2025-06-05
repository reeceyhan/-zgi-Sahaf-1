// api.js
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

export class API {
  static saveToDatabase(book) {
    console.log("database'e yazılıyor.");
    const db = getDatabase(
      undefined,
      "https://izgi-sahaf-default-rtdb.europe-west1.firebasedatabase.app"
    );
    const booksRef = ref(db, "books");

    push(booksRef, book)
      .then(() => {
        console.log("Kitap başarıyla veritabanına kaydedildi.");
      })
      .catch((error) => {
        console.error("Veritabanına kayıt sırasında hata oluştu:", error);
      });
  }

  static fetchBooks(callback) {
    const db = getDatabase(
      undefined,
      "https://izgi-sahaf-default-rtdb.europe-west1.firebasedatabase.app"
    );
    const booksRef = ref(db, "books");

    // onValue ile gerçek zamanlı dinleme başlatıyoruz
    onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();

        // data obje olarak geliyor, şimdi {key: value} formatında array hazırlayalım
        const books = data
          ? Object.entries(data).map(([key, value]) => ({
              key,
              ...value,
            }))
          : [];

        callback(books);
      },
      { onlyOnce: true }
    );
  }

  static deleteBook(bookId) {
    const db = getDatabase(
      undefined,
      "https://izgi-sahaf-default-rtdb.europe-west1.firebasedatabase.app"
    );
    const bookRef = ref(db, `books/${bookId}`);

    return remove(bookRef)
      .then(() => {
        console.log(`Kitap ${bookId} başarıyla silindi.`);
      })
      .catch((error) => {
        console.error("Silme işleminde hata:", error);
      });
  }

  static updateBook(bookId, updatedData) {
    const db = getDatabase(
      undefined,
      "https://izgi-sahaf-default-rtdb.europe-west1.firebasedatabase.app"
    );
    const bookRef = ref(db, `books/${bookId}`);
    return update(bookRef, updatedData)
      .then(() => {
        console.log(`Kitap ${bookId} başarıyla güncellendi.`);
      })
      .catch((error) => {
        console.error("Güncelleme sırasında hata oluştu:", error);
      });
  }

  static markAsSold(bookId) {
    const db = getDatabase(
      undefined,
      "https://izgi-sahaf-default-rtdb.europe-west1.firebasedatabase.app"
    );
    const bookRef = ref(db, `books/${bookId}`);

    return update(bookRef, { selled: true })
      .then(() => {
        console.log(`Kitap ${bookId} başarıyla satıldı olarak işaretlendi.`);
      })
      .catch((error) => {
        console.error("Satıldı güncellemesi sırasında hata:", error);
      });
  }
}

export default API;
