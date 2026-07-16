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
    // Fetch up to 500 resources in Cloudinary
    const result = await cloudinary.api.resources({
      max_results: 500,
      type: "upload",
    });

    const categories = [];
    const products = [];

    result.resources.forEach((resource) => {
      let folder = resource.asset_folder || resource.folder || "";
      if (!folder && resource.public_id && resource.public_id.includes("/")) {
        const parts = resource.public_id.split("/");
        parts.pop();
        folder = parts.join("/");
      }

      const folderLower = folder.toLowerCase();
      const filenameVal = resource.display_name || resource.filename || resource.public_id.split("/").pop();

      if (folderLower.includes("categories")) {
        categories.push({
          public_id: resource.public_id,
          url: resource.secure_url,
          folderPath: folder,
          folderName: folder.split("/").pop() || "",
          filename: filenameVal,
        });
      } else if (folderLower.includes("products")) {
        products.push({
          public_id: resource.public_id,
          url: resource.secure_url,
          folderPath: folder,
          folderName: folder.split("/").pop() || "",
          filename: filenameVal,
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
