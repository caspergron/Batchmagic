import { createContext, useEffect, useState } from 'react';
import useCookie from '../hooks/useCookie';
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const { getCookie } = useCookie();
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  //handle refresh
  useEffect(() => {
    const _bm = getCookie('_bm');
    if (_bm) {
      setAuth(_bm);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, userInfo, setAuth, setLoading, setUserInfo, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};
export default AuthContext;
