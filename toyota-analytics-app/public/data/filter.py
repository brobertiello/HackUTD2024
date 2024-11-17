import os
import csv
import re  # Import regex for sanitizing file names

def sanitize_name(name):
    """Sanitize directory and file names to remove invalid characters."""
    return re.sub(r'[<>:"/\\|?*]', '', name).strip()  # Remove invalid characters and trim spaces

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
                manufacturer_dir = os.path.join('src', 'data', manufacturer)
                model_dir = os.path.join(manufacturer_dir, model)
                
                os.makedirs(model_dir, exist_ok=True)

                # Write data to year-specific text file
                year_file = os.path.join(model_dir, f"{year}.txt")

                with open(year_file, 'w') as year_file:
                    year_file.write(f"{city_mpg},{highway_mpg},{combination_mpg}\n")

if __name__ == "__main__":
    organize_data()
    print("Data reorganization complete.")
