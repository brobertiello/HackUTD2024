import os
import csv
import re  # Import regex for sanitizing file names

def sanitize_name(name):
    """Sanitize directory and file names to remove invalid characters."""
    return re.sub(r'[<>:"/\\|?*]', '', name).strip()  # Remove invalid characters and trim spaces

def write_directory_files(base_dir):
    """Write directory.txt files for all levels after processing."""
    if os.path.exists(base_dir):
        # Write manufacturers directory.txt
        subfolders = [name for name in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, name))]
        with open(os.path.join(base_dir, 'directory.txt'), 'w') as dir_file:
            dir_file.write('\n'.join(subfolders))

        # Write models and years directory.txt
        for manufacturer in subfolders:
            manufacturer_path = os.path.join(base_dir, manufacturer)
            model_subfolders = [name for name in os.listdir(manufacturer_path) if os.path.isdir(os.path.join(manufacturer_path, name))]
            with open(os.path.join(manufacturer_path, 'directory.txt'), 'w') as dir_file:
                dir_file.write('\n'.join(model_subfolders))

            for model in model_subfolders:
                model_path = os.path.join(manufacturer_path, model)
                year_files = [name.replace('.txt', '') for name in os.listdir(model_path) if name.endswith('.txt')]
                with open(os.path.join(model_path, 'directory.txt'), 'w') as dir_file:
                    dir_file.write('\n'.join(year_files))

def organize_data():
    data_files = [
        '2021data.csv',
        '2022data.csv',
        '2023data.csv',
        '2024data.csv',
        '2025data.csv',
    ]

    for file in data_files:
        if not os.path.exists(file):
            print(f"File not found: {file}")
            continue

        with open(file, 'r') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                manufacturer = sanitize_name(row['Mfr Name'].strip())
                model = sanitize_name(row['Carline'].strip())
                year = row['Model Year'].strip()
                city_mpg = row['City FE (Guide) - Conventional Fuel'].strip()
                highway_mpg = row['Hwy FE (Guide) - Conventional Fuel'].strip()
                combination_mpg = row['Comb FE (Guide) - Conventional Fuel'].strip()

                # Skip rows with missing essential data
                if not (manufacturer and model and year and city_mpg and highway_mpg and combination_mpg):
                    print(f"Skipping incomplete row: {row}")
                    continue

                # Create directory structure
                manufacturer_dir = os.path.join('manufacturers', manufacturer)
                model_dir = os.path.join(manufacturer_dir, model)

                os.makedirs(model_dir, exist_ok=True)

                # Write data to year-specific text file
                year_file = os.path.join(model_dir, f"{year}.txt")

                with open(year_file, 'w') as year_file:
                    year_file.write(f"{city_mpg},{highway_mpg},{combination_mpg}\n")

    # Write directory.txt files at each level after processing
    write_directory_files('manufacturers')

if __name__ == "__main__":
    organize_data()
    print("Data reorganization complete.")