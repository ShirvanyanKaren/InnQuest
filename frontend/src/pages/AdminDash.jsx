import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getReservationsByMonth, getReservationRevenueByMonth } from '../services/reservation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import CreateHotel from '../components/CreateHotel';
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
  const thisMonth = new Date().getMonth();
  const [showHotelCreate, setShowHotelCreate] = useState(false);
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
  const [lineChartData, setLineChartData] = useState({
    labels: labels,
    datasets: [
        {
        label: 'Revenue by Month',
        data:[],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
        },
    ],
    });
    useEffect(() => {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        getReservationsByMonth(startOfYear, today).then((res) => {
            const reservations =[]
            const revenue = []
            const data = res.data;
            const labels = Object.keys(data);
            for (const month in data) {
                revenue.push(data[month]['revenue']);
                reservations.push(data[month]['reservations']);
            }
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Monthly Bookings',
                        data: reservations,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
            console.log(thisMonth)
            setLineChartData({
                labels: labels.slice(0, thisMonth + 1),
                datasets: [
                    {
                        label: 'Revenue by Month',
                        data: revenue,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1,
                    },
                ],
            });
        });
    }, []);

    console.log(chartData);
    console.log(lineChartData, 'line chart data');

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
        <ul className="list-unstyled admin-dash">
        <li><a 
        onClick={() => setShowHotelCreate(true)}
        className={` text-decoration-none ${showHotelCreate ? 'active' : ''}`}>Create Hotels</a></li>
          <li><a href="#" className=" text-decoration-none">Create Rooms</a></li>
          <li><a href="#" className=" text-decoration-none">Reservations</a></li>
          <li><a href="#" className=" text-decoration-none">Hotels</a></li>
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
                <Line data={lineChartData} />
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
        <CreateHotel show={showHotelCreate} setShow={setShowHotelCreate} handleClose={() => setShowHotelCreate(false)} />  
      </div>
    </div>
  );
};

export default AdminDash;
