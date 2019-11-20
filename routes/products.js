const express = require('express');
const products = require('../data/products');
const validate = require('../utils/validate');

const router = express.Router();

router.param('id', (req, res, next) => {

  res.locals.id = +req.params.id;
  
  if (!validate.validateId(res.locals.id)) {
    next({
      statusCode: 422,
      statusMessage: ':id parameter must be a number and must be greater than 0',
    });
  }
  
  res.locals.product = products.find((product) => product.id === res.locals.id);
  
  next();
});

router.get('/', (req, res, next) => {
  res.json(products);
});

router.post('/', validate.validateContentType, validate.validateProductKeys, (req, res, next) => {

  products.push(req.body);

  res.status(201).json({
    statusCode: 201,
    statusMessage: 'Product created',
  });  

});

router.get('/:id', (req, res, next) => {
  
  if (!res.locals.product) {
    next({
      statusCode: 404,
      statusMessage: 'No product found with that id'
    });
  } else {
    res.json(res.locals.product);
  }
});

router.use((err, req, res, next) => {
  res.status(err.statusCode).json(err);
});

module.exports = router;