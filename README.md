# ToyoTrends

ToyoTrends is a powerful web application designed for Toyota engineers to visualize and interpret fuel efficiency and carbon emissions data for both Toyota vehicles and competitor vehicles. This tool provides actionable insights, helping engineers gain a competitive edge in the automotive industry.

---

## Key Features

- **Immersive Intro Animation**: Engages users with a visually appealing introduction.
- **Reactive Web Components**: Ensures a dynamic and responsive user experience.
- **Data Analysis on Large Datasets**: Processes vast amounts of data efficiently for actionable insights.
- **Comparison Tools**: Enables side-by-side analysis of multiple vehicles.
- **Future Predictive Algorithms**: Offers forecasts based on historical data trends.
- **AI Navigation and Information Assistance**: Utilizes SambaNova's AI chatbot to streamline user interactions.

---

## Libraries and Technologies

- **React.js**: Framework for building the user interface.
- **Chart.js**: For advanced data visualization.
- **queryString**: Simplifies data processing and URL parameter manipulation.
- **CarsXE**: Generates accurate and high-quality vehicle images.
- **SambaNova AI**: Provides AI-driven chatbot assistance for seamless navigation.

---

## Examples of Data Processing

- **Large Dataset Management**: Organizes extensive datasets to enable quick access and computation.
- **String Manipulation**: Processes and formats vehicle data to gather and present images effectively.

---

## Code Structure

The project is organized as follows:

```
toyota-analytics-app
|-- public
|   |-- data
|       |-- carImages
|       |   |-- Toyota_CAMRY.png
|       |   |-- Toyota_COROLLA.png
|       |-- manufacturers
|       |   |-- Toyota
|       |       |-- CAMRY
|       |       |-- COROLLA
|       |-- filter.py
|       |-- uniqueCars.py
|-- src
|   |-- assets
|   |-- components
|   |   |-- charts
|   |   |-- tables
|   |-- features
|   |   |-- services
|   |   |-- carComparison
|   |   |-- dataProcessing
|   |-- hooks
|   |-- pages
|   |-- utils
|   |-- App.js
|   |-- App.css
|   |-- index.js
|   |-- index.css
|-- .env
|-- .gitignore
|-- README.md
```

### Key Files and Directories

- **public/data**: Stores vehicle images and manufacturer-specific data.
  - `filter.py`: Script to filter dataset information.
  - `uniqueCars.py`: Script to identify unique vehicle entries.
- **src/assets**: Contains static assets.
- **src/components**: Includes reusable UI components like charts and tables.
- **src/features**: Houses core application features like car comparison and data processing.
- **src/hooks**: Custom React hooks for managing app state.
- **src/utils**: Utility functions for common operations.

---

## Development Timeline

The entire project was completed in under 24 hours as part of [HackUTD XI](https://ripple.hackutd.co/).

### Contributors

- **Brandon Robertiello**
   - br@ou.edu
   - [LinkedIn](https://www.linkedin.com/in/brandon-robertiello/)
- **Melissa Ng**
   - melissa.j.ng-1@ou.edu
   - [LinkedIn](https://www.linkedin.com/in/melissa-ng1/)
- **Lucas Ho**
   - lucas.ho-1@ou.edu
   - [LinkedIn](https://www.linkedin.com/in/lucas-t-ho/)
- **Bryan Ho**

---

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/toyota-analytics-app.git
   cd toyota-analytics-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and populate it with necessary API keys and configurations (e.g., CarsXE and SambaNova).

4. **Run the Application**:
   ```bash
   npm start
   ```

5. Access the app at `http://localhost:3000`.

---

## Future Improvements

- Enhanced predictive analytics for carbon emissions trends.
- Integration with more AI tools for advanced insights.
- Expansion to include more competitor data.

---

## License

This project is open-source and available under the MIT License. Feel free to fork and contribute!

---

## Contact

For more information, reach out to any of the contributors or submit an issue on the GitHub repository.

