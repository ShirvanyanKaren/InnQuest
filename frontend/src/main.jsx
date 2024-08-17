import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Success from "./pages/Success";
import Login from "./pages/Login"; 
import Reservations from "./pages/Reservations";
import AdminDash from "./pages/AdminDash";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage/>,
    children : [
      {
        indexes: true, 
        path: '/',
        element: <Home />
      },
      {
        path: '/search',
        element: <Hotels />
      },
      {
        path: '/rooms/:hotel',
        element: <Rooms />
      }, 
      {
        path: '/success',
        element: <Success />
      },
      {
        path: '/login',
        element: <Login />
      }, 
      {
        path: '/signup',
        element: <Login />
      },
      {
        path: '/reservations',
        element: <Reservations />
      },
      {
        path:'/admin/login',
        element: <Login />
      },
      {
        path: '/admin',
        element: <AdminDash />

      }
    ]
  }
]
)




ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
