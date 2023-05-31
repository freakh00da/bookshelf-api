/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          message: `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
        })
        .code(400);
  }

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        })
        .code(201);
  }
};

const getAllBooks = (request, h) => {
  const {name, reading, finished} = request.query;

  let filteredBooks = [...books];

  if (name) {
    const keyword = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(keyword),
    );
  }

  if (reading === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  } else if (reading === '1') {
    filteredBooks = filteredBooks.filter((book) => book.reading);
  }

  if (finished === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  } else if (finished === '1') {
    filteredBooks = filteredBooks.filter((book) => book.finished);
  }

  return h
      .response({
        status: 'success',
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
};

const getBookDetailById = (request, h) => {
  const {bookId} = request.params;

  const book = books.find((book) => book.id === bookId);

  if (!book) {
    return h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
        .code(404);
  }

  return h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
};

const updateBookDetailById = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
  }
  if (!name) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
  }

  if (readPage > pageCount) {
    return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
};

const deleteBookById = (request, h) => {
  const {bookId} = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    return h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
  }

  return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
};


module.exports = {
  addBook,
  getAllBooks,
  getBookDetailById,
  updateBookDetailById,
  deleteBookById,
};
