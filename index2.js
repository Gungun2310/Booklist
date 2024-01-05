//Book class which represents a book
class Book{
    constructor(title, author, isbn){
        this.title=title;    //for initiating
        this.author=author;
        this.isbn=isbn;
    }
}


//UI class which handles UI tasks
 class UI{
    static displayBooks(){ //we do not want to instantiate here hence doirectly assigning properties
         
        const books= Store.getBooks(); //storing the array to books

        books.forEach((book)=> UI.addBookToList(book)); //passing book into books

 }
       static addBookToList(book){
        const list=document.querySelector('#book-list'); //grabbing element

        const row=document.createElement('tr');//creating tr to dom

        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>

         ` ;
         
         //using backtash for variable i.e taking input

         list.appendChild(row); //apending each item from row


       } 

       static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove(); //twice as we want to remove the entire row of that book
        }

       }

       static showAlert(message, className){
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');  //just to style the alert and all
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);

        //vanish in 3 sec the alert
        setTimeout(()=> document.querySelector('.alert').remove(),3000);
       }



       static clearFields(){
        document.querySelector('#title').value = '';
         document.querySelector('#author').value = '';
          document.querySelector('#isbn').value = '';  // to clear the history as we fill
       }

}




//Store class for handling storage

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];  //that is no book in local storage
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)); //books is an array of object while local storage is string
    }

    static removeBook(isbn){
        const books= Store.getBooks();

        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books)); //updating local storage after removal


    }
}


//Event for display of books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event for adding a book
 document.querySelector('#book-form').addEventListener('submit', (e)=>{

    //prevent actual submit
    e.preventDefault();

    //get form values from user
    const title= document.querySelector('#title').value;
    const author= document.querySelector('#author').value;
    const isbn= document.querySelector('#isbn').value;


    //validate
    if(title===''|| author===''||isbn===''){
       UI.showAlert('Filling all the given fields is mandatory.', 'danger');
    } else{
    //Instantiate book
    const book = new Book(title, author, isbn);

    //add book to UI
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //success msg show
    UI.showAlert('Book Added Successfully', 'success');

    //clear fields
     UI.clearFields();
    }
 }) ;


//Event for removing a book
document.querySelector('#book-list').addEventListener('click',(e)=>{
   //remove book from UI
    UI.deleteBook(e.target);

    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //as we nee to remove the book using its isbn value

    //show del msg
    UI.showAlert('Book Removed', 'success');
})
