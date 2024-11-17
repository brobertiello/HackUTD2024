from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

# Define the Flask app
app = Flask(__name__)
 
# Enable CORS for all domains and routes
CORS(app)        

@app.route('/cars-data', methods=['GET'])
def get_cars_data():
    # Initialize an empty DataFrame to hold the filtered data
    filtered_data = pd.DataFrame()

    # 2021
    data = pd.read_csv('2021-FE-Guide-release-dates-before-11-23-2021-no-sales-11-22-2021-for-DOE_Karmapublic.csv')
    filtered_data = pd.concat([filtered_data, data[data['Mfr Name'] == 'Toyota']])

    # 2022
    data = pd.read_csv('2022-FE-Guide-for-DOE-release-dates-before-1-12-2023-no-sales-1-11-2023public.csv')
    filtered_data = pd.concat([filtered_data, data[data['Mfr Name'] == 'Toyota']])

    # 2023
    data = pd.read_csv('2023-FE-Guide-for-DOE-final-MY-dataset-no-sales-2-14-2024public.csv')
    filtered_data = pd.concat([filtered_data, data[data['Mfr Name'] == 'Toyota']])

    # 2024
    data = pd.read_csv('2024-FE-Guide-for-DOE-release-dates-before-9-17-2024-no-sales-9-17-2024public.csv')
    filtered_data = pd.concat([filtered_data, data[data['Mfr Name'] == 'Toyota']])

    # 2025
    data = pd.read_csv('2025-FE-Guide-for-DOE-release-dates-before-10-17-2024-no-sales-10-17-2024public.csv')
    filtered_data = pd.concat([filtered_data, data[data['Mfr Name'] == 'Toyota']])

    # Convert the filtered DataFrame to JSON format
    result = filtered_data.to_dict(orient="records")
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
