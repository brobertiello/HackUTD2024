// src/hooks/getCarImage.js
function getCarImage(make, model) {
    if (!make || !model) {
        throw new Error("Both make and model parameters are required.");
    }

    // Format make and model
    const formattedMake = make.replace(/\s+/g, "_");
    const formattedModel = model.split(" ")[0];

    // Construct the file path
    const imagePath = `/data/carImages/${formattedMake}${formattedModel}.png`;

    console.log(imagePath);

    return imagePath;
}

export default getCarImage;