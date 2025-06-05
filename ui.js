import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

export class UI {
  static addBook(e, key) {
    const table = document.getElementById("books-table");

    table.innerHTML += `<tr data-id="${key}">
                <td>
                  <span class="display-text">${e.name}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.writer}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.type}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.publisher}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.year}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.price}</span
                  ><input
                    type="number"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.location}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <span class="display-text">${e.piece}</span
                  ><input
                    type="text"
                    class="edit-input"
                    style="display: none"
                  />
                </td>
                <td>
                  <button href="#" class="btn btn-danger dlt-book">Sil</button>
                </td>
                <td>
                  <button href="#" class="btn btn-warning edit-book">
                    Düzenle
                  </button>
                </td>
                <td>
                  <button href="#" class="btn btn-success sell-book">
                    Satıldı
                  </button>
                </td>
                <td style="display: none">
                  <button
                    class="btn btn-success save-book"
                    style="display: none"
                  >
                    Kaydet
                  </button>
                </td>
                <td style="display: none">
                  <button
                    class="btn btn-danger cancel-book"
                    style="display: none"
                  >
                    Vazgeç
                  </button>
                </td>
              </tr>`;
  }

  static addSelledBook(book, id) {
    const bookTableBody = document.getElementById("books-table");
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", id);

    const isSelledView = document.querySelector("#is-selled").checked;

    tr.innerHTML = `
    <td><span class="display-text">${book.name}</span></td>
    <td><span class="display-text">${book.writer}</span></td>
    <td><span class="display-text">${book.publisher}</span></td>
    <td><span class="display-text">${book.price}</span></td>
    ${
      isSelledView
        ? "" // Satıldı görünümündeyse butonlar yok
        : `<td>
            <button class="edit-book">Düzenle</button>
            <button class="dlt-book">Sil</button>
            <button class="sell-book" ${book.selled ? "disabled" : ""}>
              ${book.selled ? "Satıldı" : "Satıldı olarak işaretle"}
            </button>
          </td>`
    }
  `;

    bookTableBody.appendChild(tr);
  }

  static clearTable() {
    const bookTableBody = document.getElementById("books-table");
    bookTableBody.innerHTML = "";
  }

  static filtering(list, value) {
    const inputs = document.getElementById("filter-input");
    console.log(value);

    // kullanıcıdan arama metni

    const table = document.getElementById("books-table");
    const trs = table.getElementsByTagName("tr");

    for (const tr of trs) {
      const td = tr.children[list].firstElementChild;
      const cellValue = td.textContent.toLowerCase().trim();

      if (!cellValue.includes(value.toLowerCase().trim())) {
        tr.style.display = "none";
      } else {
        tr.style.display = "";
      }
    }
  }

  static dltBook(e) {
    const tr = e.closest("tr");
    console.log(tr);
    const bookId = tr.getAttribute("data-id");

    return bookId;
  }

  static editBook(e) {
    const tr = e.closest("tr");

    const spans = tr.querySelectorAll(".display-text");
    const inputs = tr.querySelectorAll(".edit-input");

    // Mevcut verileri inputlara kopyala
    for (const span of spans) {
      span.nextElementSibling.value = span.textContent.trim();
    }

    this.inputsDisplay("none", "block", tr);
    this.buttonDisplay("none", "block", tr);
    this.parentButtons("none", "table-cell", tr);

    const cancelBtn = tr.querySelector(".cancel-book");
    const saveBtn = tr.querySelector(".save-book");

    cancelBtn.addEventListener("click", () => {
      this.inputsDisplay("block", "none", tr);
      this.buttonDisplay("block", "none", tr);
      this.parentButtons("table-cell", "none", tr);
    });

    saveBtn.addEventListener("click", () => {
      // Kitap ID'sini al
      const bookId = tr.getAttribute("data-id");

      // Güncellenmiş inputlardan veri topla
      const updatedBook = {
        name: inputs[0].value.trim(),
        writer: inputs[1].value.trim(),
        type: inputs[2].value.trim(),
        publisher: inputs[3].value.trim(),
        year: inputs[4].value.trim(),
        price: inputs[5].value.trim(),
        location: inputs[6].value.trim(),
        piece: inputs[7].value.trim(),
      };

      // Veritabanına güncellemeyi yolla
      import("./json.js").then(({ API }) => {
        API.updateBook(bookId, updatedBook);
      });

      // DOM görünümünü eski haline döndür
      this.inputsDisplay("block", "none", tr);
      this.buttonDisplay("block", "none", tr);
      this.parentButtons("table-cell", "none", tr);
    });
  }

  static buttonDisplay(before, after, tr) {
    tr.querySelector(".dlt-book").style.display = before;
    tr.querySelector(".edit-book").style.display = before;
    tr.querySelector(".sell-book").style.display = before;
    tr.querySelector(".save-book").style.display = after;
    tr.querySelector(".cancel-book").style.display = after;
  }

  static parentButtons(before, after, tr) {
    tr.querySelector(".dlt-book").closest("td").style.display = before;
    tr.querySelector(".edit-book").closest("td").style.display = before;
    tr.querySelector(".sell-book").closest("td").style.display = before;
    tr.querySelector(".save-book").closest("td").style.display = after;
    tr.querySelector(".cancel-book").closest("td").style.display = after;
  }

  static inputsDisplay(labelDisplay, inputDisplay, tr) {
    const spans = tr.querySelectorAll(".display-text");
    const inputs = tr.querySelectorAll(".edit-input");

    for (const span of spans) {
      span.style.display = labelDisplay;
    }
    for (const input of inputs) {
      input.style.display = inputDisplay;
    }
  }

  static clearinputs(inputs) {
    for (const e of inputs) {
      e.value = "";
    }
  }
}
