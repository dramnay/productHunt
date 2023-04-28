const mongoose = require("mongoose");
const Product = require("../model/product");
const Tag = require("../model/Tag");
const User = require("../model/user");

mongoose.connect("mongodb://0.0.0.0:27017/productHuntDB");

//Get product from db
const getProductFromDB = async (page, limit) => {
  if (page < 0 || limit < 0)
    return `please enter a positive value for page number or limit`;
  const skipIndex = (page - 1) * limit;
  try {
    const products = await Product.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          icon: 1,
          url: 1,
          shortDescription: 1,
          tags: 1,
          createdOn: 1,
          commentsCount: { $size: "$comments" }, //adding commentsCount field
          upvotesCount: { $size: "$upvotes" }, //adding upvotesCount field
        },
      },
      { $skip: skipIndex },
      { $limit: limit },
    ]);
    if (!products[0])
      throw new ReferenceError({ message: "Product not found" });
    return products;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Get product by id
const getProductFromDBById = async (id) => {
  try {
    const result = await Product.find({ _id: `${id}` });
    if (!result[0]) throw new ReferenceError({ message: "Product not found" });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Delete a product
const deleteProductFromDB = async (id) => {
  try {
    const product = await Product.find({ _id: `${id}` });
    if (!product) throw new error();
    const result = await Product.deleteOne({ _id: `${id}` });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Edit a product
const editProduct = async (productId, userId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, createdBy: userId },
    update,
    { new: true }
  );
  return product;
};

//Add comment to product
const addCommentToProduct = async (inputBody, id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  const user = await User.findById(inputBody["createdBy"]);
  if (!user) {
    throw new Error("User not found");
  }
  const comment = {
    createdBy: inputBody["createdBy"],
    desp: inputBody["desp"],
    updatedOn: { dafault: Date.now() },
  };
  product.comments.push(comment);
  await product.save();
  return comment;
};

//Post a product
const addProductToDB = async (inputBody) => {
  try {
    const product = await Product.create({
      name: inputBody["name"],
      url: inputBody["url"],
      icon: inputBody["icon"],
      longDescription: inputBody["longDescription"],
      shortDescription: inputBody["shortDescription"],
      createdOn: inputBody["createdOn"],
      updatedOn: inputBody["updatedOn"],
      createdBy: inputBody["createdBy"],
      updatedBy: inputBody["updatedBy"],
      tags: [...inputBody["tags"]],
      comments: [...inputBody["comments"]],
      images: [...inputBody["images"]],
      upvotes: [...inputBody["upvotes"]],
    });
    console.log(product);
    return product;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Add tag to db
const addTagToDB = async (inputBody) => {
  try {
    const tag = await Tag.create({
      name: inputBody["name"],
    });
    console.log(tag);
    return tag;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Add user to db
const addUserToDB = async (inputBody) => {
  try {
    const user = await User.create({
      name: inputBody["name"],
      email: inputBody["email"],
      password: inputBody["password"],
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//Add tag to a product
const addTagToProduct = async (productId, tagId, userId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.createdBy.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new Error("Tag not found");
    }

    if (product.tags.includes(tagId)) {
      // Tag already added to product
      throw new Error("Tag already exists");
    }

    product.tags.push(tagId);

    await product.save();

    return product;
  } catch (error) {
    throw error;
  }
};

//Remove tag from the product
const removeTagFromProduct = async (productId, tagId, userId) => {
  try {
    let product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.createdBy.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new Error("Tag not found");
    }

    if (!product.tags.includes(tagId)) {
      // No such Tag in product
      throw new Error("No such Tag exists in this product");
    }

    product = await Product.findOneAndUpdate(
      { _id: productId, createdBy: userId },
      { $pull: { tags: tagId } },
      { new: true }
    );

    return product;
  } catch (error) {
    throw error;
  }
};

// //Get upvotes Count
// const getProductUpvotesDB = async (id) => {
//   try {
//     const products = await Product.aggregate([
//       {
//         $project: {
//           upvotesCount: { $size: "$upvotes" }, //adding upvotesCount field
//         },
//       },
//     ]);
//     if (!products[0])
//       throw new ReferenceError({ message: "Product not found" });
//     return products;
//   } catch (error) {
//     console.log(error.message);
//     return;
//   }
// };

///////////////////////////////////////////////////////////////////////////////

module.exports = {
  addProductToDB,
  addTagToDB,
  addUserToDB,
  deleteProductFromDB,
  getProductFromDBById,
  getProductFromDB,
  editProduct,
  addCommentToProduct,
  addTagToProduct,
  removeTagFromProduct,
  // getProductUpvotesDB,
};
