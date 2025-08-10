import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { ImExit } from "react-icons/im";
import {
  FcDoughnutChart, FcPlus, FcInfo, FcViewDetails,
  FcGraduationCap, FcBriefcase, FcPortraitMode
} from "react-icons/fc";

const Sidebar = ({ isCollapsed, setIsCollapsed, handleLogout, role }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Menu config based on role
  const menuItems = role === 'admin'
    ? [
        { path: '/admin', label: 'Overview', icon: <FcDoughnutChart size={30}/> },
        { path: '/admin/add-company', label: 'Add Company', icon: <FcPlus size={30}/> },
        { path: '/admin/companies-info', label: 'Companies Info', icon: <FcInfo size={30}/> },
        { path: '/admin/students-profile', label: 'Students Profile', icon: <FcViewDetails size={30}/> },
      ]
    : role === 'company'
    ? [
        { path: '/company/applicants', label: 'View Applicants', icon: <FcViewDetails size={30}/> },
        { path: '/company/profile', label: 'View Profile', icon: <FcInfo size={30}/> },
      ]
    : [
        { path: '/student/eligible-companies', label: 'Eligible Companies', icon: <FcBriefcase size={30}/> },
        { path: '/student/applied-companies', label: 'Applied Companies', icon: <FcGraduationCap size={30}/> },
        { path: '/student/profile', label: 'Profile', icon: <FcPortraitMode size={30}/> },
      ];

  return (
    <aside
      className={`fixed left-0 top-[5.5rem] h-[calc(100vh-5rem)] 
      overflow-y-auto overflow-x-hidden bg-gray-800 shadow-lg z-30 flex flex-col justify-between
      transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-center px-3 py-2 border-b">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-blue-600 text-white p-1 shadow-md hover:bg-blue-700"
        >
          {isCollapsed ? <FiMenu size={30} /> : <TbLayoutSidebarLeftCollapse size={30} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 mb-20">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-200
                  ${isCollapsed ? 'flex items-center justify-center' : ''}
                  ${isActive(item.path)
                    ? 'bg-blue-600 !text-white shadow-md'
                    : '!text-white hover:!text-blue-500'}
                `}
              >
                {isCollapsed ? React.cloneElement(item.icon, { className: 'text-inherit' }) : item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="px-2 mt-auto mb-24" style={{ paddingBottom: '1rem' }}>
        <button
          onClick={handleLogout}
          className={`w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium ${isCollapsed ? 'flex items-center justify-center' : ''}`}
        >
          {isCollapsed ? <ImExit size={30}/> : 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
