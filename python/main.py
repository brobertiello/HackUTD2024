# Import libraries
import pandas as pd
import numpy as np

# Import datasets
# 2021
data = pd.read_csv('2021-FE-Guide-release-dates-before-11-23-2021-no-sales-11-22-2021-for-DOE_Karmapublic.csv')
filtered_data = data[data['Mfr Name'] == 'Toyota']

# 2022
data = pd.read_csv('')