import { useEffect, useState } from "react";
import { createReservation } from "../services/reservation";

const Success = () => {
    const [reservation, setReservation] = useState({});
return (
    <div className="container mt-3">
        <h1>Success</h1>
        <p>Your reservation has been successfully created!</p>
    </div>
);


}

export default Success;