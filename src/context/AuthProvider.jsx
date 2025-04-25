import { createContext, useEffect, useState } from 'react';
import useCookie from '../hooks/useCookie';
import PropTypes from 'prop-types';
import { set } from 'react-hook-form';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const { getCookie } = useCookie();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  //handle refresh
  useEffect(() => {
    const _bm = getCookie('_bm');
    if (_bm) {
      setAuth(_bm);
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    if (userInfo?.userRole?.assigned_permissions) {
      const userPermissions = userInfo.userRole.assigned_permissions.map(p => p.name);
      setPermissions(userPermissions);
    }
  }, [userInfo]);

  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName);
  };

  useEffect(() => {
    if (!auth) {
      setUserInfo(null);
      return;
    }
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_KEY}profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth}`,
            'Content-Type': 'application/json',
            'withCredentials': false
          }
        });
        const data = await response.json();
        if (data?.data) {
          setLoading(false);
        }
        setUserInfo(data?.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (auth && userInfo === null) {
      fetchUserInfo();
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{ auth, userInfo, setAuth, setLoading, setUserInfo, loading, permissions, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};
export default AuthContext;
