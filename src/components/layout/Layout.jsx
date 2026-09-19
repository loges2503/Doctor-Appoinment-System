import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import './Layout.css';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} onCloseMobile={closeMobileSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
