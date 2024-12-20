import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarPage.css';
import getCarImage from '../hooks/getCarImage';

const CarPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [yearData, setYearData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [carDetails, setCarDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePath, setImagePath] = useState('');
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

    useEffect(() => {
        if (selectedManufacturer && selectedModel) {
            try {
                const path = getCarImage(selectedManufacturer, selectedModel);
                setImagePath(path);
            } catch (error) {
                console.error("Error getting car image:", error);
                setImagePath('');
            }
        } else {
            setImagePath('');
        }
    }, [selectedManufacturer, selectedModel]);

    const handleManufacturerChange = (event) => {
        const manufacturer = event.target.value;
        setSelectedManufacturer(manufacturer);
        setSelectedModel('');
        setYearData([]);
        setSelectedYear('');
        setCarDetails(null);
        if (manufacturer) {
            loadModels(manufacturer);
        } else {
            setModels([]);
        }
    };

    const handleModelChange = (event) => {
        const model = event.target.value;
        setSelectedModel(model);
        setYearData([]);
        setSelectedYear('');
        setCarDetails(null);
        if (model) {
            loadYearData(selectedManufacturer, model);
        } else {
            setYearData([]);
        }
    };

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
        setCarDetails(null);
        if (year) {
            loadCarDetails(selectedManufacturer, selectedModel, year);
        }
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

    const loadYearData = async (manufacturer, model) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/manufacturers/${manufacturer}/${model}/directory.txt`);
            if (!response.ok) throw new Error(`Failed to load years for ${model}.`);
            const text = await response.text();
            const years = text.split('\n').filter(Boolean);
            setYearData(years);
        } catch (error) {
            console.error("Error loading year data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCarDetails = async (manufacturer, model, year) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/data/manufacturers/${manufacturer}/${model}/${year}.txt`);
            if (!response.ok) throw new Error(`Failed to load details for ${model} (${year}).`);
            const yearText = await response.text();
            const lines = yearText.split('\n').filter(Boolean);
            const [mpgLine, co2Line] = lines;
            const [city, highway, combination] = mpgLine.split(',');
            let co2Data = {};
            if (co2Line) {
                const [cityCo2, highwayCo2, combinationCo2] = co2Line.split(',');
                co2Data = {
                    cityCo2: cityCo2.trim(),
                    highwayCo2: highwayCo2.trim(),
                    combinationCo2: combinationCo2.trim(),
                };
            }

            setCarDetails({
                year,
                city: city.trim(),
                highway: highway.trim(),
                combination: combination.trim(),
                ...co2Data,
            });
        } catch (error) {
            console.error("Error loading car details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Define the redirectToAnalysis function
    const redirectToAnalysis = (cars) => {
        // 'cars' is an array of [make, model] tuples
        const carsParam = cars
            .map(([make, model]) => `${encodeURIComponent(make)}:${encodeURIComponent(model)}`)
            .join(',');

        // Construct the URL with query parameters
        const url = `/analysis?cars=${carsParam}`;

        // Navigate to the Analysis page
        navigate(url);
    };

    return (
        <div className="car-page">
            <div className="selection-card">
                <h1>Car Details Lookup</h1>
                <div className="selectors">
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

                    <div className="selector">
                        <label htmlFor="year-select">Year:</label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={handleYearChange}
                            disabled={!selectedModel || yearData.length === 0}
                        >
                            <option value="">--Select Year--</option>
                            {yearData.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="results-card">
                {isLoading && <div className="loading">Loading...</div>}
                {carDetails ? (
                    <div className="car-details">
                        <div className="card-header">
                            <h2>{`${selectedManufacturer} ${selectedModel} (${carDetails.year})`}</h2>
                            <div
                                className="redirect-arrow"
                                onClick={() => redirectToAnalysis([[selectedManufacturer, selectedModel]])}
                                style={{ cursor: 'pointer' }}
                            >
                                <span>&#8594;</span>
                            </div>
                        </div>

                        {imagePath && (
                            <img
                                src={imagePath}
                                alt={`${selectedManufacturer} ${selectedModel}`}
                                className="car-image"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevents infinite loop
                                    e.target.src = '/data/carImages/default.png'; // Fallback image
                                }}
                            />
                        )}

                        <table className="car-table">
                            <thead>
                                <tr>
                                    <th>City MPG</th>
                                    <th>Highway MPG</th>
                                    <th>Combination MPG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{carDetails.city}</td>
                                    <td>{carDetails.highway}</td>
                                    <td>{carDetails.combination}</td>
                                </tr>
                            </tbody>
                        </table>
                        {carDetails.cityCo2 && (
                            <table className="car-table">
                                <thead>
                                    <tr>
                                        <th>City CO2</th>
                                        <th>Highway CO2</th>
                                        <th>Combination CO2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{carDetails.cityCo2}</td>
                                        <td>{carDetails.highwayCo2}</td>
                                        <td>{carDetails.combinationCo2}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    !isLoading && (
                        <p className="instruction">
                            Select a manufacturer, model, and year to view details.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default CarPage;