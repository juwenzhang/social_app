"use client";
import React, { 
  useRef, 
  useState, 
  useEffect, 
  useCallback, 
  useLayoutEffect 
} from 'react';
import { debounce } from 'lodash';
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
  { class: 'bg-gradient-to-br from-green-300 via-pink-300 to-yellow-300', name: '自然渐变' },
  { class: 'bg-gradient-to-tl from-yellow-500 via-orange-500 to-red-500', name: '火焰渐变' },
  { class: 'bg-gradient-to-tr from-orange-600 via-yellow-600 to-brown-600', name: '黄昏渐变' },
  { class: 'bg-gradient-to-bl from-blue-300 via-sky-300 to-white', name: '天空渐变' },
];

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [isAnimated, setIsAnimated] = useState(false); 
  const isMounted = useRef(false);
  const animationFrameRef = useRef<number>(null);
  const mousePos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const starArray = useRef<Star[]>([]);

  // 生成星星
  const generateStars = useCallback((count: number) => {
    const container = containerRef.current;
    if (!container) return [];
    const { clientWidth, clientHeight } = container;
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * clientWidth,
      y: Math.random() * clientHeight,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      isHovered: false,
      targetRadius: Math.random() * 2 + 1,
    }));
  }, []);

  // 初始化Canvas
  const initCanvas = useCallback(() => {
    if (!isMounted.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const container = containerRef.current;
    if (!container) return null;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;
    return canvas.getContext('2d');
  }, []);

  // 绘制星星
  const drawStars = useCallback(() => {
    if (!isMounted.current) return;
    const ctx = initCanvas();
    if (!ctx || !starArray.current.length) return;
    
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    
    starArray.current.forEach(star => {
      star.radius = star.isHovered 
        ? Math.max(star.radius - 0.1, star.targetRadius)
        : Math.min(star.radius + 0.1, star.targetRadius);
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${useColor().getRandomRGBColor()}`;
      ctx.fill();
      
      star.x += star.speedX;
      star.y += star.speedY;
      
      const { width, height } = canvasRef.current!;
      if (star.x < 0 || star.x > width) star.speedX *= -1;
      if (star.y < 0 || star.y > height) star.speedY *= -1;
    });
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    if (!isAnimated || !isMounted.current) return;
    drawStars();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isAnimated, drawStars]); // 依赖isAnimated状态

  // 窗口Resize处理
  const handleResize = useCallback(debounce(() => {
    if (!isMounted.current) return;
    const newStars = generateStars(starArray.current.length);
    starArray.current = newStars;
  }, 1000), [generateStars]);

  // 鼠标移动交互
  const handleMouseMove = useCallback(debounce((e: MouseEvent) => {
    if (!isMounted.current) return;
    const container = containerRef.current;
    if (!container) return;
    
    const { clientX, clientY } = e;
    const rect = container.getBoundingClientRect();
    mousePos.current = { x: clientX - rect.left, y: clientY - rect.top };
    
    if (starArray.current.length > 0) {
      starArray.current.forEach(star => {
        const dx = star.x - mousePos.current.x;
        const dy = star.y - mousePos.current.y;
        star.isHovered = Math.sqrt(dx * dx + dy * dy) < 50;
        star.targetRadius = star.isHovered ? star.radius * 1.5 : star.radius;
      });
    }
  }, 500), []);

  // 组件挂载初始化
  useLayoutEffect(() => {
    isMounted.current = true;
    starArray.current = generateStars(200);
    setIsAnimated(true); 
    animate();
    
    window.addEventListener('resize', handleResize);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [generateStars, animate, handleResize, handleMouseMove]);

  // 渐变色切换
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradientIndex(prev => (prev + 1) % gradients.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 初始化stars状态
  useEffect(() => {
    if (isMounted.current && starArray.current.length > 0) {
      setStars(starArray.current);
    }
  }, [isMounted.current, starArray.current]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1 
      }}
      className={
        `${gradients[currentGradientIndex].class} 
        transition-colors duration-3000`
      }
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
          zIndex: -1 
        }} 
      />
    </div>
  );
};

export default React.memo(Background);