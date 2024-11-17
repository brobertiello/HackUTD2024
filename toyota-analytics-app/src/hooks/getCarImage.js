// Function to retrieve the car image file path based on make and model
function getCarImage(make, model) {
    if (!make || !model) {
        throw new Error("Both make and model parameters are required.");
    }

    // Format make and model
    const formattedMake = make.replace(/\s+/g, "_").toLowerCase();
    const formattedModel = model.split(" ")[0].toLowerCase();

    // Construct the file path
    const imagePath = `/public/data/carImages/${formattedMake}_${formattedModel}.png`;

    // You may need to validate the file existence if used in a real-world application.
    // Here, we simply return the constructed path.

    return imagePath;
}

export default getCarImage;