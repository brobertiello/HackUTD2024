const axios = require("axios");

// Define the function to fetch the car image based on parameters
async function fetchCarImageLink({
  apiKey = "09nftuhkq_qa1dx6n5x_e8ddx6tpv",
  make,
  model,
  year,
  color,
  format = "json",
}) {
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

// Call the async function
fetchCarImageLink();
