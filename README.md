# **Toyota Vehicle Analytics App**

## **Project Overview**

The Toyota Vehicle Analytics App is a React-based web application designed for Toyota engineers to analyze and compare vehicle fuel economy data for the years 2021-2025. This application leverages the Pinata API for storing and retrieving vehicle datasets securely. Engineers can view detailed analytics for Toyota's cars, compare them to other vehicles, and gain actionable insights through interactive visualizations and filtering options. The app is intended to run locally for the time being.

---

## **File Structure Breakdown**

### **Root Directory**

```
root/
├── public/
├── src/
├── .env
├── package.json
├── README.md
```

### **Public Folder**

- **`index.html`**: Main HTML file for rendering the React application.
- **`favicon.ico`**: Toyota-branded favicon.

---

### **`src/` Folder**

Contains all source files for the React application.

#### **1. `components/`**

Reusable UI components for the application.

```
components/
├── Dashboard/
│   ├── Dashboard.jsx      # Main dashboard layout and metrics display
│   ├── Dashboard.css      # Styles for the dashboard
├── CarList/
│   ├── CarList.jsx        # Displays a list of Toyota cars
│   ├── CarCard.jsx        # Renders individual car details
│   ├── CarList.css        # Styles for the car list and cards
├── CarComparison/
│   ├── CarComparison.jsx  # Car comparison tool
│   ├── CarComparison.css  # Styles for the comparison feature
├── Chart/
│   ├── LineChart.jsx      # Line chart component for trends
│   ├── BarChart.jsx       # Bar chart component for comparisons
│   ├── PieChart.jsx       # Pie chart component for comparisons
│   ├── LineChart.css      # Styles for line charts
│   ├── BarChart.css       # Styles for bar charts
│   ├── PieChart.css       # Styles for pie charts
├── Table/
│   ├── DataTable.jsx      # Data table to display raw or processed data
│   ├── DataTable.css      # Styles for data tables
```

---

#### **2. `features/`**

Encapsulates core logic and utility functions for the app.

```
features/
├── dataProcessing/
│   ├── processData.js     # Processes raw vehicle data for visualizations
│   ├── filterData.js      # Implements filtering logic for datasets
├── carComparison/
│   ├── compareCars.js     # Logic for comparing Toyota cars to others
├── pinata/
│   ├── uploadFile.js      # Handles file uploads to Pinata
│   ├── retrieveFiles.js   # Retrieves files and metadata from Pinata
```

---

#### **3. `pages/`**

Holds top-level pages of the app, corresponding to different routes.

```
pages/
├── HomePage.jsx           # Landing page of the app
├── HomePage.css           # Styles for the home page
├── CarPage.jsx            # Page for viewing Toyota cars and comparisons
├── CarPage.css            # Styles for the car page
├── AnalyticsPage.jsx      # Analytics dashboard for fuel economy data
├── AnalyticsPage.css      # Styles for the analytics page
├── UploadPage.jsx         # File upload page for car data
├── UploadPage.css         # Styles for the upload page
```

---

#### **4. `hooks/`**

Custom React hooks for encapsulating reusable logic.

```
hooks/
├── useFetch.js            # Fetch data from APIs or local files
├── usePinataAPI.js        # Handles Pinata API integration
```

---

#### **5. `services/`**

Handles API communication and backend integration.

```
services/
├── pinataService.js       # Manages interactions with Pinata (e.g., pinFileToIPFS)
├── carService.js          # Fetches and compares car data
```

---

#### **6. `utils/`**

Utility functions and constants used across the app.

```
utils/
├── constants.js           # Constants for endpoints, chart colors, etc.
├── helpers.js             # Helper functions for formatting and calculations
```

---

#### **Other Files**

- **`App.js`**: Root React component managing routing and global state.
- **`index.js`**: Application entry point rendering the React app.
- **`App.css`**: Global CSS styles for the application.
- **`config.js`**: Configuration for environment variables and API endpoints.
- **`.env`**: Stores sensitive keys like the Pinata API key and secret.

---

## **Proposed Features**

1. **Dashboard**:

   - Display vehicle fuel economy trends with line and bar charts.
   - Highlight key insights and top-performing models.

2. **Toyota Car List**:

   - View all Toyota cars from 2021-2025.
   - Filter by year, model type, or specific metrics.

3. **Car Comparison**:

   - Compare Toyota cars to other vehicles side-by-side.
   - Use metrics like MPG, emissions, and engine type.

4. **File Uploads**:

   - Upload new datasets dynamically using the Pinata API.
   - Store metadata for each file (e.g., year, description).

5. **Data Visualizations**:
   - Interactive charts to explore trends and make comparisons.

---

## **Next Steps**

1. **Set Up Initial Components**:
   - Build `CarList` and `Dashboard` with mock data.
2. **Integrate Pinata API**:
   - Implement upload and retrieval functionality.
3. **Develop Analytics Tools**:
   - Create visualizations for trends and comparisons.
4. **Test and Refine**:
   - Ensure seamless user interaction and clean design.

---

This structure ensures scalability, maintainability, and a clear separation of concerns while focusing on delivering a high-quality experience for Toyota engineers.
