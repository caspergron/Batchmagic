import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { sidebarMenu } from './sidebar-components';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openSubMenu, setOpenSubMenu] = useState('');

  const isActive = (menuItem) => {
    // Check if any submenu item is active
    if (menuItem.submenu) {
      return menuItem.submenu.some((subItem) =>
        currentPath.includes(subItem.link),
      );
    }

    return currentPath.includes(menuItem.link);
  };

  const isActiveSubmenu = (submenuItem) => {
    const data = currentPath.includes(submenuItem.link);
    // If the submenu item is active, set the parent sidebar item as open
    useEffect(() => {
      if (data) {
        setOpenSubMenu(submenuItem.parentLink || '');
      }
    }, [data, setOpenSubMenu, submenuItem.parentLink]);

    if (submenuItem.link === currentPath) {
      return data;
    }
  };

  const toggleSubMenu = (menuItem) => {
    setOpenSubMenu(openSubMenu === menuItem.link ? '' : menuItem.link);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {sidebarMenu.map((menuItem) => (
          <div key={menuItem.link}>
            <div
              className={`sidebar-item px-60 py-20 ${
                isActive(menuItem) ? 'active' : ''
              }`}
              onClick={() => toggleSubMenu(menuItem)}
            >
              <Link to={menuItem.link}>
                <img
                  src={
                    isActive(menuItem) ? menuItem.iconSelected : menuItem.icon
                  }
                  alt=""
                  className="sidebar-icon"
                />
                <span>{menuItem.title}</span>
                {menuItem.submenu && (
                  <div className="toggle-icon">
                    <ExpandMoreIcon />
                  </div>
                )}
              </Link>
            </div>
            {/* Check if submenu exists */}
            {menuItem.submenu && (
              <div
                className={`submenu ${
                  openSubMenu === menuItem.link ? 'open' : ''
                }`}
              >
                {menuItem.submenu.map((subItem) => (
                  <div
                    className={`submenu-item ${
                      isActiveSubmenu(subItem) ? 'sub-active' : ''
                    }`}
                    key={subItem.link}
                  >
                    <Link to={subItem.link}>
                      <img
                        src={
                          isActiveSubmenu(subItem)
                            ? subItem.iconSelected
                            : subItem.icon
                        }
                        alt=""
                        className={`sidebar-icon ${
                          isActiveSubmenu(subItem) ? 'sub-active' : ''
                        }`}
                      />
                      <span
                        className={`${
                          isActiveSubmenu(subItem) ? 'sub-active' : ''
                        }`}
                      >
                        {subItem.title}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
