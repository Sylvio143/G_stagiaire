import React, { useState } from "react";
import AdminSidebar from '../components/AdminSidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from "lucide-react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Hamburger menu visible sur mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/50 md:hidden"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Contenu principal */}
      <main
        className={`
          flex-1 overflow-y-auto transition-all duration-300
          p-4 pt-16
          md:pt-6
          ${collapsed ? "md:ml-16" : "md:ml-64"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}