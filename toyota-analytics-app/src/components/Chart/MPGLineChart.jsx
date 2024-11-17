import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MPGLineChart = ({cars}) => {
  // const cars = [
  //   {
  //     label: "Toyota Corolla",
  //     xvalues: [2021, 2022, 2023, 2024],
  //     ycity: [30, 31, 32, 33],
  //     yhighway: [40, 41, 42, 43],
  //     ycombined: [35, 36, 37, 38],
  //   },
  //   {
  //     label: "Nissan Altima",
  //     xvalues: [2021, 2022, 2023, 2025], // Missing 2024
  //     ycity: [25, 26, 27, 28], // Data for 2025
  //     yhighway: [35, 36, 37, 38],
  //     ycombined: [30, 31, 32, 33],
  //   },
  // ];

  const [selectedMetric, setSelectedMetric] = useState('combined'); // State for selected metric
  const chartRef = useRef(null); // Reference to the canvas
  const chartInstance = useRef(null); // Reference to the Chart.js instance

  // Helper function to calculate y-axis range with padding
  const calculateYAxisRange = (datasets) => {
    let allValues = [];
    datasets.forEach((dataset) => {
      allValues = [...allValues, ...dataset.data.filter((val) => val !== null)];
    });
    const minY = Math.min(...allValues);
    const maxY = Math.max(...allValues);

    return {
      min: minY - 2, // Add 4 units below
      max: maxY + 2, // Add 4 units above
    };
  };

  // Prepare datasets with `spanGaps: true` for connecting 2023 and 2025
  const getDatasets = (metric) => {
    // Get all unique x-values (years) from all datasets
    const uniqueXValues = Array.from(
      new Set(cars.flatMap((company) => company.xvalues))
    ).sort((a, b) => a - b); // Ensure years are sorted

    return cars.map((company) => {
      // Align data to the unique x-values, filling gaps with `null`
      const alignedData = uniqueXValues.map((year) => {
        const index = company.xvalues.indexOf(year);
        return index !== -1 ? company[`y${metric}`][index] : null;
      });

      // Determine color based on whether the car is Toyota
      const isToyota = company.label.toLowerCase().includes("toyota");

      return {
        label: `${company.label} - ${metric.charAt(0).toUpperCase() + metric.slice(1)} MPG`,
        data: alignedData,
        borderColor: isToyota ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1)', // Red for Toyota, Blue for others
        backgroundColor: isToyota ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,255,0.2)',
        pointBorderColor: isToyota ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1)',
        pointBackgroundColor: isToyota ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1)',
        spanGaps: true, // Connect the line over `null` values
      };
    });
  };


  const datasets = getDatasets(selectedMetric);
  const yAxisRange = calculateYAxisRange(datasets);

  const data = {
    labels: Array.from(
      new Set(cars.flatMap((company) => company.xvalues))
    ).sort((a, b) => a - b), // Unique and sorted x-axis labels
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: 20, // Adds padding around the chart
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Car Fuel Efficiency Over Time',
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
                text: 'MPG',
            },
            beginAtZero: false,
        },
    },
    animation: {
        duration: 600, // Animation duration in milliseconds
        easing: 'easeOutBounce', // Easing function
    },
};


  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new Chart.js instance
    chartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: data,
      options: options,
    });

    return () => {
      // Cleanup chart instance on component unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]); // Update chart when data or options change

  return (
    <div style={{ width: '100%', height: '500px' }}> {/* Increased chart height */}
      {/* Dropdown to select metric */}
      <select
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
        style={{ padding: '5px', fontSize: '16px' }}
      >
        <option value="combined">Combined MPG</option>
        <option value="city">City MPG</option>
        <option value="highway">Highway MPG</option>
      </select>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MPGLineChart;
