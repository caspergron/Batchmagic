// import { useEffect } from 'react';
// import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

const User = () => {
  // const [user, setUser] = useState();
  // const axiosPrivate = useAxiosPrivate();

  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();
  //   const getUsers = async () => {
  //     try {
  //       // const response = await axiosPrivate.get('/profile', {
  //       //   signal: controller.signal,
  //       // });

  //       if (isMounted) {
  //         // setUser(response.data);
  //       }
  //     } catch (error) {
  //       if (error instanceof DOMException && error.name == 'AbortError') {
  //
  //       } else {
  //
  //       }
  //     }
  //   };
  //   getUsers();
  //   return () => {
  //     isMounted = false;
  //     controller.abort();
  //   };
  // }, []);
  return <div>{}</div>;
};

export default User;
