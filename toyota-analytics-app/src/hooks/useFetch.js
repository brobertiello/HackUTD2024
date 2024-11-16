const axios = require("axios");

const apiKey = "09nftuhkq_qa1dx6n5x_e8ddx6tpv";
const make = "toyota";
const model = "tacoma";
const year = "2018";
const color = "blue";
const format = "json";

// Wrap the code in an async function

async function fetchCarImageLink() {
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
      const firstImageInfo = data.images[0].link;
      console.log(firstImageInfo);
    } else {
      console.log("No images found for the specified parameters.");
    }
  } catch (e) {
    console.error("Error fetching car image:", e);
  }
}

// Call the async function
fetchCarImageLink();
