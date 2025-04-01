import Cookies from 'js-cookie';

export default function useCookie() {
  const setCookie = (name, value) => {
    Cookies.set(name, value, {
      expires: 3,
      path: '/',
      domain: `.${import.meta.env.VITE_DOMAIN}`,
    });
  };

  const getCookie = (attribute) => {
    let response = Cookies.get(attribute, {
      domain: `.${import.meta.env.VITE_DOMAIN}`,
    });
    return response;
  };

  const removeCookie = (attribute) => {
    Cookies.remove(attribute, {
      path: '/',
      domain: `.${import.meta.env.VITE_DOMAIN}`,
    });
  };
  return {
    setCookie,
    getCookie,
    removeCookie,
  };
}
