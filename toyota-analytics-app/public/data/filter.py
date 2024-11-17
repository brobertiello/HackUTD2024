import os
import csv
import re  # Import regex for sanitizing file names
import numpy as np


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


def calculate_average(values):
    """Calculate the average of a list of numerical values."""
    return np.mean(values) if values else None


def write_averages_files(manufacturer_dir, year_values):
    """Write the average values for each year in an averages folder."""
    averages_dir = os.path.join(manufacturer_dir, 'averages')
    os.makedirs(averages_dir, exist_ok=True)

    year_files = []
    for year, mpg_values in year_values.items():
        avg_values = [calculate_average(mpg_values[key]) for key in mpg_values]
        avg_values_str_1 = ','.join([str(round(val, 2)) if val is not None else "N/A" for val in avg_values[:3]])
        avg_values_str_2 = ','.join([str(round(val, 2)) if val is not None else "N/A" for val in avg_values[3:]])
        year_file_name = f'{year}avg.txt'
        with open(os.path.join(averages_dir, year_file_name), 'w') as avg_file:
            avg_file.write(avg_values_str_1 + '\n')
            avg_file.write(avg_values_str_2 + '\n')
        year_files.append(year_file_name.replace('.txt', ''))

    # Write directory.txt in averages folder
    with open(os.path.join(averages_dir, 'directory.txt'), 'w') as dir_file:
        dir_file.write('\n'.join(year_files))


def organize_data():
    data_files = [
        '2021data.csv',
        '2022data.csv',
        '2023data.csv',
        '2024data.csv',
        '2025data.csv',
    ]

    mpg_values_per_manufacturer = {}

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
                extra_152 = row.get(reader.fieldnames[152], '').strip()
                extra_153 = row.get(reader.fieldnames[153], '').strip()
                extra_154 = row.get(reader.fieldnames[154], '').strip()

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
                    year_file.write(f"{extra_152},{extra_153},{extra_154}\n")

                # Track values for average calculation
                if manufacturer not in mpg_values_per_manufacturer:
                    mpg_values_per_manufacturer[manufacturer] = {}

                if year not in mpg_values_per_manufacturer[manufacturer]:
                    mpg_values_per_manufacturer[manufacturer][year] = {
                        'city': [], 'highway': [], 'combination': [], 'extra_152': [], 'extra_153': [], 'extra_154': []
                    }

                mpg_values_per_manufacturer[manufacturer][year]['city'].append(float(city_mpg))
                mpg_values_per_manufacturer[manufacturer][year]['highway'].append(float(highway_mpg))
                mpg_values_per_manufacturer[manufacturer][year]['combination'].append(float(combination_mpg))
                if extra_152: mpg_values_per_manufacturer[manufacturer][year]['extra_152'].append(float(extra_152))
                if extra_153: mpg_values_per_manufacturer[manufacturer][year]['extra_153'].append(float(extra_153))
                if extra_154: mpg_values_per_manufacturer[manufacturer][year]['extra_154'].append(float(extra_154))

    # Write directory.txt files at each level after processing
    write_directory_files('manufacturers')

    # Write averages files for each manufacturer and year
    for manufacturer, year_values in mpg_values_per_manufacturer.items():
        write_averages_files(os.path.join('manufacturers', manufacturer), year_values)


if __name__ == "__main__":
    organize_data()
    print("Data reorganization complete.")
