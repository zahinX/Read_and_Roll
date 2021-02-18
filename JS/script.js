//Assign HTML Elements to variables
let form = document.querySelector('#book-form');
let title = document.querySelector('#title');
let author = document.querySelector('#author');
let isbn = document.querySelector('#isbn');
let bookList = document.querySelector('#book-list');

//Defining classes
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class BookRow {
    //made them static as the class has no properties that is used by any of the methods
    static addToBookList(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr'); //creating row
        row.innerHTML = `<td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href='#' class="delete">X</a></td>` //adding row
        list.appendChild(row);
    }
    static clearTextFields() {
        title.value = '';
        author.value = '';
        isbn.value = '';
    }
    static showMessage(message, className) {
        let div = document.createElement('div'); //creating element
        div.className = `alert ${className}`; //adding class to the element
        div.appendChild(document.createTextNode(message)); //adding message to div
        let container = document.querySelector('.container'); //selecting container class
        container.insertBefore(div, form);
        //setting time limit for alert
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000)
    }
    static deleteBookRow(target) {
        if (target.hasAttribute('href')) {
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            BookRow.showMessage("Book Removed!", "success");
        }
    }
}

class Store {
    static getBooks() {
        let bookListStorage;
        if (localStorage.getItem('bookListStorage') === null) {
            bookListStorage = [];
        } else {
            bookListStorage = JSON.parse(localStorage.getItem('bookListStorage'));
        }
        return bookListStorage;
    }

    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('bookListStorage', JSON.stringify(books));
    }

    static displayBooks() {
        let books = Store.getBooks();
        books.forEach(book => {
            BookRow.addToBookList(book);
        });
    }

    static removeBook(isbn){
        let books= Store.getBooks();
        books.forEach((book, index)=> {
            if(book.isbn === isbn){
                books.splice(index);
            } 
        });
        localStorage.setItem('bookListStorage', JSON.stringify(books));
    }
}

//Adding event listeners
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks); //loads all existing books when the DOM loads

//Defining Functions
function newBook(e) {
    e.preventDefault();
    let book = new Book(title.value, author.value, isbn.value);
    if (title.value === '' || author.value === '' || isbn.value === '') {
        BookRow.showMessage("Missing Field(s)", "error");
    } else {
        BookRow.addToBookList(book);
        BookRow.clearTextFields();
        BookRow.showMessage("Book Added!!!", "success");
        //storing into the local storage
        Store.addBook(book)
    }
}

function removeBook(e) {
    //The target event(e) property returns element that triggered the event
    BookRow.deleteBookRow(e.target);
}