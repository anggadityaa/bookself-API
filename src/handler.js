const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, years, author, summary, publisher, pageCount, readPage, reading, } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBooks = {
        id, name, years, author, summary, publisher, pageCount, readPage, reading, createdAt, updatedAt,
    };
    
    books.push(newBooks);

    const isSuccess = books.filter((books) => books.id === id).length > 0;


    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
    }
 
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
  
    let allBooks = books;
  
    if (name !== undefined) {
        allBooks = allBooks.filter((books) => books
        .name.toLowerCase().includes(name.toLowerCase()));
    }
  
    if (reading !== undefined) {
        allBooks = allBooks.filter((books) => books.reading === !!Number(reading));
    }
  
    if (finished !== undefined) {
        allBooks = allBooks.filter((books) => books.finished === !!Number(finished));
    }
  
    const response = h.response({
      status: 'success',
      data: {
        books: allBooks.map((books) => ({
          id: books.id,
          name: books.name,
          publisher: books.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  };

const getBookByIdHandler = (request, h) => { 

    const { bookId } = request.params;
    const book = books.find(book => book.id === bookId);

    if (!book) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        response.code(404);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books
        }
    });
    response.code(200);
    return response;
}

const editBookByIdHandler = (request, h) => { 
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
             status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
         });
        response.code(400);
        return response;
    }

    books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount,  readPage, reading, updatedAt: new Date().toISOString()};

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
}

const deleteBookByIdHandler = (request, h) => { 
    const { bookId } = request.params;
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        response.code(404);
        return response;
    }

    books.splice(bookIndex, 1);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
}

module.exports = { addBookHandler, getAllBookHandler,getBookByIdHandler,editBookByIdHandler,deleteBookByIdHandler };