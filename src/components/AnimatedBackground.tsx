
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particles configuration
    const particlesConfig = {
      count: 50,
      size: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      connectDistance: 150,
      color: 'rgba(255, 255, 255, 0.3)'
    };
    
    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
    }> = [];
    
    for (let i = 0; i < particlesConfig.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (particlesConfig.size.max - particlesConfig.size.min) + particlesConfig.size.min,
        vx: (Math.random() - 0.5) * particlesConfig.speed.max,
        vy: (Math.random() - 0.5) * particlesConfig.speed.max
      });
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles and connect them
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Boundary checking
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particlesConfig.color;
        ctx.fill();
        
        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < particlesConfig.connectDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / particlesConfig.connectDistance) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 ${className || ''}`}
    />
  );
};

export default AnimatedBackground;
