import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";

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
      }
    ]
  }
]
)




ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
