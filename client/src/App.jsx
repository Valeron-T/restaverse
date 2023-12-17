import './App.css'
import Sidebar, { SidebarItem } from './components/Navbar'
import { FaChartPie, FaHome } from "react-icons/fa";
import { IoMdChatbubbles, IoMdHelp } from "react-icons/io";
import { RiSettings3Fill } from "react-icons/ri";
import { Link, Route, Routes } from "react-router-dom";
import Reviews from './pages/Reviews';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { getLocations } from './services/API';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  const [sidebarActiveItem, setsidebarActiveItem] = useState(1)
  const [loggedIn, setloggedIn] = useState(localStorage.getItem("JWT"))

  useEffect(() => {
    switch (window.location.pathname) {
      case "/":
        setsidebarActiveItem(1)
        break;
      case "/reviews":
        setsidebarActiveItem(2)
        break;
      case "/analytics":
        setsidebarActiveItem(3)
        break;
      case "/settings":
        setsidebarActiveItem(4)
        break;
      case "/help":
        setsidebarActiveItem(5)
        break;
    }

  }, [window.location.pathname])

  // Update loggedIn variable if locally stored JWT changes
  useEffect(() => {
    setloggedIn(localStorage.getItem("JWT"))
  }, [localStorage.getItem("JWT")])

  return (
    <>
      <div className='flex flex-col sm:flex-row'>

        {/* Navbar */}
        <Sidebar>
          <Link to={"/"} onClick={() => setsidebarActiveItem(1)}>
            <SidebarItem icon={<FaHome />} text={"Home"} active={sidebarActiveItem == 1 ? true : false} />
          </Link>
          <Link to={"/reviews"} onClick={() => setsidebarActiveItem(2)}>
            <SidebarItem icon={<IoMdChatbubbles />} text={"Reviews"} active={sidebarActiveItem == 2 ? true : false} />
          </Link>
          <Link to={"/analytics"} onClick={() => setsidebarActiveItem(3)}>
            <SidebarItem icon={<FaChartPie />} text={"Analytics"} active={sidebarActiveItem == 3 ? true : false} />
          </Link>
          <Link to={"/settings"} onClick={() => setsidebarActiveItem(4)}>
            <SidebarItem icon={<RiSettings3Fill />} text={"Settings"} />
          </Link>
          <Link to={"/help"} onClick={() => setsidebarActiveItem(5)}>
            <SidebarItem icon={<IoMdHelp />} text={"Help"} />
          </Link>
        </Sidebar>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home isLoggedin={loggedIn} />} />
          <Route path="/reviews" element={<Reviews isLoggedin={loggedIn} />} />
          <Route path="/analytics" element={<Analytics isLoggedin={loggedIn} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>

      </div>


    </>
  )
}

export default App
