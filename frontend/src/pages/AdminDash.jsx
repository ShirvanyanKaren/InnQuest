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
            labels: ["Chicago", "New York", "Los Angeles", "San Francisco", "Miami", "Las Vegas", "Seattle", "Boston", "Washington D.C.", "New Orleans", "San Diego", "Orlando", "Denver", "Austin", "Nashville", "Portland", "Atlanta", "Dallas", "Houston", "Phoenix"],
            datasets: [
              {
                data: [200, 50, 100, 40, 120, 80, 30, 60, 90, 70, 110, 20, 10, 150, 140, 130, 170, 180, 190, 160],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(199, 199, 199, 0.2)',
                  'rgba(83, 102, 255, 0.2)',
                  'rgba(255, 255, 86, 0.2)',
                  'rgba(102, 255, 102, 0.2)',
                  'rgba(255, 102, 204, 0.2)',
                  'rgba(204, 102, 255, 0.2)',
                  'rgba(102, 255, 204, 0.2)',
                  'rgba(255, 102, 102, 0.2)',
                  'rgba(102, 153, 255, 0.2)',
                  'rgba(255, 204, 102, 0.2)',
                  'rgba(102, 255, 153, 0.2)',
                  'rgba(204, 255, 102, 0.2)',
                  'rgba(255, 102, 153, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 153, 102, 0.2)',
                  'rgba(102, 102, 255, 0.2)',
                  'rgba(255, 204, 153, 0.2)',
                  'rgba(153, 255, 102, 0.2)',
                  'rgba(255, 102, 204, 0.2)',
                  'rgba(204, 153, 255, 0.2)',
                  'rgba(102, 255, 102, 0.2)',
                  'rgba(255, 153, 204, 0.2)',
                  'rgba(204, 102, 255, 0.2)',
                  'rgba(153, 255, 204, 0.2)'
                ],                
                borderWidth: 1,
              },
            ],
          };


  return (
    <div className="">
      <div className="content dash-content p-4" style={{ width: '' }}>
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
          <div className="col-md-6" style={{ height: '50%'}}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Bookings by City</h5>
                <Pie data={data} />
              </div>
            </div>
        </div>
        </div>
        <CreateHotel 
        edit={false}
        currHotel={{}}
        show={showHotelCreate} setShow={setShowHotelCreate} handleClose={() => setShowHotelCreate(false)} />  
      </div>
    </div>
  );
};

export default AdminDash;
