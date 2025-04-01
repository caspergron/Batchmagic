import React from 'react';
import './Navbar.css';
import batchMagic from '../../assets/Logo/BatchMagic.svg';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useCookie from '../../hooks/useCookie';
import Swal from 'sweetalert2';

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate();
  const { removeCookie } = useCookie();
  const handleLogout = () => {
    const controller = new AbortController();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success px-4 py-2',
        cancelButton: 'btn btn-danger mx-3 px-4 py-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You want to log out..!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const res = axiosPrivate.get('/logout', {
            signal: controller.signal,
          });
          if (res) {
            removeCookie('_bm');
            // localStorage.clear();
            controller.abort();
            window.location.reload();
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelled', '', 'error');
        }
      });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg  nav-color sticky-top">
        <div className="container">
          <div>
            <img src={batchMagic} alt="batchMagic" />
            {/* <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}
          </div>

          <div
            className="collapse navbar-collapse d-flex justify-content-between"
            id="navbarSupportedContent"
          >
            <div></div>
            <div>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                <li className="nav-item text-white">
                  <Link
                    to="/dashboard"
                    className="nav-link active text-white"
                    aria-current="page"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link text-white" href="#">
                    Support
                  </a>
                </li>
                {/* <li className="nav-item mx-2">
                                    <a className="nav-link text-white" href="#">Hi,{userInfo?.first_name}</a>
                                </li> */}
                <li className="nav-item dropdown bordar-custom-dashboard mx-2">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Account
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Profile
                      </a>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
