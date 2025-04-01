import loading from '../assets/Logo/loader.gif';

export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center m-2">
      <img className="loader-size" src={loading} alt="" />
    </div>
  );
}
