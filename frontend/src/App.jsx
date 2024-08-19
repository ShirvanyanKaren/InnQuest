import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import AdminSidebar from './components/AdminSidebar';
import Auth from './utils/auth';
import './App.scss';


function App() {

  return (
    <>
    <div className="App">
      <Header />
      <div className={`${Auth.loggedIn() && Auth.isSuperUser() ? 'd-flex' : ''}`}>
      <AdminSidebar />
      <Outlet />
      </div>
    </div>
    </>
  )
}

export default App
