/** Posição horizontal (%) de cada gota; a 21ª fica no canto, como no visual original. */
const LEFTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 15, 25, 35, 45, 55, 65, 75, 85, 5, 95, 45];
const DROPS = 21;

function RainAnimation() {
  return (
    <div
      data-animation="rain"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-[30px] z-1 h-full w-full overflow-hidden"
    >
      {Array.from({ length: DROPS }, (_, index) => {
        const left = LEFTS[index];

        return (
          <div
            key={index}
            className="absolute bottom-full h-[50px] w-px animate-rain bg-white opacity-60 odd:h-[70px] odd:w-[2px] odd:opacity-80"
            style={{
              left: left === undefined ? undefined : `${left}%`,
              animationDelay: `${index / 10}s`,
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default RainAnimation;
