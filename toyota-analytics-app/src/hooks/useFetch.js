// src/hooks/useFetch.js
import axios from 'axios';

async function fetchCarImageLink({ apiKey, make, model, year, color, format = "json" }) {
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

export { fetchCarImageLink };