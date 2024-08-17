import {useEffect, useState} from 'react';
import Auth from '../utils/auth';

const AdminDash = () => {
    if (!Auth.isSuperUser())  window.location.replace('/');
    



    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    )
}

export default AdminDash;



