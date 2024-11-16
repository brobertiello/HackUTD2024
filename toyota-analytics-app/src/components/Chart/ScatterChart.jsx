import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// Register the required Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title, Filler);

const ScatterChart = ({ companyData }) => {
  // Helper to calculate average MPG for a company
  const calculateAverageMPG = (models) => {
    if (!models || models.length === 0) return 0;
    const totalMPG = models.reduce((sum, model) => sum + model.mpg, 0);
    return totalMPG / models.length;
  };

  // Helper to calculate a simple linear trend line
  const calculateTrendLine = (models, companyIndex) => {
    if (!models || models.length === 0) return null;

    const xValues = models.map((_, idx) => idx); // Simple indices for models
    const yValues = models.map((model) => model.mpg);

    // Linear regression using least squares
    const n = xValues.length;
    const xSum = xValues.reduce((sum, x) => sum + x, 0);
    const ySum = yValues.reduce((sum, y) => sum + y, 0);
    const xySum = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const xSquaredSum = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    return xValues.map((x) => ({
      x: companyIndex + x / n, // Offset x slightly for alignment
      y: slope * x + intercept,
    }));
  };

  // Prepare data for scatter and trend lines
  const datasets = companyData.flatMap((company, index) => {
    const models = company.models || [];
    const avgMPG = calculateAverageMPG(models);

    // Scatter points
    const scatterPoints = models.length
      ? models.map((model, i) => ({
          x: index + i / models.length, // Offset x for each model
          y: model.mpg,
          label: model.name, // Tooltip content
        }))
      : [
          {
            x: index,
            y: avgMPG,
            label: `${company.company} (Average)`,
          },
        ];

    // Trend line (only for models with data)
    const trendLine = models.length ? calculateTrendLine(models, index) : null;

    // Lighter color for scatter points and darker for trend line
    const baseColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}`;
    const scatterColor = `${baseColor}, 0.3)`;
    const lineColor = `${baseColor}, 0.9)`;

    // Return scatter and trend line datasets
    return [
      {
        type: "scatter",
        label: `${company.company} Models`,
        data: scatterPoints,
        backgroundColor: scatterColor,
        borderColor: scatterColor,
      },
      trendLine && {
        type: "line",
        label: `${company.company} Trend Line`,
        data: trendLine,
        borderColor: lineColor,
        borderWidth: 2,
        pointRadius: 0, // No points on the trend line
      },
    ].filter(Boolean); // Remove null datasets
  });

  const data = {
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "MPG Scatter Chart with Trend Lines",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw.label}: ${tooltipItem.raw.y} MPG`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Companies (Index with Offset)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Miles Per Gallon (MPG)",
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default ScatterChart;
