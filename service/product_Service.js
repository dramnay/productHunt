const ProductDAO = require("../dao/productDAO");
const Product = require("../model/product");

// Add product to products collection
const addProduct = async (inputBody) => {
  return await ProductDAO.addProductToDB(inputBody);
};

//Get products for main page
const getProduct = async (page, limit) => {
  return await ProductDAO.getProductFromDB(page, limit);
};

//Get a product by Id for detailed page
const getProductById = async (id) => {
  return await ProductDAO.getProductFromDBById(id);
};

//Delete a product by id
const deleteProduct = async (id) => {
  return await ProductDAO.deleteProductFromDB(id);
};

//Edit a product
const editProduct = async (userId, productId, productData) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  return await ProductDAO.editProduct(userId, productId, productData);
};

//Add comment to a product
const addComment = async (inputBody, id) => {
  return await ProductDAO.addCommentToProduct(inputBody, id);
};

// //Upvotes count for a product
// const getProductUpvotes= async(id)=>{
//     return await ProductDAO.getProductUpvotesDB(id);
// }

module.exports = {
  addProduct,
  deleteProduct,
  getProductById,
  getProduct,
  editProduct,
  addComment,
  //   getProductUpvotes
};
