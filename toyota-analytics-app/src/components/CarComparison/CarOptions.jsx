// CarOptions.js
import React, { useEffect, useState } from 'react';

const CarOptions = ({
  carsData,
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  selectedEngineType,
  setSelectedEngineType,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedMpgRange,
  setSelectedMpgRange,
  handleSubmit,
}) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engineTypes, setEngineTypes] = useState([]);

  // Load makes based on car data
  useEffect(() => {
    if (carsData && carsData.length > 0) {
      const uniqueMakes = [...new Set(carsData.map((car) => car["Mfr Name"]))];
      setMakes(uniqueMakes);
    }
  }, [carsData]);

  // Load models based on selected make
  useEffect(() => {
    if (selectedMake && carsData && carsData.length > 0) {
      const filteredModels = carsData
        .filter((car) => car["Mfr Name"] === selectedMake)
        .map((car) => car["Carline"]);
      setModels([...new Set(filteredModels)]);
    }
  }, [selectedMake, carsData]);

  // Load engine types based on selected model
  useEffect(() => {
    if (selectedModel && carsData && carsData.length > 0) {
      const filteredEngines = carsData
        .filter((car) => car["Carline"] === selectedModel)
        .map((car) => car["Eng Displ"]);
      setEngineTypes([...new Set(filteredEngines)]);
    }
  }, [selectedModel, carsData]);

  return (
    <div className="options-column">
      <h2>Select Specifications</h2>

      {/* Step 1: Select Make */}
      <div className="option-item">
        <label>Select Make:</label>
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Select Model */}
      {selectedMake && (
        <div className="option-item">
          <label>Select Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Select Engine Type */}
      {selectedModel && (
        <div className="option-item">
          <label>Select Engine Type:</label>
          <select
            value={selectedEngineType}
            onChange={(e) => setSelectedEngineType(e.target.value)}
          >
            <option value="">Select Engine Type</option>
            {engineTypes.map((engine) => (
              <option key={engine} value={engine}>
                {engine}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="option-item">
        <label>Price Range:</label>
        <input
          type="range"
          min="0"
          max="100000"
          value={selectedPriceRange[0]}
          onChange={(e) => setSelectedPriceRange([e.target.value, selectedPriceRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="100000"
          value={selectedPriceRange[1]}
          onChange={(e) => setSelectedPriceRange([selectedPriceRange[0], e.target.value])}
        />
        <div>Price: ${selectedPriceRange[0]} - ${selectedPriceRange[1]}</div>
      </div>

      {/* MPG Range Slider */}
      <div className="option-item">
        <label>MPG Range:</label>
        <input
          type="range"
          min="0"
          max="50"
          value={selectedMpgRange[0]}
          onChange={(e) => setSelectedMpgRange([e.target.value, selectedMpgRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="50"
          value={selectedMpgRange[1]}
          onChange={(e) => setSelectedMpgRange([selectedMpgRange[0], e.target.value])}
        />
        <div>MPG: {selectedMpgRange[0]} - {selectedMpgRange[1]}</div>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CarOptions;
