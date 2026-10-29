import './RainAnimation.css';

function RainAnimation() {
  return (
    <div className="rain-container" aria-hidden="true">
      <div className="rain"></div>
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} className={`rain delay-${index + 1}`}></div>
      ))}
    </div>
  );
}

export default RainAnimation;
