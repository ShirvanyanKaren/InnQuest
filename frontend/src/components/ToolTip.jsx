import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faSwimmingPool, faUtensils, faDoorOpen, faClock, faTable,faCocktail, faParking, faTv, faDumbbell, faDog, faCat, faWheelchair, faSmokingBan, faHotTub, faPhone, faA, faAirFreshener, faWind, faShirt, faCodePullRequest, faTShirt, faSpa, faChargingStation, faCutlery, faCut, faBreadSlice, faEgg, faBed, faSnowflake, faShuttleVan, faPaw, faRuler, faPerson, faPeopleCarryBox, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const ToolTip = (props) => {
    const amenitiesMap = {
        "Free Wi-Fi": faWifi,
        "Pool": faSwimmingPool,
        "Breakfast Included": faEgg,
        "Parking": faParking,
        "TV": faTv,
        "Gym": faDumbbell,
        "Pet Friendly": faPaw,
        "Wheelchair Accessible": faWheelchair,
        "Hot Tub": faHotTub,
        "Bar": faCocktail,
        "24/7 Front Desk": faClock,
        "Room Service": faPhone,
        "Connecting Rooms": faDoorOpen,
        "Air Conditioning": faSnowflake, 
        "Spa": faSpa,
        "Restaurant": faUtensils,  
        "Non-smoking": faSmokingBan, 
        "Laundry Service": faTShirt,
        "Electric Vehicle Charging": faChargingStation,
        "Bed": faBed,
        "Airport Shuttle": faShuttleVan,
        "Footage": faRuler,
        "Guests": faPeopleGroup,
    };

    const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
        ({ theme }) => ({
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: '#fff',
                maxWidth: 220,
                fontSize: theme.typography.pxToRem(20),
                border: '1px solid #dadde9',
                borderRadius: '4px',
                padding: '8px',
            },
        }),
    );

    return (
        <HtmlTooltip
            title={
                <React.Fragment>
                    <Typography variant='body2' component='span'>
                        {props.amenity}
                    </Typography>
                </React.Fragment>
            }>
                <FontAwesomeIcon icon={amenitiesMap[props.amenity]} />
                <label className="form-check-label ms-2" htmlFor={props.amenity}>
                     {props?.description}
                    </label>
        </HtmlTooltip>
    );
};

export default ToolTip;
