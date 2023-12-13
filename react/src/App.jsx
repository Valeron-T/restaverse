import './App.css'
import Sidebar, { SidebarItem } from './components/Navbar'
import { FaChartPie, FaHome } from "react-icons/fa";
import { IoMdChatbubbles, IoMdHelp } from "react-icons/io";
import { RiSettings3Fill } from "react-icons/ri";
import { Link, Route, Routes } from "react-router-dom";
import Reviews from './pages/reviews';
import Home from './pages/Home';
import Account from './pages/Account';
import { useState } from 'react';

function App() {
  const [sidebarActiveItem, setsidebarActiveItem] = useState(1)

  return (
    <>
      <div className='flex flex-col sm:flex-row'>
        {/* Navbar */}
        <Sidebar>
          <Link to={"/"} onClick={() => setsidebarActiveItem(1)}>
            <SidebarItem icon={<FaHome />} text={"Home"} active={sidebarActiveItem==1?true:false}/>
          </Link>
          <Link to={"/reviews"} onClick={() => setsidebarActiveItem(2)}>
            <SidebarItem icon={<IoMdChatbubbles />} text={"Reviews"} active={sidebarActiveItem==2?true:false}/>
          </Link>
          <Link to={"/analytics"} onClick={() => setsidebarActiveItem(3)}>
            <SidebarItem icon={<FaChartPie />} text={"Analytics"} active={sidebarActiveItem==3?true:false}/>
          </Link>
          <SidebarItem icon={<RiSettings3Fill />} text={"Settings"} />
          <SidebarItem icon={<IoMdHelp />} text={"Help"} />
        </Sidebar>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/analytics" element={<Account />} />
        </Routes>
      </div>


    </>
  )
}

export default App
