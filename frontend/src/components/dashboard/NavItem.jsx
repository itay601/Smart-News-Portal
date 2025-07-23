// NavItem.jsx
import React from 'react';

const NavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <li onClick={onClick} className={`cursor-pointer p-2 rounded ${isActive ? 'bg-gray-200' : ''}`}>
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    </li>
  );
};

export default NavItem;