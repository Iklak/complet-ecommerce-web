const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const { title, description, price, brand, category, stock, image } =
      req.body;

    if (!title || !description || price === undefined || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: "All field is requred",
      });
    }
    const product = await Product.create({
      title,
      description,
      price,
      brand,
      category,
      stock,
      image,
      createdBy: req.user.userId,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 10;
    }
    if (limit > 50) {
      limit = 50;
    }
    const skip = (page - 1) * limit;

    const { search, category, minPrice, maxPrice, sort } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    if (minPrice !== undefined || minPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    return res.status(200).json({
      success: true,
      message: "product fetched successfully",
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),

      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Intenal server error",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { title, description, price, brand, category, stock, image } =
      req.body;

    // Update only fields that were provided
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
