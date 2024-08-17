import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
// import pie chart
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from '../utils/auth';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const AdminDash = () => {
  if (!Auth.isSuperUser()) window.location.replace('/');

  const [chartData, setChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const thisMonth = new Date().getMonth();
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dummyData = {
        labels: labels.slice(0, thisMonth),
        datasets: [
            {
            label: 'Revenue',
            data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 80],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            },
        ],
        };

    const dummyLineData = {
        labels: labels.slice(0, thisMonth),
        datasets: [
            {
            label: 'Revenue',
            data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 80],
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
            },
        ],
        };
        const data = {
            labels: ["Customer", "Business"],
            datasets: [
              {
                data: [12, 29],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                ],
                borderWidth: 1,
              },
            ],
          };


  return (
    <div className="d-flex">
      <div className="sidebar bg-light p-3" style={{ width: '250px' }}>
        <h4>Dashboard</h4>
        <ul className="list-unstyled">
          <li><a href="#" className="text-dark text-decoration-none">Create Hotel</a></li>
          <li><a href="#" className="text-dark text-decoration-none">Create Rooms</a></li>
          <li><a href="#" className="text-dark text-decoration-none">Reservations</a></li>
          <li><a href="#" className="text-dark text-decoration-none">Hotels</a></li>
        </ul>
      </div>
      <div className="content p-4" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Room Bookings</h5>
                <Bar data={dummyData} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Revenue Over Time</h5>
                <Line data={dummyLineData} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Bookings by City</h5>
                <Pie data={data} />
              </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
