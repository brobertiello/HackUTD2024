# Import libraries
import pandas as pd
import numpy as np

# Import datasets
# 2021
data = pd.read_csv('2021-FE-Guide-release-dates-before-11-23-2021-no-sales-11-22-2021-for-DOE_Karmapublic.csv')
filtered_data = data[data['Mfr Name'] == 'Toyota']

# 2022
data = pd.read_csv('2022-FE-Guide-for-DOE-release-dates-before-1-12-2023-no-sales-1-11-2023public.csv')
filtered_data = filtered_data + data[data['Mfr Name'] == 'Toyota']

# # 2023
data = pd.read_csv('2023-FE-Guide-for-DOE-final-MY-dataset-no-sales-2-14-2024public.csv')
filtered_data = filtered_data + data[data['Mfr Name'] == 'Toyota']

# # 2024
data = pd.read_csv('2024-FE-Guide-for-DOE-release-dates-before-9-17-2024-no-sales-9-17-2024public.csv')
filtered_data = filtered_data + data[data['Mfr Name'] == 'Toyota']

# # 2025
data = pd.read_csv('2025-FE-Guide-for-DOE-release-dates-before-10-17-2024-no-sales-10-17-2024public.csv')
filtered_data = filtered_data + data[data['Mfr Name'] == 'Toyota']

# filtered_data = data[data['Mfr Name'] == 'Toyota']

X = filtered_data.iloc[:, :4].values
y = filtered_data.iloc[:, 12:15].values

print(X)
print(y)