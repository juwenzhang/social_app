"use client";
import React, { 
  useRef, 
  useLayoutEffect, 
  useState, 
  useEffect 
} from 'react';
import useColor from '@/utils/setColor';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  isHovered: boolean;
  targetRadius: number;
}

const gradients = [
  'bg-gradient-to-br from-green-300 via-pink-300 to-yellow-300',
  'bg-gradient-to-tl from-yellow-500 via-orange-500 to-red-500',
  'bg-gradient-to-tr from-orange-600 via-yellow-600 to-brown-600',
  'bg-gradient-to-bl from-blue-300 via-sky-300 to-white'
];

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const color = useColor('light'); 
  const starsRef = useRef<Star[]>([]); 
  const numStars = 500;
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradientIndex(
        (prevIndex) => (prevIndex + 1) 
        % gradients.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const drawStars = (ctx: CanvasRenderingContext2D, stars: Star[]) => {
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = color.getRandomRGBAColor(); 
      ctx.fill();
    });
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    updateCanvasSize();

    for (let i = 0; i < numStars; i++) {
      const baseRadius = Math.random() * 4 + 1;
      const star: Star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: baseRadius,
        opacity: Math.random(),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        isHovered: false,
        targetRadius: baseRadius
      };
      starsRef.current.push(star);
    }

    workerRef.current = new Worker(
      new URL('../../webworkers/background.worker.ts', import.meta.url)
    );

    let lastFrameTime = 0;
    const frameInterval = 16; // 约 60 FPS
    let animationFrameId: number;

    const animate = (time: number) => {
      if (time - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time;

      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'update',
          stars: starsRef.current,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        });
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStars(ctx, starsRef.current);

      animationFrameId = requestAnimationFrame(animate);
    };

    if (workerRef.current) {
      workerRef.current.onmessage = (event) => {
        starsRef.current = event.data;
      };
    }

    animate(0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'mouseMove',
          stars: starsRef.current,
          mouseX,
          mouseY
        });
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'mouseClick',
          stars: starsRef.current,
          mouseX,
          mouseY
        });
      }
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    let animationFrameId2:number;
    const handleResize = () => {
      animationFrameId2 = requestAnimationFrame(() => {
        updateCanvasSize();
      })
    };
    const execHandleResize = () => {
      requestIdleCallback(() => {
        handleResize();
      })
    }
    window.addEventListener('resize', execHandleResize);

    return () => {
      window.removeEventListener('resize', execHandleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(animationFrameId2);
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      starsRef.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} 
      style={{ 
        position: 'fixed', 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1,
      }}
      className={`${gradients[currentGradientIndex]} 
        transition-colors duration-3000`}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto', 
          zIndex: -1, 
        }}
      />
    </div>
  );
};

Background.displayName = 'Background';
export default React.memo(Background);