import { useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import heroImage from './assets/images/hero-image.png';

function App() {
  const navigate = useNavigate();

  return (
      <div className='App'>
          <Header subHeading={"Bring your pet's moments to life through unique AI art."} />
          <div style={{ marginTop: '30px' }}>
              <button onClick={() => navigate('/start')}>GET STARTED</button>
          </div>
          <div className='hero-image-container'>
              <img className='hero-image' src={heroImage} alt='hero-image' />
          </div>
      </div>
  );
}

export default App;
