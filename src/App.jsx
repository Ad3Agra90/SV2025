import { useState, useEffect } from 'react';
import logo_zn from '../src/assets/img/logo_verbo.png'
import zn from '../src/assets/img/ZN.png'
import title from '../src/assets/img/title.png'
import desconto_img from '../src/assets/img/desconto.png'
import restaurantesData from '../src/restaurantes.json';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Função para calcular milissegundos até o próximo minuto
    const calculateTimeToNextMinute = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      return (60 - seconds) * 1000 - milliseconds;
    };

    // Atualiza precisamente no início de cada minuto
    const initialDelay = calculateTimeToNextMinute();
    
    const initialTimer = setTimeout(() => {
      setCurrentTime(new Date());

      // Configura intervalo para atualizar a cada minuto exato
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);

      // Limpa o intervalo quando o componente é desmontado
      return () => {
        clearTimeout(initialTimer);
        clearInterval(timer);
      };
    }, initialDelay);

    // Limpa os timers se o componente for desmontado
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // Função para verificar se o restaurante está aberto
  const isRestaurantOpen = (workingHours) => {
    if (!workingHours) return false;

    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const currentDay = days[currentTime.getDay()];
    const formattedTime = currentTime.getHours().toString().padStart(2, '0') + ':' + 
                          currentTime.getMinutes().toString().padStart(2, '0');

    const daySchedule = workingHours[currentDay];
    
    if (!daySchedule) return false;

    return formattedTime >= daySchedule.open && formattedTime <= daySchedule.close;
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