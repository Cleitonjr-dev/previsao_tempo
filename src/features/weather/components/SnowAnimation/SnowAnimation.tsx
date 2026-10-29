import './SnowAnimation.css';

const FLAKES = ['❆', '❅'];

function SnowAnimation() {
  return (
    <div className="snowflakes" aria-hidden="true">
      <div className="snowflake">❅</div>
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} className={`snowflake delay-${index + 1}`}>
          {FLAKES[index % 2]}
        </div>
      ))}
    </div>
  );
}

export default SnowAnimation;
