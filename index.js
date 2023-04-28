require("dotenv").config();
const port = process.env.PORT || 5000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Product = require("./model/product");
const ProductService = require("../service/product_service");
const TagService = require("../service/tag_service");
const UserService = require("../service/user_service");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Add new product to product collection
app.post("/products", async (req, res) => {
  const inputBody = req.body;
  const result = await ProductService.addProduct(inputBody);
  if (!result)
    res.status(400).json({
      message: "Cannot add new Product",
    });
  else res.status(201).json(result);
});

//Get product for main page with pagination
app.get("/products/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await ProductService.getProduct(page, limit);
  if (!result)
    res.status(404).json({
      message: "No more products",
    });
  else res.status(200).json(result);
});

//Get product by id
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.getProductById(id);
  if (!result)
    res.status(404).json({
      message: `Product with ${id} not in the list`,
    });
  else res.status(200).json(result);
});

//Delete product by id
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductService.deleteProduct(id);
  if (!result)
    res.status(400).json({
      message: `product with ${id} don't exists`,
    });
  else res.status(200).json(result);
});

// Edit a product
app.patch("/products/:id", async (req, res) => {
  try {
    // const userId = req.user._id;
    const productId = req.params.productId;
    const productData = req.body;
    const updatedProduct = await Product.editProduct(
      productId,
      //   userId,
      productData
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Add comment to a product
app.post("/products/:id/comment", async (req, res) => {
  const inputBody = req.body;
  const id = req.params.id;
  const result = await ProductService.addComment(inputBody, id);
  if (!result)
    res.status(400).json({
      message: "comment not possible on this product id ",
    });
  else res.status(201).json(result);
});

//Add new tag to tag collection
app.post("/tags", async (req, res) => {
  const inputBody = req.body;
  const result = await TagService.addTag(inputBody);
  if (!result)
    res.status(400).json({
      message: "Cannot add tags",
    });
  else res.status(201).json(result);
});

//Add new user to user collection
app.post("/users", async (req, res) => {
  const inputBody = req.body;
  const result = await UserService.addUser(inputBody);
  if (!result)
    res.status(400).json({
      message: "Cannot add user",
    });
  else res.status(201).json(result);
});

//Add and remove tag to the product
app.patch("/products/:id/tags", async (req, res) => {
  const productId = req.params.id;
  const userId = req.body.userId;
  const tag = req.body.tag;
  try {
    const updatedProduct = await TagService.tagsToProduct(
      productId,
      tag,
      userId
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// //Get upvotes count for a productId

// app.get("/products/:id/upvotes", async (req, res) => {
//   const id = req.params.id;
//   const result = await ProductService.getProductUpvotes(id);
//   if (!result)
//     res.status(404).json({
//       message: `Product with ${id} not in the list`,
//     });
//   else res.status(200).json(result);
// });

////PORT LISTEN/////
app.listen(port, () => {
  console.log(`Product app listening on port ${port}`);
});
