import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getReservationsByMonth } from '../services/reservation';
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
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [chartData, setChartData] = useState({
    labels: labels,
    datasets: [
        {
            label: 'Monthly Bookings',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
    });
  const [lineChartData, setLineChartData] = useState({});
  const thisMonth = new Date().getMonth();


    useEffect(() => {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        getReservationsByMonth(startOfYear, today).then((res) => {
            const data = res.data;
            const dataArr = Object.values(data);
            const labels = Object.keys(data);
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Monthly Bookings',
                        data: dataArr,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });

        })
    }, []);

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
        <h3>Dashboard</h3>
        <ul className="list-unstyled">
        <li><a href="#" className="text-dark text-decoration-none fs-5">Create Hotels</a></li>
          <li><a href="#" className="text-dark text-decoration-none fs-5">Create Rooms</a></li>
          <li><a href="#" className="text-dark text-decoration-none fs-5">Reservations</a></li>
          <li><a href="#" className="text-dark text-decoration-none fs-5">Hotels</a></li>
        </ul>
      </div>
      <div className="content dash-content p-4" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Room Bookings</h5>
                <Bar data={chartData} />
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
