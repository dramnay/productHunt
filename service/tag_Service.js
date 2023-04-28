const ProductDAO = require("../dao/productDAO");

//Add Tag to Tags collection
const addTag = async (inputBody) => {
  return await ProductDAO.addTagToDB(inputBody);
};

//Add and remove tag to a product
const tagsToProduct = async (productId, tag, userId) => {
  const flag = tag.flag;
  const tagId = tag.tagId;
  if (flag) return await ProductDAO.addTagToProduct(productId, tagId, userId);
  else return await ProductDAO.removeTagFromProduct(productId, tagId, userId);
};

module.exports = { addTag, tagsToProduct };
