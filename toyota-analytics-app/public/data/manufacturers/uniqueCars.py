import os

def traverse_car_folders(output_file):
    # Get the current working directory as the origin folder
    origin_folder = os.getcwd()

    # Set to store unique Make + {first word of the model} combinations
    unique_combinations = set()

    # Walk through the origin folder
    for manufacturer in os.listdir(origin_folder):
        manufacturer_path = os.path.join(origin_folder, manufacturer)

        # Ensure it's a folder
        if os.path.isdir(manufacturer_path):
            for model in os.listdir(manufacturer_path):
                model_path = os.path.join(manufacturer_path, model)

                # Skip the "averages" folder
                if model.lower() == "averages":
                    continue

                # Ensure it's a folder
                if os.path.isdir(model_path):
                    model_word = model.split()[0]
                    combination = f"{manufacturer},{model_word}"
                    unique_combinations.add(combination)

    # Write the unique combinations to the output file
    with open(output_file, 'w') as f:
        for combination in sorted(unique_combinations):
            f.write(combination + '\n')

# Example usage
if __name__ == "__main__":
    output_file = "alluniquecars.txt"
    traverse_car_folders(output_file)
    print(f"Unique combinations written to {output_file}")