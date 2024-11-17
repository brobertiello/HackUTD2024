
import React, { useEffect, useState, useMemo } from 'react';
import ChartSlider from '../components/CarComparison/ChartSlider.jsx';
import CarCards from '../components/CarComparison/CarCards.jsx';
import { useLocation } from 'react-router-dom';
import styles from './AnalyticsPage.css';

const AnalyticsPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [additionalCars, setAdditionalCars] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const carList = location.state?.carList || [];

    useEffect(() => {
        if (carList.length > 0) {
            handleAddCarsToChart(carList);
        }
    }, [carList]);

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

    // Add Car to Chart
    const handleAddToChart = async () => {
        if (!selectedManufacturer || !selectedModel) return;
    
        const newCarLabel = `${selectedManufacturer} ${selectedModel}`;
    
        // Check for duplicates
        if (additionalCars.some((car) => car.label === newCarLabel)) {
            alert("This car has already been added."); // Notify the user
            return;
        }
    
        try {
            setIsLoading(true);
            const response = await fetch(`/data/manufacturers/${selectedManufacturer}/${selectedModel}/directory.txt`);
            if (!response.ok) throw new Error(`Failed to load years for ${selectedModel}.`);
            const yearText = await response.text();
            const years = yearText.split('\n').filter(Boolean);
    
            const carDetailsArray = [];
            for (let year of years) {
                const detailsResponse = await fetch(`/data/manufacturers/${selectedManufacturer}/${selectedModel}/${year}.txt`);
                if (!detailsResponse.ok) continue;
                const detailsText = await detailsResponse.text();
                const [cityMPG, hwyMPG, combinedMPG, cityCO2, hwyCO2, combinedCO2] = detailsText.split(',').map((val) => val.trim());
    
                carDetailsArray.push({
                    year: parseInt(year, 10),
                    city: parseInt(cityMPG, 10),
                    highway: parseInt(hwyMPG, 10),
                    combination: parseInt(combinedMPG, 10),
                    cityCO2: parseInt(cityCO2, 10),
                    highwayCO2: parseInt(hwyCO2, 10),
                    combinationCO2: parseInt(combinedCO2, 10),
                });
            }
    
            setAdditionalCars((prev) => [
                ...prev,
                {
                    label: newCarLabel,
                    xvalues: carDetailsArray.map((detail) => detail.year),
                    ycity: carDetailsArray.map((detail) => detail.city),
                    yhighway: carDetailsArray.map((detail) => detail.highway),
                    ycombined: carDetailsArray.map((detail) => detail.combination),
                    ycityCO2: carDetailsArray.map((detail) => detail.cityCO2),
                    yhighwayCO2: carDetailsArray.map((detail) => detail.highwayCO2),
                    ycombinedCO2: carDetailsArray.map((detail) => detail.combinationCO2),
                },
            ]);
        } catch (error) {
            console.error("Error adding car to chart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add Cars to Chart
    const handleAddCarsToChart = async (carList) => {
        if (!Array.isArray(carList) || carList.length === 0) return;
    
        try {
            setIsLoading(true);
    
            const carsToAdd = [];
    
            for (const [make, model] of carList) {
                const newCarLabel = `${make} ${model}`;
    
                // Check for duplicates
                if (additionalCars.some((car) => car.label === newCarLabel)) {
                    console.warn(`Car ${newCarLabel} has already been added.`);
                    continue; // Skip this car
                }
    
                // Fetch years for the car
                const response = await fetch(`/data/manufacturers/${make}/${model}/directory.txt`);
                if (!response.ok) {
                    console.error(`Failed to load years for ${model}.`);
                    continue; // Skip this car
                }
                const yearText = await response.text();
                const years = yearText.split('\n').filter(Boolean);
    
                const carDetailsArray = [];
                for (let year of years) {
                    try {
                        const detailsResponse = await fetch(`/data/manufacturers/${make}/${model}/${year}.txt`);
                        if (!detailsResponse.ok) continue;
                        const detailsText = await detailsResponse.text();
                        const [cityMPG, hwyMPG, combinedMPG, cityCO2, hwyCO2, combinedCO2] = detailsText.split(',').map((val) => val.trim());
    
                        carDetailsArray.push({
                            year: parseInt(year, 10),
                            city: parseInt(cityMPG, 10),
                            highway: parseInt(hwyMPG, 10),
                            combination: parseInt(combinedMPG, 10),
                            cityCO2: parseInt(cityCO2, 10),
                            highwayCO2: parseInt(hwyCO2, 10),
                            combinationCO2: parseInt(combinedCO2, 10),
                        });
                    } catch (error) {
                        console.error(`Failed to load details for ${make} ${model} (${year}).`, error);
                    }
                }
    
                if (carDetailsArray.length > 0) {
                    carsToAdd.push({
                        label: newCarLabel,
                        xvalues: carDetailsArray.map((detail) => detail.year),
                        ycity: carDetailsArray.map((detail) => detail.city),
                        yhighway: carDetailsArray.map((detail) => detail.highway),
                        ycombined: carDetailsArray.map((detail) => detail.combination),
                        ycityCO2: carDetailsArray.map((detail) => detail.cityCO2),
                        yhighwayCO2: carDetailsArray.map((detail) => detail.highwayCO2),
                        ycombinedCO2: carDetailsArray.map((detail) => detail.combinationCO2),
                    });
                }
            }
    
            // Update state with all new cars
            if (carsToAdd.length > 0) {
                setAdditionalCars((prev) => [...prev, ...carsToAdd]);
            }
        } catch (error) {
            console.error("Error adding cars to chart:", error);
        } finally {
            setIsLoading(false);
        }
    };    

    const memoizedCars = useMemo(() => additionalCars, [additionalCars]);

    return (
        <div className="car-page">
            <div className="main-content">
                <h1>Car Details Lookup</h1>
                <div className="selectors">
                    <div className="selector">
                        <label htmlFor="manufacturer-select">Manufacturer:</label>
                        <select
                            id="manufacturer-select"
                            value={selectedManufacturer}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value !== selectedManufacturer) {
                                    setSelectedManufacturer(value);
                                    setSelectedModel('');
                                    setModels([]);
                                    if (value) loadModels(value);
                                }
                            }}
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
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value !== selectedModel) {
                                    setSelectedModel(value);
                                }
                            }}
                            disabled={!selectedManufacturer}
                        >
                            <option value="">--Select Model--</option>
                            {models.map((model, index) => (
                                <option key={index} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleAddToChart} disabled={!selectedManufacturer || !selectedModel}>
                        Add to Chart
                    </button>
                </div>
            </div>

            <div className="charts">
                {/* Car Cards */}
                {memoizedCars.length > 0 && ( // Only render CarCards if there are cars
                <div className="main-content">
                        <div className="car-cards">
                            <CarCards cars={memoizedCars} />
                        </div>
                </div>
                )}


                {/* Chart Slider */}
                {memoizedCars.length > 0 && ( // Only render the chart if there are cars
                    <div className="main-content">
                        <ChartSlider mpgData={memoizedCars} co2Data={memoizedCars} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
