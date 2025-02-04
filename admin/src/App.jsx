import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route} from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import User from './pages/User/User'
import Reservation from './pages/Reservation/Reservation'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'
import UpdatePopup from './components/UpdatePopup/UpdatePopup'



const App = () => {

  const url = 'http://localhost:5000'
  const [showUpdate, setShowUpdate] = useState(false)

  return (
    <div>
      {showUpdate?<UpdatePopup setShowUpdate={setShowUpdate}/>:<></>}
       <ToastContainer />
       <Navbar />
       <hr />
       <div className="app-content">
          <Sidebar setShowUpdate ={setShowUpdate}/>
          <Routes>
              <Route path="/add" element={<Add url={url}/>} />
              <Route path="/list" element={<List url={url}/>} />
              <Route path="/user" element={<User url={url}/>} />
              <Route path="/Reservation" element={<Reservation url={url}/>} />
          </Routes>
       </div>
    </div>
  )
}


export default App
