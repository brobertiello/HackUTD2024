import React, { useEffect, useState } from 'react';
import './Analysis.css';
import { useNavigate } from 'react-router-dom';
import getCarImage from '../hooks/getCarImage';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// Function to generate a consistent color from a string
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360; // Use hue value between 0 and 359
    return `hsl(${h}, 65%, 50%)`; // Return HSL color
}

// Function to perform linear regression and predict future values
function forecastData(years, values, futureYears = 5) {
    if (years.length < 2) return { years: [], values: [] }; // Not enough data to forecast

    // Convert years to numbers
    const numericYears = years.map(year => parseInt(year, 10));
    const xMean = numericYears.reduce((a, b) => a + b, 0) / numericYears.length;
    const yMean = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate slope (m) and intercept (b) for y = mx + b
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < numericYears.length; i++) {
        numerator += (numericYears[i] - xMean) * (values[i] - yMean);
        denominator += Math.pow(numericYears[i] - xMean, 2);
    }
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Predict future values
    const lastYear = numericYears[numericYears.length - 1];
    const forecastYears = [];
    const forecastValues = [];
    for (let i = 1; i <= futureYears; i++) {
        const year = (lastYear + i).toString();
        const value = slope * (lastYear + i) + intercept;
        forecastYears.push(year);
        forecastValues.push(parseFloat(value.toFixed(2)));
    }

    return { years: forecastYears, values: forecastValues };
}

const Analysis = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [carList, setCarList] = useState([]);
    const [chartType, setChartType] = useState('MPG');
    const [showForecast, setShowForecast] = useState(false); // New state for forecast option
    const navigate = useNavigate();

    useEffect(() => {
        const loadManufacturers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/data/manufacturers/directory.txt');
                if (!response.ok) throw new Error('Failed to load manufacturers.');
                const text = await response.text();
                const manufacturers = text.split('\n').filter(Boolean);
                setManufacturers(manufacturers);
            } catch (error) {
                console.error("Error loading manufacturers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadManufacturers();
    }, []);

    const handleManufacturerChange = (event) => {
        const manufacturer = event.target.value;
        setSelectedManufacturer(manufacturer);
        setSelectedModel('');
        if (manufacturer) {
            loadModels(manufacturer);
        } else {
            setModels([]);
        }
    };

    const handleModelChange = (event) => {
        const model = event.target.value;
        setSelectedModel(model);
    };

    const loadModels = async (manufacturer) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/manufacturers/${manufacturer}/directory.txt`);
            if (!response.ok) throw new Error(`Failed to load models for ${manufacturer}.`);
            const text = await response.text();
            const models = text.split('\n').filter(Boolean);
            setModels(models);
        } catch (error) {
            console.error("Error loading models:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompare = async () => {
        if (!selectedManufacturer || !selectedModel) return;

        const carLabel = `${selectedManufacturer} ${selectedModel}`;

        // Check if the car is already in the list
        const isDuplicate = carList.some(car => car.label === carLabel);

        if (isDuplicate) {
            alert('This car is already in the comparison list.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/data/manufacturers/${selectedManufacturer}/${selectedModel}/directory.txt`);
            if (!response.ok) throw new Error(`Failed to load years for ${selectedModel}.`);
            const text = await response.text();
            const years = text.split('\n').filter(Boolean);

            const carDetailsArray = await Promise.all(
                years.map(async (year) => {
                    try {
                        const res = await fetch(`/data/manufacturers/${selectedManufacturer}/${selectedModel}/${year}.txt`);
                        if (!res.ok) throw new Error(`Failed to load details for ${selectedModel} (${year}).`);
                        const yearText = await res.text();
                        const lines = yearText.split('\n').filter(Boolean);
                        const [mpgLine, co2Line] = lines;
                        const [city, highway, combination] = mpgLine.split(',');
                        let co2Data = {};
                        if (co2Line) {
                            const [cityCo2, highwayCo2, combinationCo2] = co2Line.split(',');
                            co2Data = {
                                cityCo2: parseFloat(cityCo2.trim()),
                                highwayCo2: parseFloat(highwayCo2.trim()),
                                combinationCo2: parseFloat(combinationCo2.trim()),
                            };
                        }
                        return {
                            year,
                            city: parseFloat(city.trim()),
                            highway: parseFloat(highway.trim()),
                            combination: parseFloat(combination.trim()),
                            cityCo2: co2Data.cityCo2 || null,
                            highwayCo2: co2Data.highwayCo2 || null,
                            combinationCo2: co2Data.combinationCo2 || null,
                        };
                    } catch (error) {
                        console.error(`Error loading data for ${year}:`, error);
                        return null;
                    }
                })
            );

            const filteredCarDetails = carDetailsArray.filter(detail => detail !== null);

            const newCarData = {
                label: carLabel,
                xvalues: filteredCarDetails.map((detail) => detail.year),
                ycity: filteredCarDetails.map((detail) => detail.city),
                yhighway: filteredCarDetails.map((detail) => detail.highway),
                ycombined: filteredCarDetails.map((detail) => detail.combination),
                ycityCO2: filteredCarDetails.map((detail) => detail.cityCo2),
                yhighwayCO2: filteredCarDetails.map((detail) => detail.highwayCo2),
                ycombinedCO2: filteredCarDetails.map((detail) => detail.combinationCo2),
                imagePath: getCarImage(selectedManufacturer, selectedModel),
            };

            setCarList((prevList) => [...prevList, newCarData]);
        } catch (error) {
            console.error("Error comparing car:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeCar = (index) => {
        setCarList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const renderChart = () => {
        if (carList.length === 0) return <p>No cars to compare.</p>;

        const datasets = carList.map((car) => {
            const color = stringToColor(car.label);
            let dataPoints = car.xvalues.map((year, idx) => {
                if (chartType === 'MPG') {
                    return {
                        x: year,
                        y: car.ycombined[idx],
                    };
                } else {
                    return {
                        x: year,
                        y: car.ycombinedCO2[idx],
                    };
                }
            });

            let forecastDataset = null;
            if (showForecast) {
                // Perform forecasting
                const historicalYears = car.xvalues;
                const historicalValues = dataPoints.map(point => point.y);

                const { years: forecastYears, values: forecastValues } = forecastData(historicalYears, historicalValues, 5);

                if (forecastYears.length > 0) {
                    const forecastDataPoints = forecastYears.map((year, idx) => ({
                        x: year,
                        y: forecastValues[idx],
                    }));

                    forecastDataset = {
                        label: `${car.label} (Forecast)`,
                        data: forecastDataPoints,
                        fill: false,
                        borderColor: color,
                        backgroundColor: color,
                        borderDash: [5, 5], // Dashed line
                        tension: 0.1,
                    };
                }
            }

            const datasets = [
                {
                    label: car.label,
                    data: dataPoints,
                    fill: false,
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.1,
                },
            ];

            if (forecastDataset) {
                datasets.push(forecastDataset);
            }

            return datasets;
        }).flat();

        // Combine all x-axis labels
        const xLabelsSet = new Set();
        carList.forEach(car => car.xvalues.forEach(year => xLabelsSet.add(year)));
        if (showForecast) {
            carList.forEach(car => {
                // Generate forecast years
                const lastYear = parseInt(car.xvalues[car.xvalues.length - 1], 10);
                for (let i = 1; i <= 5; i++) {
                    xLabelsSet.add((lastYear + i).toString());
                }
            });
        }
        const xLabels = Array.from(xLabelsSet).sort();

        const data = {
            datasets,
        };

        const options = {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    labels: xLabels,
                    title: {
                        display: true,
                        text: 'Year',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: chartType === 'MPG' ? 'MPG' : 'CO₂ Emissions',
                    },
                },
            },
        };

        return (
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        );
    };

    return (
        <div className="analysis-page">
            <div className="left-card">
                <h2>Select Car to Compare</h2>
                <div className="selector">
                    <label htmlFor="manufacturer-select">Manufacturer:</label>
                    <select
                        id="manufacturer-select"
                        value={selectedManufacturer}
                        onChange={handleManufacturerChange}
                    >
                        <option value="">--Select Manufacturer--</option>
                        {manufacturers.map((manufacturer, index) => (
                            <option key={index} value={manufacturer}>
                                {manufacturer}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="selector">
                    <label htmlFor="model-select">Model:</label>
                    <select
                        id="model-select"
                        value={selectedModel}
                        onChange={handleModelChange}
                        disabled={!selectedManufacturer || models.length === 0}
                    >
                        <option value="">--Select Model--</option>
                        {models.map((model, index) => (
                            <option key={index} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleCompare} disabled={!selectedModel}>
                    Compare
                </button>

                {/* Horizontal line */}
                <hr style={{ margin: '20px 0' }} />

                {/* Forecast Option */}
                <div className="forecast-option">
                    <label>
                        <input
                            type="checkbox"
                            checked={showForecast}
                            onChange={(e) => setShowForecast(e.target.checked)}
                        />
                        Show Future Forecasts (Next 5 Years)
                    </label>
                </div>
            </div>

            <div className="right-cards">
                <div className="top-card">
                    <h2>Selected Cars</h2>
                    <div className="car-list">
                        {carList.map((car, index) => (
                            <div className="car-item" key={index}>
                                <div className="car-header">
                                    <h3>{car.label}</h3>
                                    <button onClick={() => removeCar(index)}>×</button>
                                </div>
                                {car.imagePath && (
                                    <img
                                        src={car.imagePath}
                                        alt={car.label}
                                        className="car-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/data/carImages/default.png';
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        {carList.length === 0 && <p>No cars selected.</p>}
                    </div>
                </div>

                <div className="bottom-card">
                    <h2>Analysis Chart</h2>
                    <div className="chart-toggle">
                        <button
                            onClick={() => setChartType('MPG')}
                            className={chartType === 'MPG' ? 'active' : ''}
                        >
                            MPG
                        </button>
                        <button
                            onClick={() => setChartType('CO2')}
                            className={chartType === 'CO2' ? 'active' : ''}
                        >
                            CO<sub>2</sub> Emissions
                        </button>
                    </div>
                    {isLoading && <div className="loading">Loading...</div>}
                    {!isLoading && renderChart()}
                </div>
            </div>
        </div>
    );
};

export default Analysis;
