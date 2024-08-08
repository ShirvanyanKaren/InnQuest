import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Loading from './Loading';
import ToolTip from './ToolTip';

const HotelCard = ({ hotel, hotelId }) => {
    const [hotelData, setHotelData] = useState({});

    useEffect(() => {
    }, []);

    return (
        <div className="card p-3 mt-3">
            {Object.keys(hotelData).length === 0 ? (
                <Loading />
            ) : (
                <>
                    <div className='row container'>
                        <div className="hotel-main-image col-6">
                            <img
                                style={{ height: "350px", width: '100%', objectFit: "cover" }}
                                src={hotelData.image_urls[0]} alt="hotel" />
                        </div>
                        <div className="hotel-images col-6">
                            <div className="row">
                                {hotelData.image_urls.slice(1, 5).map((image, index) => (
                                    <div className="col-6 mt-1 me-0" key={index}>
                                        <img
                                            style={{ objectFit: "cover", height: "170px", width: "105%" }}
                                            src={image} alt="hotel" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h1 className='mt-3'>{hotelData.name}</h1>
                    <p>{hotelData.city}, {hotelData.state}</p>
                    <p>{hotelData.description}</p>
                    <h4 className="text-muted">{hotelData.rating} Popular Amenities</h4>
                    <div className="row">
                        {hotelData?.amenities.slice(0,6).map((amenity, index) => (
                            <div className="m-1 col-4 fs-5" key={index}>
                                <ToolTip amenity={amenity} description={amenity} />
                            </div>
                        ))}
                        
                    </div>
                </>
            )}
        </div>
    );
}

export default HotelCard;
