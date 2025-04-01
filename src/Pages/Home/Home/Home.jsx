import Banner from '../Banner/Banner';
import InfoCard from '../InfoCard/InfoCard';
import './Home.css';

const Home = () => {
  return (
    <div className="home-backgroud info-card-backgroud">
      <Banner />
      <InfoCard />
    </div>
  );
};

export default Home;
