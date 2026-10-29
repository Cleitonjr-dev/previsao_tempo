/** Posição horizontal (%) de cada floco; o 21º fica no canto e sem atraso, como no visual original. */
const LEFTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 5];
const FLAKES = 21;

function SnowAnimation() {
  return (
    <div
      data-animation="snow"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-[30px] z-1 h-full w-full overflow-hidden"
    >
      {Array.from({ length: FLAKES }, (_, index) => {
        const left = LEFTS[index];

        return (
          <div
            key={index}
            className="absolute bottom-full h-[50px] w-px animate-fall text-[1em] whitespace-nowrap text-white opacity-80 select-none odd:text-[1.2em] odd:opacity-90"
            style={{
              left: left === undefined ? undefined : `${left}%`,
              animationDelay: left === undefined ? undefined : `${(index + 1) / 10}s`,
            }}
          >
            {index % 2 === 0 ? '❅' : '❆'}
          </div>
        );
      })}
    </div>
  );
}

export default SnowAnimation;
