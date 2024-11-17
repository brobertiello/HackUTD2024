import React, { useEffect, useState, useRef } from 'react';
import './Analysis.css';
import { useNavigate, useLocation } from 'react-router-dom';
import getCarImage from '../hooks/getCarImage';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import queryString from 'query-string'; // Ensure this package is installed

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
    const numericYears = years.map((year) => parseInt(year, 10));
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
    const [showForecast, setShowForecast] = useState(false);
    const [comparisonType, setComparisonType] = useState('model'); // 'model' or 'manufacturer'

    const navigate = useNavigate();
    const location = useLocation();
    const urlParamsProcessed = useRef(false); // UseRef to track URL parameter processing

    useEffect(() => {
        const loadManufacturers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/data/manufacturers/directory.txt');
                if (!response.ok) throw new Error('Failed to load manufacturers.');
                const text = await response.text();
                const manufacturers = text
                    .split('\n')
                    .filter(Boolean)
                    .map((line) => line.replace('\r', '').trim());
                setManufacturers(manufacturers);
            } catch (error) {
                console.error('Error loading manufacturers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadManufacturers();
    }, []);

    // UseEffect to handle URL parameters with useRef guard
    useEffect(() => {
        if (urlParamsProcessed.current) return; // Prevent running more than once
        urlParamsProcessed.current = true;

        const params = queryString.parse(location.search);

        if (params.cars) {
            const carListParam = Array.isArray(params.cars) ? params.cars : [params.cars];
            carListParam.forEach((car) => {
                const [make, model] = car.split(':');
                compareCar(make, model);
            });
        }

        if (params.manufacturers) {
            const manufacturersList = Array.isArray(params.manufacturers)
                ? params.manufacturers
                : [params.manufacturers];
            manufacturersList.forEach((make) => {
                compareManufacturer(make);
            });
        }
    }, [location.search]);

    const handleManufacturerChange = (event) => {
        const manufacturer = event.target.value;
        setSelectedManufacturer(manufacturer);
        setSelectedModel('');
        if (manufacturer && comparisonType === 'model') {
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
            const models = text
                .split('\n')
                .filter(Boolean)
                .map((line) => line.replace('\r', '').trim());
            setModels(models);
        } catch (error) {
            console.error('Error loading models:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const compareCar = async (make, model) => {
        const carLabel = `${make} ${model}`;

        // Check if the model is already in the list
        const isDuplicate = carList.some((car) => car.label === carLabel);

        if (isDuplicate) {
            return; // Skip adding duplicate
        }

        try {
            setIsLoading(true);

            // Fetch the directory.txt inside the model folder
            const response = await fetch(
                `/data/manufacturers/${make}/${model}/directory.txt`
            );
            if (!response.ok)
                throw new Error(
                    `Failed to load years for ${make} ${model}.`
                );
            const text = await response.text();
            const yearFiles = text
                .split('\n')
                .filter(Boolean)
                .map((line) => line.replace('\r', '').trim())
                .map((filename) => (filename.endsWith('.txt') ? filename : `${filename}.txt`));

            const carDetailsArray = await Promise.all(
                yearFiles.map(async (yearFileName) => {
                    try {
                        const year = parseInt(yearFileName.replace('.txt', ''), 10);
                        if (isNaN(year)) {
                            console.error(`Invalid year file name: ${yearFileName}`);
                            return null;
                        }

                        const res = await fetch(
                            `/data/manufacturers/${make}/${model}/${yearFileName}`
                        );
                        if (!res.ok)
                            throw new Error(
                                `Failed to load details for ${make} ${model} (${year}).`
                            );
                        const yearText = await res.text();
                        const lines = yearText.split('\n').filter(Boolean);
                        const [mpgLine, co2Line] = lines;

                        if (!mpgLine) {
                            console.error(`MPG data missing in ${yearFileName}`);
                            return null;
                        }

                        const [city, highway, combination] = mpgLine
                            .split(',')
                            .map((s) => s.trim());
                        let co2Data = {};
                        if (co2Line) {
                            const [cityCo2, highwayCo2, combinationCo2] = co2Line
                                .split(',')
                                .map((s) => s.trim());
                            co2Data = {
                                cityCo2: parseFloat(cityCo2),
                                highwayCo2: parseFloat(highwayCo2),
                                combinationCo2: parseFloat(combinationCo2),
                            };
                        }

                        return {
                            year,
                            city: parseFloat(city),
                            highway: parseFloat(highway),
                            combination: parseFloat(combination),
                            cityCo2: co2Data.cityCo2 || null,
                            highwayCo2: co2Data.highwayCo2 || null,
                            combinationCo2: co2Data.combinationCo2 || null,
                        };
                    } catch (error) {
                        console.error(`Error loading data for ${yearFileName}:`, error);
                        return null;
                    }
                })
            );

            const filteredCarDetails = carDetailsArray.filter((detail) => detail !== null);

            if (filteredCarDetails.length === 0) {
                alert('No data available for this model.');
                return;
            }

            const imagePath = getCarImage(make, model);

            const newCarData = {
                label: carLabel,
                xvalues: filteredCarDetails.map((detail) => detail.year),
                ycity: filteredCarDetails.map((detail) => detail.city),
                yhighway: filteredCarDetails.map((detail) => detail.highway),
                ycombined: filteredCarDetails.map((detail) => detail.combination),
                ycityCO2: filteredCarDetails.map((detail) => detail.cityCo2),
                yhighwayCO2: filteredCarDetails.map((detail) => detail.highwayCo2),
                ycombinedCO2: filteredCarDetails.map((detail) => detail.combinationCo2),
                imagePath,
            };

            setCarList((prevList) => [...prevList, newCarData]);
        } catch (error) {
            console.error('Error comparing model:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const compareManufacturer = async (make) => {
        const carLabel = `${make} (Average)`;

        // Check if the manufacturer is already in the list
        const isDuplicate = carList.some((car) => car.label === carLabel);

        if (isDuplicate) {
            return; // Skip adding duplicate
        }

        try {
            setIsLoading(true);

            // Fetch the directory.txt inside the averages folder
            const response = await fetch(
                `/data/manufacturers/${make}/averages/directory.txt`
            );
            if (!response.ok)
                throw new Error(`Failed to load average years for ${make}.`);
            const text = await response.text();
            const yearFiles = text
                .split('\n')
                .filter(Boolean)
                .map((line) => line.replace('\r', '').trim())
                .map((filename) => (filename.endsWith('.txt') ? filename : `${filename}.txt`));

            const carDetailsArray = await Promise.all(
                yearFiles.map(async (yearFileName) => {
                    try {
                        const year = parseInt(yearFileName.replace('avg.txt', ''), 10);
                        if (isNaN(year)) {
                            console.error(`Invalid year file name: ${yearFileName}`);
                            return null;
                        }

                        const res = await fetch(
                            `/data/manufacturers/${make}/averages/${yearFileName}`
                        );
                        if (!res.ok)
                            throw new Error(
                                `Failed to load average details for ${make} (${year}).`
                            );
                        const yearText = await res.text();
                        const lines = yearText.split('\n').filter(Boolean);
                        const [mpgLine, co2Line] = lines;

                        if (!mpgLine) {
                            console.error(`MPG data missing in ${yearFileName}`);
                            return null;
                        }

                        const [city, highway, combination] = mpgLine
                            .split(',')
                            .map((s) => s.trim());
                        let co2Data = {};
                        if (co2Line) {
                            const [cityCo2, highwayCo2, combinationCo2] = co2Line
                                .split(',')
                                .map((s) => s.trim());
                            co2Data = {
                                cityCo2: parseFloat(cityCo2),
                                highwayCo2: parseFloat(highwayCo2),
                                combinationCo2: parseFloat(combinationCo2),
                            };
                        }

                        return {
                            year,
                            city: parseFloat(city),
                            highway: parseFloat(highway),
                            combination: parseFloat(combination),
                            cityCo2: co2Data.cityCo2 || null,
                            highwayCo2: co2Data.highwayCo2 || null,
                            combinationCo2: co2Data.combinationCo2 || null,
                        };
                    } catch (error) {
                        console.error(
                            `Error loading average data for ${yearFileName}:`,
                            error
                        );
                        return null;
                    }
                })
            );

            const filteredCarDetails = carDetailsArray.filter((detail) => detail !== null);

            if (filteredCarDetails.length === 0) {
                alert('No average data available for this manufacturer.');
                return;
            }

            const newCarData = {
                label: carLabel,
                xvalues: filteredCarDetails.map((detail) => detail.year),
                ycity: filteredCarDetails.map((detail) => detail.city),
                yhighway: filteredCarDetails.map((detail) => detail.highway),
                ycombined: filteredCarDetails.map((detail) => detail.combination),
                ycityCO2: filteredCarDetails.map((detail) => detail.cityCo2),
                yhighwayCO2: filteredCarDetails.map((detail) => detail.highwayCo2),
                ycombinedCO2: filteredCarDetails.map((detail) => detail.combinationCo2),
                imagePath: null, // No image for manufacturer averages
            };

            setCarList((prevList) => [...prevList, newCarData]);
        } catch (error) {
            console.error('Error comparing manufacturer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompare = async () => {
        if (comparisonType === 'manufacturer') {
            if (!selectedManufacturer) return;
            await compareManufacturer(selectedManufacturer);
        } else if (comparisonType === 'model') {
            if (!selectedManufacturer || !selectedModel) return;
            await compareCar(selectedManufacturer, selectedModel);
        }
    };

    const removeCar = (index) => {
        setCarList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const renderChart = () => {
        if (carList.length === 0) return <p>No cars to compare.</p>;

        const datasets = carList
            .map((car) => {
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
                    const historicalValues = dataPoints.map((point) => point.y);

                    const { years: forecastYears, values: forecastValues } = forecastData(
                        historicalYears,
                        historicalValues,
                        5
                    );

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
                            // Exclude from legend by setting custom property
                            showInLegend: false,
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
            })
            .flat();

        // Combine all x-axis labels
        const xLabelsSet = new Set();
        carList.forEach((car) => car.xvalues.forEach((year) => xLabelsSet.add(year)));
        if (showForecast) {
            carList.forEach((car) => {
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
            plugins: {
                legend: {
                    labels: {
                        filter: function (legendItem) {
                            // Exclude forecasted datasets from the legend
                            return !legendItem.text.includes('(Forecast)');
                        },
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
                <h2>Select Comparison Type</h2>
                <div className="comparison-type">
                    <button
                        onClick={() => {
                            setComparisonType('model');
                            setSelectedManufacturer('');
                            setSelectedModel('');
                            setModels([]);
                        }}
                        className={comparisonType === 'model' ? 'active' : ''}
                    >
                        Compare Models
                    </button>
                    <button
                        onClick={() => {
                            setComparisonType('manufacturer');
                            setSelectedManufacturer('');
                            setSelectedModel('');
                            setModels([]);
                        }}
                        className={comparisonType === 'manufacturer' ? 'active' : ''}
                    >
                        Compare Manufacturers
                    </button>
                </div>

                <div className="selector">
                    <label htmlFor="manufacturer-select">Manufacturer:</label>
                    <select
                        id="manufacturer-select"
                        value={selectedManufacturer}
                        onChange={handleManufacturerChange}
                    >
                        <option value="">-- Select Manufacturer --</option>
                        {manufacturers.map((manufacturer, idx) => (
                            <option key={idx} value={manufacturer}>
                                {manufacturer}
                            </option>
                        ))}
                    </select>
                </div>
                {comparisonType === 'model' && models.length > 0 && (
                    <div className="selector">
                        <label htmlFor="model-select">Model:</label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={handleModelChange}
                        >
                            <option value="">-- Select Model --</option>
                            {models.map((model, idx) => (
                                <option key={idx} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    className="compare-button"
                    onClick={handleCompare}
                    disabled={
                        !selectedManufacturer || (comparisonType === 'model' && !selectedModel)
                    }
                >
                    Add to Comparison
                </button>
                <button
                    onClick={() => setShowForecast(!showForecast)}
                    className={`forecast-button ${showForecast ? 'active' : ''}`}
                >
                    {showForecast ? 'Disable Forecast' : 'Enable Forecast'}
                </button>
            </div>

            <div className="right-cards">
                <div className="top-card">
                    <div className="car-list">
                        {carList.map((car, idx) => (
                            <div className="car-card" key={idx}>
                                {car.imagePath ? (
                                    <img src={car.imagePath} alt={car.label} className="car-image" />
                                ) : (
                                    <div className="no-image">No Image Available</div>
                                )}
                                <span className="car-title">{car.label}</span>
                                <button className="remove-button" onClick={() => removeCar(idx)}>
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bottom-card">
                    <h2>Performance Chart</h2>
                    <div className="chart-type-buttons">
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
                            CO₂ Emissions
                        </button>
                    </div>
                    {renderChart()}
                </div>
            </div>
        </div>
    );
};

export default Analysis;
