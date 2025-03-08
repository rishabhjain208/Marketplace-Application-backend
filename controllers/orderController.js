const Order = require("../models/Order");
const Products = require("../models/Product");

// exports.createOrder = async (req, res) => {
//   try {
//     const { products } = req.body;
//     const { status } = req.body;
//     // const userId = req.userID;

//     let totalAmount = 0;

//     for (const item of products) {
//       const product = await Products.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
//       totalAmount += product.price * item.quantity;
//     }

//     const newOrder = new Order({
//       //   user: userId,
//       products,
//       totalAmount,
//       status,
//     });

//     const order = await newOrder.save();
//     return res.status(201).json({
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const { products, status } = req.body;
//     let totalAmount = 0;
//     let populatedProducts = [];

//     for (const item of products) {
//       const product = await Products.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       totalAmount += product.price * item.quantity;

//       // Store full product details inside the order instead of just the product ID
//       populatedProducts.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//       });
//       // console.log(name);
//     }

//     const newOrder = new Order({
//       products: populatedProducts,
//       totalAmount,
//       status: status || "Pending", // Default status if not provided
//     });

//     const order = await newOrder.save();

//     // Populate the order response with full product details
//     const populatedOrder = await Order.findById(order._id).populate(
//       "products.product"
//     );

//     return res.status(201).json({
//       message: "Order created successfully",
//       order: populatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const { products, status } = req.body;
    let totalAmount = 0;

    const updatedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Products.findById(item.product).select(
          "name description price"
        );
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        totalAmount += product.price * item.quantity;

        return {
          product: product._id, // Store only the product ID
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const newOrder = new Order({
      products: updatedProducts,
      totalAmount,
      status: status || "Pending",
    });

    const order = await newOrder.save();

    // ✅ Correctly populate product details
    const populatedOrder = await Order.findById(order._id).populate({
      path: "products.product",
      select: "name description price",
    });

    console.log("Populated Order:", populatedOrder); // ✅ Check if products are populated

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    //   .populate("users")
    //   .populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    order.updatedAt = Date.now();

    await order.save();
    res.status(200).json({
      message: "Update status successfully",
      order,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
