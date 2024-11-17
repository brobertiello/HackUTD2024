import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';

const CO2LineChart = ({ cars }) => {
  const chartRef = useRef(null);

  console.log(cars);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Fixed x-axis labels
    const labels = [2021, 2022, 2023, 2024, 2025];

    // Prepare datasets, ensuring alignment with fixed labels
    const datasets = cars.map((car, index) => {
      // Map ycombinedCO2 to fixed labels (assumes cars[0].xvalues aligns with 2021-2025)
      const data = labels.map((year) => {
        const yearIndex = car.xvalues?.indexOf(year); // Find index of year in car's data
        return yearIndex !== -1 ? car.ycombinedCO2[yearIndex] : null; // Use null if year not found
      });

      return {
        label: car.label,
        data,
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsl(${index * 60}, 70%, 70%)`,
        fill: false,
      };
    });

    // Create a new Chart.js instance
    chartRef.current.chartInstance = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels, // Use fixed labels
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'CO2 Emissions Over Time',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
            },
          },
          y: {
            title: {
              display: true,
              text: 'CO2 (grams/mile)',
            },
          },
        },
      },
    });

    // Cleanup on component unmount
    return () => {
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [cars]);

  return <canvas ref={chartRef} style={{ height: '100%', width: '100%' }} />;
};

export default CO2LineChart;
