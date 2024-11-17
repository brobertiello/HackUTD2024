import React, { useEffect, useState } from 'react';
import MPGLineChart from '../components/chart/MPGLineChart.jsx';
import CO2LineChart from '../components/chart/CO2LineChart.jsx';
import styles from './AnalyticsPage.css';

const AnalyticsPage = () => {
    const [toyotaModels, setToyotaModels] = useState([]);
    const [selectedToyotaModel, setSelectedToyotaModel] = useState('');
    const [toyotaCarDetails, setToyotaCarDetails] = useState(null);

    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [carDetails, setCarDetails] = useState(null);

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

        const loadToyotaModels = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/data/manufacturers/Toyota/directory.txt');
                if (!response.ok) throw new Error('Failed to load Toyota models.');
                const text = await response.text();
                const models = text.split('\n').filter(Boolean);
                setToyotaModels(models);
            } catch (error) {
                console.error("Error loading Toyota models:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadManufacturers();
        loadToyotaModels();
    }, []);

    const handleToyotaModelChange = (event) => {
        const model = event.target.value;
        setSelectedToyotaModel(model);
        setToyotaCarDetails(null);
        if (model) {
            loadCarDetails('Toyota', model, setToyotaCarDetails);
        }
    };

    const handleManufacturerChange = (event) => {
        const manufacturer = event.target.value;
        setSelectedManufacturer(manufacturer);
        setSelectedModel('');
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
        setCarDetails(null);
        if (model) {
            loadCarDetails(selectedManufacturer, model, setCarDetails);
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

    const loadCarDetails = async (manufacturer, model, setCarDetails) => {
        try {
            setIsLoading(true);
            console.log(`Fetching years for ${manufacturer} ${model}...`);
    
            const response = await fetch(`/data/manufacturers/${manufacturer}/${model}/directory.txt`);
            if (!response.ok) throw new Error(`Failed to load years for ${model}.`);
    
            const yearText = await response.text();
            const years = yearText.split('\n').filter(Boolean);
            console.log(`Years found: ${years}`);
    
            const carDetailsArray = [];
    
            for (let i = 0; i < years.length; i++) {
                console.log(`Fetching details for year ${years[i]}...`);
                const detailsResponse = await fetch(`/data/manufacturers/${manufacturer}/${model}/${years[i]}.txt`);
                if (!detailsResponse.ok) {
                    console.error(`Failed to load details for ${model} (${years[i]}).`);
                    continue;
                }
    
                const detailsText = await detailsResponse.text();
                console.log(`Raw details for year ${years[i]}:`, detailsText);
    
                const [
                    cityMPG,
                    hwyMPG,
                    combinedMPG,
                    cityCO2,
                    hwyCO2,
                    combinedCO2,
                ] = detailsText.split(',');
    
                console.log(`Parsed details for year ${years[i]}:`, {
                    cityMPG,
                    hwyMPG,
                    combinedMPG,
                    cityCO2,
                    hwyCO2,
                    combinedCO2,
                });
    
                carDetailsArray.push({
                    year: years[i].trim(),
                    city: cityMPG ? cityMPG.trim() : null,
                    highway: hwyMPG ? hwyMPG.trim() : null,
                    combination: combinedMPG ? combinedMPG.trim() : null,
                    cityCO2: cityCO2 ? cityCO2.trim() : null,
                    highwayCO2: hwyCO2 ? hwyCO2.trim() : null,
                    combinationCO2: combinedCO2 ? combinedCO2.trim() : null,
                });
            }
    
            console.log(`Final car details for ${manufacturer} ${model}:`, carDetailsArray);
            setCarDetails(carDetailsArray);
        } catch (error) {
            console.error("Error loading car details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    

    console.log('Toyota Car Details:', toyotaCarDetails);
    console.log('Other Manufacturer Car Details:', carDetails);

    

    return (
        <div className="car-page">
            <div className="main-content">
                <h1>Car Details Lookup</h1>
                <div className="columns">
                    {/* Toyota Column */}
                    <div className="column">
                        <h2>Toyota</h2>
                        <div className="selectors">
                            <div className="selector">
                                <label htmlFor="toyota-model-select">Model:</label>
                                <select
                                    id="toyota-model-select"
                                    value={selectedToyotaModel}
                                    onChange={handleToyotaModelChange}
                                >
                                    <option value="">--Select Toyota Model--</option>
                                    {toyotaModels.map((model, index) => (
                                        <option key={index} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* Other Manufacturer Column */}
                        <div className="column">
                            <h2>Compare with Other Manufacturer</h2>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {carDetails && toyotaCarDetails && (
            <div className="main-content chart-container">
                <MPGLineChart
                    cars={[
                        {
                            label: `Toyota ${selectedToyotaModel}`,
                            xvalues: toyotaCarDetails.map((detail) => parseInt(detail.year, 10)), // Years as x-axis values
                            ycity: toyotaCarDetails.map((detail) => parseInt(detail.city, 10)), // City MPG for all years
                            yhighway: toyotaCarDetails.map((detail) => parseInt(detail.highway, 10)), // Highway MPG for all years
                            ycombined: toyotaCarDetails.map((detail) => parseInt(detail.combination, 10)), // Combined MPG for all years
                        },
                        {
                            label: `${selectedManufacturer} ${selectedModel}`,
                            xvalues: carDetails.map((detail) => parseInt(detail.year, 10)), // Years as x-axis values
                            ycity: carDetails.map((detail) => parseInt(detail.city, 10)), // City MPG for all years
                            yhighway: carDetails.map((detail) => parseInt(detail.highway, 10)), // Highway MPG for all years
                            ycombined: carDetails.map((detail) => parseInt(detail.combination, 10)), // Combined MPG for all years
                        },
                    ]}
                />
            </div>
            )}
            
            {carDetails && toyotaCarDetails && (
            <div className="main-content chart-container">
                <CO2LineChart
                    cars={[
                        {
                            label: `Toyota ${selectedToyotaModel}`,
                            xvalues: toyotaCarDetails.map((detail) => parseInt(detail.year, 10)), // Years as x-axis values
                            ycity: toyotaCarDetails.map((detail) => parseInt(detail.cityCO2, 10)), // City CO2 for all years
                            yhighway: toyotaCarDetails.map((detail) => parseInt(detail.highwayCO2, 10)), // Highway CO2 for all years
                            ycombined: toyotaCarDetails.map((detail) => parseInt(detail.combinationCO2, 10)), // Combined CO2 for all years
                        },
                        {
                            label: `${selectedManufacturer} ${selectedModel}`,
                            xvalues: carDetails.map((detail) => parseInt(detail.year, 10)), // Years as x-axis values
                            ycity: carDetails.map((detail) => parseInt(detail.cityCO2, 10)), // City CO2 for all years
                            yhighway: carDetails.map((detail) => parseInt(detail.highwayCO2, 10)), // Highway CO2 for all years
                            ycombined: carDetails.map((detail) => parseInt(detail.combinationCO2, 10)), // Combined CO2 for all years
                        },
                    ]}
                />
            </div>
                
            )}
            
        </div>
    );
};

export default AnalyticsPage;
