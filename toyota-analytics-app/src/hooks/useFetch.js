const axios = require("axios");

const apiKey = "09nftuhkq_qa1dx6n5x_e8ddx6tpv";
const make = "toyota";
const model = "tacoma";
const year = "2018";
const color = "blue";
const format = "json";

// Wrap the code in an async function
async function fetchCarImage() {
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
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

// Call the async function
fetchCarImage();
