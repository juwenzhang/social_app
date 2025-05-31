"use client";
import React, { useRef, useLayoutEffect } from 'react';
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

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const color = useColor('light'); 
  const starsRef = useRef<Star[]>([]); 
  const numStars = 1000;

  // 更新函数
  const updateStarPositions = (stars: Star[]) => {
    stars.forEach((star) => {
      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x < 0 || star.x > canvasRef.current!.width) {
        star.speedX = -star.speedX;
      }
      if (star.y < 0 || star.y > canvasRef.current!.height) {
        star.speedY = -star.speedY;
      }

      // 过渡效果
      if (star.isHovered && star.radius < star.targetRadius) {
        star.radius += 0.1;
      } else if (!star.isHovered && star.radius > star.targetRadius) {
        star.radius -= 0.1;
      }
    });
  };

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

    let lastFrameTime = 0;
    const frameInterval = 16; // 约 60 FPS
    const animate = (time: number) => {
      if (time - lastFrameTime < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateStarPositions(starsRef.current);
      drawStars(ctx, starsRef.current);

      requestAnimationFrame(animate);
    };
    animate(0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      starsRef.current.forEach((star) => {
        const dx = star.x - mouseX;
        const dy = star.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const newIsHovered = distance < star.targetRadius * 2;
        if (newIsHovered !== star.isHovered) {
          star.isHovered = newIsHovered;
          star.targetRadius = newIsHovered ? star.targetRadius * 2 : star.targetRadius / 2;
        }
      });
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const baseRadius = Math.random() * 4 + 1;
      const newStar: Star = {
        x: mouseX,
        y: mouseY,
        radius: baseRadius,
        opacity: Math.random(),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        isHovered: false,
        targetRadius: baseRadius
      };
      starsRef.current.push(newStar);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
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
      className='bg-gradient-to-r from-blue-500 
        via-purple-500 to-pink-500'
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
export default Background;
