const ProductDAO = require("../dao/productDAO");

//Add User to Users Collection
const addUser = async (inputBody) => {
  return await ProductDAO.addUserToDB(inputBody);
};

module.exports = { addUser };
