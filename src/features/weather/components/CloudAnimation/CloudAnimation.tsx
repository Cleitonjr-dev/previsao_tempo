import { useState, type CSSProperties } from 'react';
import cloudImage from './cloud.png';
import darkCloudImage from './darkCloud.png';
import './CloudAnimation.css';

const CLOUD_COUNT = 80;

const SIZES = [
  { width: 70, height: 40 },
  { width: 100, height: 70 },
  { width: 120, height: 80 },
  { width: 80, height: 50 },
  { width: 110, height: 75 },
  { width: 130, height: 90 },
  { width: 140, height: 100 },
  { width: 150, height: 110 },
];

function createCloudStyles(): CSSProperties[] {
  return Array.from({ length: CLOUD_COUNT }, (_, index) => {
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];

    return {
      backgroundImage: `url(${index % 3 === 0 ? darkCloudImage : cloudImage})`,
      width: `${size?.width}px`,
      height: `${size?.height}px`,
      top: `${Math.floor(Math.random() * 60)}%`,
      left: `${Math.floor(Math.random() * 200) * -1}%`,
      animationDelay: `${Math.random() * 15}s`,
      minWidth: '100px',
    };
  });
}

function CloudAnimation() {
  // Sorteado uma única vez: novas renderizações não reposicionam as nuvens.
  const [clouds] = useState(createCloudStyles);

  return (
    <div className="cloud-container" aria-hidden="true">
      {clouds.map((style, index) => (
        <div key={index} className="cloud" style={style}></div>
      ))}
    </div>
  );
}

export default CloudAnimation;
