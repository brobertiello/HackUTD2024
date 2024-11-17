// src/hooks/getCarImage.js
function getCarImage(make, model) {
    if (!make || !model) {
        throw new Error("Both make and model parameters are required.");
    }

    // Format make and model
    const formattedMake = make.replace(/\s+/g, "_");
    const formattedModel = model.split(" ")[0];

    // Construct the file path
    const imagePath = `/data/carImages/${formattedMake}_${formattedModel}.png`;
    
    return imagePath.replace("__", "_");;
}

export default getCarImage;