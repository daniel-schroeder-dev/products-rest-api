const express = require('express');
const products = require('../data/products');

const router = express.Router();

router.param('id', (req, res, next) => {
  res.locals.id = +req.params.id;
  if ( isNaN(res.locals.id) || (res.locals.id < 1) ) {
    next({
      statusCode: 422,
      statusMessage: ':id parameter must be a number and must be greater than 0',
    });
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  res.json(products);
});

router.post('/', validateContentType, validateProductKeys, (req, res, next) => {

  products.push(req.body);

  res.status(201).json({
    statusCode: 201,
    statusMessage: 'Product created',
  });  

});

router.get('/:id', (req, res, next) => {
  const product = products.find((product) => product.id === res.locals.id);
  if (!product) {
    next({
      statusCode: 404,
      statusMessage: 'No product found with that id'
    });
  } else {
    res.json(product);
  }
});

router.use((err, req, res, next) => {
  res.status(err.statusCode).json(err);
});

module.exports = router;