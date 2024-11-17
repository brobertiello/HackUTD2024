import requests
import os

# Path to the input file
input_file = "uniquecars.txt"
# Your CarsXE API key
api_key = "09nftuhkq_qa1dx6n5x_e8ddx6tpv"

# Ensure output directory exists
output_dir = os.path.abspath("..")  # Current Folder

if not os.path.exists(input_file):
    print(f"Error: File '{input_file}' not found.")
    exit()

# Read the input file
with open(input_file, "r") as file:
    lines = file.readlines()

for line in lines:
    # Skip empty lines
    line = line.strip()
    if not line:
        continue

    try:
        make, model = line.split(",")
        make = make.strip()
        model = model.strip()

        # Replace spaces with underscores for the filename
        filename_make = make.replace(" ", "_")
        filename_model = model.replace(" ", "_")
        filename = f"carImages/{filename_make}_{filename_model}.png"
        output_path = os.path.join(output_dir, filename)

        # Call the CarsXE API
        url = "https://api.carsxe.com/images"
        params = {
            "key": api_key,
            "make": make,
            "model": model,
            "format": "json"
        }

        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise exception for HTTP errors

        data = response.json()
        if "images" in data and data["images"]:
            for image_info in data["images"]:
                image_url = image_info.get("link")
                if not image_url:
                    continue
                try:
                    # Download the image
                    image_response = requests.get(image_url)
                    image_response.raise_for_status()

                    # Save the image to the output directory
                    with open(output_path, "wb") as img_file:
                        img_file.write(image_response.content)
                    print(f"Saved image: {output_path}")
                    break  # Stop after successfully saving an image
                except requests.exceptions.RequestException as img_error:
                    print(f"Error downloading image from {image_url}: {img_error}")
        else:
            print(f"No images found for {make} {model}.")

    except ValueError:
        print(f"Invalid line format: {line}. Skipping.")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {make} {model}: {e}")