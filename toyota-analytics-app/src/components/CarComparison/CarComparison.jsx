import React from "react";
import "./CarComparison.css"; // Styles for table and layout

const CarComparison = ({ cars, selectedOptions }) => {
  return (
    <table className="car-comparison-table">
      <thead>
        <tr>
          <th>Model</th>
          {selectedOptions.map((option) => (
            <th key={option}>{option}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cars.map((car, index) => (
          <tr key={index}>
            <td>{car.model || "Unknown Model"}</td>
            {selectedOptions.map((option) => (
              <td key={option}>{car[option] || "N/A"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CarComparison;
