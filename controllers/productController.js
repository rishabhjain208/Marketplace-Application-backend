const Products = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = new Products({
      name: name,
      price: price,
      description: description,
    });

    const product = await newProduct.save();

    return res.status(200).json({
      message: "Product created successfully",
      product,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Error creating product",
      error: e.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    //   .populate("users")
    //   .populate("products.product");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Products.find();
    if (!products) {
      return res.status(404).json({
        message: "No products found",
      });
    }
    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const productId = req.params.id;

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { name, price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
