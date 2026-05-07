import { useEffect, useRef } from 'react';
import { useGameStore, Buildings } from '../../store/gameStore';

export function MainView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildings = useGameStore(state => state.buildings);
  const season = useGameStore(state => state.season);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const render = () => {
      // Resize to match container
      const parent = canvas.parentElement;
      if (parent && (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight)) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple Isometric Grid simulation
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.4;
      
      const drawIsoBuilding = (xOffset: number, yOffset: number, width: number, height: number, color: string, label: string, level: number) => {
        if (level === 0) return;
        const x = cx + xOffset;
        const y = cy + yOffset;

        ctx.fillStyle = color;
        // Base box
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width/2, y + height/4);
        ctx.lineTo(x, y + height/2);
        ctx.lineTo(x - width/2, y + height/4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`${label} Lv.${level}`, x - 20, y);
      };

      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;

      // Draw buildings based on state
      drawIsoBuilding(-100, 50, 60, 40, '#a67b5b', 'Farm', buildings.farm);
      drawIsoBuilding(100, 80, 80, 50, '#5b4a3f', 'Mine', buildings.quarry);
      drawIsoBuilding(-150, 120, 70, 45, '#3a5a40', 'Lumber', buildings.lumbermill);
      drawIsoBuilding(150, 150, 90, 60, '#cca03b', 'Market', buildings.market);
      drawIsoBuilding(-50, 200, 80, 50, '#d1d5db', 'Temple', buildings.temple);
      drawIsoBuilding(50, 240, 60, 90, '#6d28d9', 'Tower', buildings.wizardTower);
      
      // Castle always center top
      drawIsoBuilding(0, 0, 150, 100, '#808080', 'Castle', buildings.castle);

      animFrame = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animFrame);
  }, [buildings, season]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
    </div>
  );
}
