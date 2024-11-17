import React, { useState, useEffect } from "react";
import CarOptions from "../components/CarComparison/CarOptions"; // Import CarOptions
import CarComparison from "../components/CarComparison/CarComparison"; // Assuming it's another component
import "./AnalyticsPage.css"; // Styling

const AnalyticsPage = () => {
  const [carsData, setCarsData] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEngineType, setSelectedEngineType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100000]);
  const [selectedMpgRange, setSelectedMpgRange] = useState([0, 50]);
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch car data from backend API
  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/cars-data");
        const data = await response.json();
        setCarsData(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarsData();
  }, []);

  // Filter cars based on selected options
  const handleSubmit = () => {
    if (!carsData || carsData.length === 0) return;

    const filtered = carsData.filter((car) =>
      (selectedMake ? car["Mfr Name"] === selectedMake : true) &&
      (selectedModel ? car["Carline"] === selectedModel : true) &&
      (selectedEngineType ? car["Eng Displ"] === selectedEngineType : true) &&
      (car["Price"] >= selectedPriceRange[0] && car["Price"] <= selectedPriceRange[1]) &&
      (car["City FE (Guide) - Conventional Fuel"] >= selectedMpgRange[0] && car["City FE (Guide) - Conventional Fuel"] <= selectedMpgRange[1])
    );
    setFilteredCars(filtered);
  };

  return (
    <div className="analysis-page">
      {carsData && carsData.length > 0 ? (
        <CarOptions
          carsData={carsData}
          selectedMake={selectedMake}
          setSelectedMake={setSelectedMake}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedEngineType={selectedEngineType}
          setSelectedEngineType={setSelectedEngineType}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          selectedMpgRange={selectedMpgRange}
          setSelectedMpgRange={setSelectedMpgRange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <p>No car data available. Please check the data source.</p>
      )}

      {filteredCars.length > 0 && (
        <div className="results-section">
          <h2>Results</h2>
          <CarComparison cars={filteredCars} />
        </div>
      )}

      {filteredCars.length === 0 && filteredCars.length !== carsData.length && (
        <p>Select specifications and submit to view results.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
