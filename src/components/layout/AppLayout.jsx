import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import QuickActions from '../dashboard/QuickActions';
export const AppLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (<div className="shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
      
      <main className="main w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)}/>
        {children}
      </main>

      <QuickActions />
    </div>);
};
export default AppLayout;
