const mongoose = require("mongoose");
const Tag = require("./Tag");
const User = require("./user");

// Comment Schema
const commentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  desp: {
    type: String,
    minLength: 1,
    maxlength: 200,
    trim: true,
  },

  createdOn: {
    type: Date,
    default: Date.now(),
  },

  updatedOn: {
    type: Date,
    default: Date.now(),
  },
});

///Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]*$/.test(v);
      },
      message: (props) =>
        `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
    },
  },

  url: {
    type: String,
    required: true,
    trim: true,
    match: /^(http|https):\/\/[^ "]+$/,
  },

  icon: {
    type: String,
    required: true,
    trim: true,
    match: /^(http|https):\/\/[^ "]+$/,
  },

  shortDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  },

  longDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
    maxlength: 1000,
  },

  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],

  comments: [commentSchema],

  images: [
    {
      type: String,
      required: true,
      trim: true,
      match: /^(http|https):\/\/[^ "]+$/,
    },
  ],

  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdOn: {
    type: Date,
    default: Date.now(),
  },

  updatedOn: {
    type: Date,
    default: Date.now(),
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//// delete a product and only deleted by who create it
productSchema.methods.deleteProduct = async function (userId) {
  if (this.createdBy.equals(userId)) {
    const deletedProduct = await this.model("Product").findOneAndDelete({
      _id: this._id,
    });
    return deletedProduct;
  } else {
    throw new Error("User is not authorized to delete this product");
  }
};

/// edit a product and only created by user is allowed to edit it
productSchema.methods.editProduct = async function (userId, productData) {
  if (this.createdBy.equals(userId)) {
    const updatedProduct = await this.model("Product").findOneAndUpdate(
      { _id: this._id },
      { $set: productData },
      { new: true }
    );
    return updatedProduct;
  } else {
    throw new Error("User is not authorized to edit this product");
  }
};

/////add a tag to a product

productSchema.methods.addTag = async function (tagId) {
  const tagExists = this.tags.includes(tagId);
  if (!tagExists) {
    const updatedProduct = await this.model("Product").findOneAndUpdate(
      { _id: this._id },
      { $addToSet: { tags: tagId } },
      { new: true }
    );
    return updatedProduct;
  } else {
    throw new Error("Tag already exists on product");
  }
};

/// function to remove a tag from product

productSchema.methods.removeTag = async function (tagId) {
  const tagIndex = this.tags.indexOf(tagId);
  if (tagIndex !== -1) {
    const updatedProduct = await this.model("Product").findOneAndUpdate(
      { _id: this._id },
      { $pull: { tags: tagId } },
      { new: true }
    );
    return updatedProduct;
  } else {
    throw new Error("Tag not found on product");
  }
};

//// upvote
productSchema.methods.upvote = async function (userId) {
  const userUpvoted = this.upvotes.includes(userId);
  if (!userUpvoted) {
    const updatedProduct = await this.model("Product").findOneAndUpdate(
      { _id: this._id },
      { $addToSet: { upvotes: userId }, $inc: { upvoteCount: 1 } },
      { new: true }
    );
    return updatedProduct;
  } else {
    throw new Error("User already upvoted this product");
  }
};

///downvote
productSchema.methods.downvote = async function (userId) {
  const userUpvoted = this.upvotes.includes(userId);
  if (userUpvoted) {
    const updatedProduct = await this.model("Product").findOneAndUpdate(
      { _id: this._id },
      { $pull: { upvotes: userId }, $inc: { upvoteCount: -1 } },
      { new: true }
    );
    return updatedProduct;
  } else {
    throw new Error("User did not upvote this product");
  }
};

// total count

productSchema.methods.countUpvotes = async function () {
  const count = await this.model("Product")
    .countDocuments({ _id: this._id, upvotes: { $exists: true } })
    .exec();
  return count;
};

productSchema.methods.countDownvotes = async function () {
  const count = await this.model("Product")
    .countDocuments({ _id: this._id, downvotes: { $exists: true } })
    .exec();
  return count;
};

productSchema.methods.countTotalVotes = async function () {
  const upvotes = await this.countUpvotes();
  const downvotes = await this.countDownvotes();
  return upvotes - downvotes;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
