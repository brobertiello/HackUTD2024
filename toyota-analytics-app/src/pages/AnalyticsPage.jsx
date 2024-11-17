import React, { useEffect, useState, useMemo } from 'react';
import ChartSlider from '../components/CarComparison/ChartSlider.jsx';
import CarCards from '../components/CarComparison/CarCards.jsx';
import styles from './AnalyticsPage.css';

const AnalyticsPage = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [additionalCars, setAdditionalCars] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

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
                    city: parseInt(cityMPG, 10), // Default to 0 if parsing fails
                    highway: parseInt(hwyMPG, 10),
                    combination: parseInt(combinedMPG, 10),
                    cityCO2: parseInt(cityCO2, 10),
                    highwayCO2: parseInt(hwyCO2, 10),
                    combinationCO2: parseInt(combinedCO2, 10),
                });
            }

            console.log(carDetailsArray)
    
            // Ensure years are fixed to 2021-2025
            const fixedYears = [2021, 2022, 2023, 2024, 2025];
            const alignedData = fixedYears.map((year) => {
                const details = carDetailsArray.find((detail) => detail.year === year) || {};
                return {
                    year,
                    city: details.city,
                    highway: details.highway,
                    combination: details.combination,
                    cityCO2: details.cityCO2,
                    highwayCO2: details.highwayCO2,
                    combinationCO2: details.combinationCO2,
                };
            });
    
            setAdditionalCars((prev) => [
                ...prev,
                {
                    label: newCarLabel,
                    xvalues: alignedData.map((detail) => detail.year),
                    ycity: alignedData.map((detail) => detail.city),
                    yhighway: alignedData.map((detail) => detail.highway),
                    ycombined: alignedData.map((detail) => detail.combination),
                    ycityCO2: alignedData.map((detail) => detail.cityCO2),
                    yhighwayCO2: alignedData.map((detail) => detail.highwayCO2),
                    ycombinedCO2: alignedData.map((detail) => detail.combinationCO2),
                },
            ]);
        } catch (error) {
            console.error("Error adding car to chart:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const memoizedCars = useMemo(() => additionalCars, [additionalCars]);

    return (
        <div className="car-page">
            <div className="main-content right-column">
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

                    <button className='launch-button' onClick={handleAddToChart} disabled={!selectedManufacturer || !selectedModel}>
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
