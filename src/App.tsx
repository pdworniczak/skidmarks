import { useEffect, useRef } from 'react';
import { start } from './game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      start(canvas);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">WEBTANKS</header>
      <canvas
        ref={canvasRef}
        id="webtanks"
        width={600}
        height={400}
        style={{ background: 'lightgrey' }}></canvas>
    </div>
  );
}

export default App;
