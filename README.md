# Products REST API

A simple REST API for querying and performing CRUD operations on a collection of products.

## Project Goals

This project is meant to showcase a very simple REST API implementation, using knowledge I picked up from Robert Bunch's [Just Express](https://www.udemy.com/course/just-express-with-a-bunch-of-node-and-http-in-detail) Udemy tutorial series, as well as some stuff I've learned checking out the Express docs. 

I'm working through the following concepts:

- App vs. router middleware
- Express error-handling middleware
- HTTP status codes and well-formed error messages
- Basic search functionality
- Most CRUD operations (Create, Read, Delete)

## Caveats

As I'm trying to understand the Express framework at a very basic level, I will *NOT* be using:

- Any client-side technology
- A database 
- User accounts 
- Testing
- Sessions or cookies

To keep things simple, I'm also not creating or deleting products from the file system when then user hits those routes, but rather just performing these operations on the array of products loaded into memory for the life of the server. So, if the server gets restarted, any create or delete operations will be undone.

## Installation

Clone the repo and run `npm install`:

```bash
$ git clone git@github.com:Dayun123/products-rest-api.git
$ npm install
```

## Usage

Start the server:

```bash
$ DEBUG=products-rest-api:* npm run dev
```

All requests can then be made to the base url: `http://localhost:3000`

## Routes

Accepts requests at the following routes:

|  Method | Path          | Description           |
| --------| ------------- | ----------------------|
| GET     | /products     | Returns all products  |
| GET     | /products/:id | Return a product      |
| POST    | /products     | Create a product      |
| DELETE  | /products/:id | Delete a product      |

## API Key

Access to all routes requires an `apiKey` query string parameter, which is setup as `abc123` in the default app. 

So, to get a listing of all products, the following request would be neccessary:

`GET http://localhost:3000/products?apiKey=abc123`

## Search

To search for a product, append the `keyword` query string to the `GET /products` route, like so:

`GET http://localhost:3000/products?apiKey=abc123&keyword=dell`

The number of results can be filtered with the `numResults` query string parameter:

`GET http://localhost:3000/products?apiKey=abc123&keyword=dell&numResults=3`

## Response Format

### Success

Successful responses return a single product, an array of products, or a JSON object with `statusCode`, `statusMessage`, and `product` properties:

|  Method | Path          | Return Value                                |
| --------| ------------- | --------------------------------------------|
| GET     | /products     | Array of products                           | 
| GET     | /products/:id | Single product                              |
| POST    | /products     | JSON with `statusCode`, `statusMessage`, and `product` properties  |
| DELETE  | /products/:id | JSON with `statusCode`, `statusMessage`, and `product` properties  |

A request to `GET /products/1` would return:

```json
{
  "id": 1,
  "name": "Pencil Sharpener",
  "price": 12.99,
  "category": "Office Supplies"
}
```

While a successful request to `POST /products` would return:

```json
{
  "statusCode": 201,
  "statusMessage": "Product created",
  "product": {
    "id": 1,
    "name": "Pencil Sharpener",
    "price": 12.99,
    "category": "Office Supplies"
  }
}
```

### Failure

Unsuccessful responses return a JSON object with `statusCode` and `statusMessage` properties detailing what went wrong.

Here is an example response for an authentication error:

```json
{
  "statusCode": 401,
  "statusMessage": "Must provide a valid API Key"
}
```

And here is an example response for a request that doesn't have the correct keys for creating a new product:

```json
{
  "statusCode": 422,
  "statusMessage": "To create a product the id, name, price, and category keys are required"
}
```

## Creating A Product

To create a product, send a JSON object in the request body with the format:

```json
{
  "id": 1,
  "name": "Pencil Sharpener",
  "price": 12.99,
  "category": "Office Supplies"
}
```

You can add any fields you like, those are the ones that come 'stock' with the app and are required in order to create a new product.

A request to create a product should have the header `Content-Type: application/json` or it will be rejected.

**Any create or delete operations are only persisted for the life of the server (see the ['Caveats'](#caveats) section for an explanation).*