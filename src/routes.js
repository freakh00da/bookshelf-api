const {
  addBook,
  getAllBooks,
  getBookDetailById,
  updateBookDetailById,
  deleteBookById,
} = require('./handler');
const Joi = require('@hapi/joi');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
    options: {
      validate: {
        query: Joi.object({
          name: Joi.string().optional(),
          reading: Joi.string().optional().valid('0', '1'),
          finished: Joi.string().optional().valid('0', '1'),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetailById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookDetailById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById,
  },
];

module.exports = routes;
