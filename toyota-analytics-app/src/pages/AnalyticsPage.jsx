import React, { useState } from "react";
import CarComparison from "../components/CarComparison/CarComparison";
import "./AnalyticsPage.css"; // Styles for layout and responsive design

const AnalyticsPage = ({ specifications, carsData }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  // Handles selection/deselection of options
  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions((prevOptions) =>
      checked ? [...prevOptions, name] : prevOptions.filter((option) => option !== name)
    );
  };

  // Filters cars based on selected specifications
  const handleSubmit = () => {
    const filtered = carsData.filter((car) =>
      selectedOptions.every((spec) => car[spec] !== undefined) // Include cars that have all selected specifications
    );
    setFilteredCars(filtered);
  };

  return (
    <div className="analysis-page">
      {/* Options Column */}
      <div className="options-column">
        <h2>Select Specifications</h2>
        <div className="options-list">
          {specifications.map((spec) => (
            <div key={spec} className="option-item">
              <label>
                <input
                  type="checkbox"
                  name={spec}
                  onChange={handleOptionChange}
                />
                {spec}
              </label>
            </div>
          ))}
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h2>Results</h2>
        {filteredCars.length > 0 ? (
          <CarComparison cars={filteredCars} selectedOptions={selectedOptions} />
        ) : (
          <p>Select specifications and submit to view results.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
