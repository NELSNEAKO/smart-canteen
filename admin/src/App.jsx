import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route} from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Reservation from './pages/Reservation/Reservation'



const App = () => {
  return (
    <div>
       <Navbar />
       <hr />
       <div className="app-content">
          <Sidebar />
          <Routes>
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/Reservation" element={<Reservation />} />
          </Routes>
       </div>
    </div>
  )
}


export default App
