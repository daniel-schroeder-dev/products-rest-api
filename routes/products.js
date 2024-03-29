const express = require('express');
const products = require('../data/products');
const validate = require('../utils/validate');

const router = express.Router();

router.param('id', (req, res, next) => {

  res.locals.id = +req.params.id;
  
  if (!validate.validateId(res.locals.id)) {
    next({
      statusCode: 422,
      statusMessage: ':id parameter must be a number greater than 0',
    });
    return;
  }
  
  res.locals.product = products.find((product) => product.id === res.locals.id);

  if (!res.locals.product) {
    next({
      statusCode: 404,
      statusMessage: 'No product found with that id'
    });
    return;
  }
  
  next();
});

router.get('/', (req, res, next) => {
  
  res.locals.products = products;
  
  if (req.query.keyword) {
    const keyword = req.query.keyword.toLowerCase();
    res.locals.products = res.locals.products.filter((product) => {
      const lowercaseValues = Object.values(product).map((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase();
        } else {
          return value;
        }
      });
      return lowercaseValues.join(' ').includes(keyword);
    });
  }

  if (req.query.num_results) {
    if (!isNaN(req.query.num_results) && +req.query.num_results >= 0) {
      res.locals.products = res.locals.products.slice(0, +req.query.num_results);
    } else {
      return next({
        statusCode: 422,
        statusMessage: 'num_results must be a number greater than -1',
      });
    }
  }
  
  res.json(res.locals.products);
});

router.post('/', validate.validateContentType, validate.validateProductKeys, validate.validateUniqueId, (req, res, next) => {

  products.push(req.body);

  res.status(201).json({
    statusCode: 201,
    statusMessage: 'Product created',
    product: req.body,
  });  

});

router.get('/:id', (req, res, next) => {
  res.json(res.locals.product);
});

router.delete('/:id', (req, res, next) => {
  const deleteProductIndex = products.findIndex((product) => product.id === res.locals.product.id);
  const [ deletedProduct ] = products.splice(deleteProductIndex, 1);
  res.json({
    statusCode: 200,
    statusMessage: 'Product deleted',
    product: deletedProduct,
  });
});

module.exports = router;