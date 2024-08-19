import CreateHotel from "./CreateHotel";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Auth from "../utils/auth";



const AdminSidebar = () => {
    const [showHotelCreate, setShowHotelCreate] = useState(false);
    const location = useLocation();
    return (
        <div className={`${Auth.loggedIn() && Auth.isSuperUser() ? 'sidebar admin-sidebar bg-light p-3' : 'd-none'}`}
        style={{ width: '250px', 
        height: '150vh',

        }}>
        <h3
        onClick={() => window.location.replace('/admin')
        }
        >Dashboard</h3>
        <ul className="list-unstyled admin-dash">
        <li><a 
        onClick={() => setShowHotelCreate(true)}
        className={` text-decoration-none ${showHotelCreate ? 'active' : ''}`}>Create Hotels</a></li>
          <li><a href="/admin/hotels" className={`${location.pathname === '/admin/hotels' ? 'active' : ''}`}>Manage Hotels</a></li>
        <li><a href="/reservations" className={`${location.pathname === '/reservations' ? 'active' : ''}`}>Reservations</a></li>
        </ul>
        <CreateHotel show={showHotelCreate} handleClose={() => setShowHotelCreate(false)}
        edit={false} currHotel={null} />
      </div>
    
    );

}

export default AdminSidebar;
