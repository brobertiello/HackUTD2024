import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
} from 'chart.js';

const CO2LineChart = ({ cars }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Prepare datasets and labels
    const labels = cars[0]?.xvalues || [];
    const datasets = cars.map((car, index) => ({
      label: car.label,
      data: car.ycombinedCO2,
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsl(${index * 60}, 70%, 70%)`,
      fill: false,
    }));

    // Create a new Chart.js instance
    chartRef.current.chartInstance = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
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