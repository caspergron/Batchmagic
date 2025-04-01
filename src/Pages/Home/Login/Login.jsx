import './Login.css';
import key from '../../../assets/Logo/key.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth.jsx';
import useCookie from '../../../hooks/useCookie';
import Swal from 'sweetalert2';
import ErrorModal from '../../../components/ErrorModal';

const LOGIN_URL = 'login';

const Login = () => {
  const { setAuth, setLoading, setUserInfo } = useAuth();
  const { setCookie } = useCookie();
  const userRef = useRef();
  const errRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErr('');
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email: user,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Accpet: 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          },
          withCredentials: true,
        },
      );
      const _bm = res?.data?.access_token;
      const data = res?.data?.user;
      setUserInfo(data);
      setAuth(_bm, user, password, data);
      setCookie('_bm', _bm);
      setUser('');
      setPassword('');
      navigate(from, { replace: true });
      setLoading(false);
    } catch (err) {
      setErr(err.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    try {
      axios
        .post(
          'forget-password',
          JSON.stringify({
            email: email,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              Accpet: 'application/json',
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.data.success === true) {
            Swal.fire('Success', 'Please Check Your Inbox', 'success');
          } else {
            Swal.fire('Error', 'Error occured', 'error');
          }
        });
      setEmail('');
    } catch (err) {
      <ErrorModal />;
    }
  };

  const checkExist = (e) => {
    axios
      .get(`check-email/${e}`, {
        headers: {
          'Content-Type': 'application/json',
          Accpet: 'application/json',
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          setDisable(false);
          errRef.current.innerHTML = '';
        } else {
          setDisable(true);
        }
      })
      .catch(() => {
        errRef.current.innerHTML = 'Email does not exist';
        setDisable(true);
      });
  };

  return (
    <div className="d-flex justify-content-between my-5 me-5 ">
      <h1 className="text-white text-custom">
        An <span className="text-warning">easy-to-use</span> <br /> batch
        tracking <br /> system for your <br /> webshop orders
      </h1>
      <div className="card card-custom p-5">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="card-title text-warning fw-bolder">
              Exisiting user?
            </h5>
            <h5 className="text-purple fw-bolder">Please log in here</h5>
          </div>
          <div>
            <img src={key} alt="" />
          </div>
        </div>

        <div className="my-4">
          <p ref={errRef}>{err}</p>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column mb-3">
              <label htmlFor="Email"> Email</label>
              <input
                id="email"
                type="email"
                className="form-control d-inline"
                ref={userRef}
                placeholder="Email"
                aria-label="Email"
                aria-describedby="addon-wrapping"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
            </div>
            <div className="d-flex flex-column mb-3">
              <label htmlFor="Username"> Password</label>
              <input
                id="password"
                type="password"
                className="form-control d-inline"
                placeholder="Password"
                aria-label="Password"
                aria-describedby="addon-wrapping"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <button className="button-custom mb-3">Tilmeld</button>
          </form>
          <a
            type="button"
            className="forgot-password"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Forgot password
          </a>

          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Forgot Password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleForgotPassword}>
                  <div className="modal-body mx-3 mt-3">
                    <input
                      id="forgot-email"
                      type="email"
                      className="form-control d-inline"
                      placeholder="Enter your email"
                      aria-label="email"
                      aria-describedby="addon-wrapping"
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => checkExist(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                  <p className="text-danger p-3" ref={errRef}>
                    {err}
                  </p>
                  <div className="modal-footer">
                    <button
                      disabled={disable}
                      type="submit"
                      aria-label="Close"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
