export class Book {
  constructor(name, writer, type, publisher, year, price, location, piece) {
    this.name = name;
    this.writer = writer;
    this.type = type;
    this.publisher = publisher;
    this.year = year;
    this.price = price;
    this.location = location;
    this.piece = piece;
    this.selled = false;
    console.log(this);
  }
}
