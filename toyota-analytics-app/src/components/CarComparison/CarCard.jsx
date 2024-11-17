import MPGLineChart from "../chart/MPGLineChart";

const CarCard = ({ cars }) => {
    return (
        <div className="car-details">
            <MPGLineChart cars={cars} />
        </div>
    );
}   

export default CarCard;