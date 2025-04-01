import axios from '../api/axios';
import useAuth from './useAuth';
import useCookie from './useCookie';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const { setCookie, removeCookie } = useCookie();

  const refreshToken = async () => {
    try {
      const response = await axios.get(
        '/refresh-token',
        { headers: { Authorization: 'Bearer ' + auth } },
        {
          withCredentials: true,
        },
      );
      setCookie('_bm', response.data.access_token);
      // localStorage.setItem('_bm', response.data.access_token);
      setAuth((prev) => {
        return {
          ...prev,
          _bm: response.data.access_token,
        };
      });
      return response.data.access_token;
    } catch (error) {
      removeCookie('_bm');
      // localStorage.clear();
      window.location.reload();
    }
  };
  return refreshToken;
};

export default useRefreshToken;
