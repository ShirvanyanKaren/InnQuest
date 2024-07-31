import { Outlet } from 'react-router-dom';
import './App.scss';


function App() {

  return (
    <>
    <div className="App">
      <Outlet />
      <h1>App</h1>
    </div>
    </>
  )
}

export default App
