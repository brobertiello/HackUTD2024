const axios = require("axios");
require("dotenv").config({ path: "../.env" });

// Define the function to fetch the car image based on parameters
async function fetchCarImageLink({ apiKey = process.env.CARSXE_API_KEY, make, model, year, color, format = "json" }) {
  try {
    const { data } = await axios.get("https://api.carsxe.com/images", {
      params: {
        key: apiKey,
        make: make,
        model: model,
        year: year,
        color: color,
        format: format,
      },
    });

    // Assuming the API returns an object with an array named 'images'
    if (data && data.images && data.images.length > 0) {
      const firstImageInfo = data.images[0];
      console.log(firstImageInfo);
      return firstImageInfo;
    } else {
      console.log("No images found for the specified parameters.");
      return null;
    }
  } catch (e) {
    console.error("Error fetching car image:", e);
    return null;
  }
}

// // Call the async function
// fetchCarImageLink();
