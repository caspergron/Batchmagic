import axios from '../../../api/axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';

export default function ResetPassword() {
  const { id } = useParams();
  const [token, setToken] = useState();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  // split after &
  const tokenId = id.split('&');

  useEffect(() => {
    const checkExist = () => {
      setLoading(true);
      axios
        .get(`/check-token/${tokenId[0]}?id=${tokenId[1]}`, {
          headers: {
            'Content-Type': 'application/json',
            Accpet: 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success === true) {
            setToken(res.data.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    };

    checkExist();
  }, []);

  useEffect(() => {
    if (password === confirmPassword && password.length >= 8) {
      setDisable(false);
      setErr('');
    } else {
      setDisable(true);
      if (password.length < 8) {
        setErr('Password should be at least 8 characters long');
      } else {
        setErr('Password Not Matched');
      }
    }
  }, [password, confirmPassword]);

  const handleResetPassowrd = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      axios
        .post(
          '/reset-password',
          {
            password,
            token: tokenId[0],
            id: parseInt(tokenId[1]),
          },
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
            Swal.fire({
              title: 'Success',
              text: 'Your Password has been Successfully Changed',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Okay',
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/', { replace: true });
              }
            });
          }
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Okay',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/', { replace: true });
            }
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {' '}
          {token ? (
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="card m-5">
                    <div className="card-header">
                      <h3>Reset Password</h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleResetPassowrd}>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                          />
                        </div>
                        <div className="form-group my-2">
                          <label htmlFor="confirmPassword">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                          />
                        </div>
                        <p className="text-danger p-2">{err}</p>
                        <button
                          type="submit"
                          disabled={disable}
                          className="btn btn-primary float-end"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container ">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="card m-5">
                    <div className="card-header">
                      <h3 className="text-danger"> Unauthorized </h3>
                    </div>
                    <div className="card-body">
                      <p>Token Expired</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
