import { useState, useEffect } from 'react';
import logo_zn from '../src/assets/logo_verbo.png'
import zn from '../src/assets/ZN.png'
import title from '../src/assets/title.png'
import desconto_img from '../src/assets/desconto.png'
import restaurantesData from '../restaurantes.json';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const calculateTimeToNextMinute = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      return (60 - seconds) * 1000 - milliseconds;
    };


    const initialDelay = calculateTimeToNextMinute();
    
    const initialTimer = setTimeout(() => {
      setCurrentTime(new Date());


      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);


      return () => {
        clearTimeout(initialTimer);
        clearInterval(timer);
      };
    }, initialDelay);


    return () => {
      clearTimeout(initialTimer);
    };
  }, []);


  const isRestaurantOpen = (workingHours) => {
    if (!workingHours) return false;

    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const currentDay = days[currentTime.getDay()];
    const formattedTime = currentTime.getHours().toString().padStart(2, '0') + ':' + 
                          currentTime.getMinutes().toString().padStart(2, '0');

    const daySchedule = workingHours[currentDay];
    
    if (!daySchedule) return false;

    if( typeof daySchedule.open == "undefined" ) {
      for(let i=0; i<daySchedule.length; i++){
          if( formattedTime >= daySchedule[i].open && formattedTime <= daySchedule[i].close){
              return true;
          }
      }
      return false;
 } else {
      return formattedTime >= daySchedule.open && formattedTime <= daySchedule.close;
 }
 
  };

  return (
    <main>
      <section className='watermark'>
        <img className="logo_verbo" src={logo_zn} alt="" />
        <img className="logo_zn" src={zn} alt="" />
      </section>
      <img className="title" src={title} alt="" />
      <section className="restaurantes">
        {restaurantesData.restaurantes.map(location => {
          const isOpen = isRestaurantOpen(location.workingHours);
          
          return (
            <div 
              key={location.id} 
              className={`card ${!isOpen ? 'closed-restaurant' : ''}`}
            >
              <div className='card_img'>
                <img src={location.imageUrl} alt={location.name} className="logo_restaurantes" />
                <img className='banner_card' src={location.banner} alt="" />
                <img className='desconto' src={location.desconto === "liberado" ? desconto_img : null} alt="" />
              </div>
              <div className="info_card">
                <h2>{location.name}</h2>
                <p className='descricao'>{location.description}</p>
                <div className="card_details">
                  <span>📍 {location.address}</span>
                  <p>📸 Instagram: 
                    <a href={location.instagram} target="_blank" rel="noopener noreferrer">
                      {location.instaName}
                    </a>
                  </p>
                  <a 
                    href={`tel:${location.number}`}
                    className="phone-link"
                  >
                    📞 {location.number}
                  </a>
                  <div className={`status ${isOpen ? 'open' : 'closed'}`}>
                    {isOpen ? 'Aberto Agora' : 'Fechado'}
                  </div>
                  <button onClick={() => window.open(location.rota, '_blank')} className="rota_button">
                    Traçar Rota
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  )
}