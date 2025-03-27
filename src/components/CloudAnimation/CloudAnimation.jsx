import './CloudAnimation.css';
import cloudImage from '../../assets/cloud.png';
import darkCloudImage from '../../assets/darkCloud.png';

function CloudAnimation() {
  const cloudCount = 80;
  const clouds = [];

  
  const getRandomSize = () => {
    const sizes = [
      { width: 70, height: 40 },
      { width: 100, height: 70 },
      { width: 120, height: 80 }, 
      { width: 80, height: 50 }, 
      { width: 110, height: 75 },
      { width: 130, height: 90 },
      { width: 140, height: 100 },
      { width: 150, height: 110 },
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  
  const getRandomPosition = () => {
    const top = Math.floor(Math.random() * 60);
    const left = Math.floor(Math.random() * 200) * -1;
    return { top: `${top}%`, left: `${left}%` };
  };

  for (let i = 0; i < cloudCount; i++) {
    const isDarkCloud = i % 3 === 0;
    const cloudSize = getRandomSize();
    const cloudPosition = getRandomPosition();
    const cloudStyle = {
      backgroundImage: `url(${isDarkCloud ? darkCloudImage : cloudImage})`,
      width: `${cloudSize.width}px`,
      height: `${cloudSize.height}px`,
      top: cloudPosition.top,
      left: cloudPosition.left,
      animationDelay: `${Math.random() * 15}s`,
      minWidth: '100px'
    };
    clouds.push(
      <div key={i} className="cloud" style={cloudStyle}></div>
    );
  }

  return <div className="cloud-container">{clouds}</div>;
}

export default CloudAnimation;
