import MPGLineChart from "../Chart/MPGLineChart";
import CO2LineChart from "../Chart/CO2LineChart";
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);




const ChartSlider = ({ mpgData, co2Data }) => {
  const [activeChart, setActiveChart] = useState(0);

  if (!mpgData.length && !co2Data.length) {
    return <div>No data available for charts</div>;
  }

  return (
    <div style={styles.chartBox}>
      <div
        style={{
          ...styles.chartContainer,
          transform: `translateX(-${activeChart * 100}%)`,
        }}
      >
        <div style={styles.chartWrapper}>
          <MPGLineChart cars={mpgData} />
        </div>
        <div style={styles.chartWrapper}>
          <CO2LineChart cars={co2Data} />
        </div>
      </div>
      <div style={styles.dotsContainer}>
        {[0, 1].map((index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor:
                activeChart === index ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0.5)',
            }}
            onClick={() => setActiveChart(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Styles for the slider component
const styles = {
  chartBox: {
    position: 'relative',
    width: '100%',
    height: '400px',
    overflow: 'hidden', // Prevent overflow when sliding
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  chartContainer: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out', // Smooth slide transition
    width: '200%', // 100% for each chart
    height: '100%',
  },
  chartWrapper: {
    width: '100%',
    height: '100%',
    flexShrink: 0, // Prevent the wrapper from shrinking
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: '12px',
    height: '12px',
    margin: '0 5px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};


export default ChartSlider;