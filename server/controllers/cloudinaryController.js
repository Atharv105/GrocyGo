const cloudinary = require("../config/cloudinary");

let cache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const getCloudinaryImages = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        message: "Cloudinary images fetched from cache",
        data: cache.data,
      });
    }

    console.log("Fetching resources from Cloudinary API...");
    // Fetch up to 500 resources in folder 'Grocery'
    const result = await cloudinary.api.resources({
      max_results: 500,
      type: "upload",
    });

    const categories = [];
    const products = [];

    result.resources.forEach((resource) => {
      const folder = resource.asset_folder || "";
      
      if (folder.startsWith("Grocery/Categories")) {
        categories.push({
          public_id: resource.public_id,
          url: resource.secure_url,
          folderPath: folder,
          folderName: folder.split("/").pop(),
          filename: resource.filename,
        });
      } else if (folder.startsWith("Grocery/Products")) {
        products.push({
          public_id: resource.public_id,
          url: resource.secure_url,
          folderPath: folder,
          folderName: folder.split("/").pop(),
          filename: resource.filename,
        });
      }
    });

    const responseData = {
      categories,
      products,
    };

    // Cache the response
    cache.data = responseData;
    cache.timestamp = now;

    res.status(200).json({
      success: true,
      message: "Cloudinary images fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Cloudinary images: " + error.message,
    });
  }
};

module.exports = {
  getCloudinaryImages,
};
