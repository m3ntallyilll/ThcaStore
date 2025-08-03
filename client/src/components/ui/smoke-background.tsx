import { useEffect, useRef } from 'react';

interface SmokeBackgroundProps {
  className?: string;
}

export function SmokeBackground({ className = '' }: SmokeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('SmokeBackground mounted - Pure CSS version');
  }, []);

  return (
    <>
      {/* Background container */}
      <div 
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)'
        }}
      >
        {/* Primary smoke effect - more visible */}
        <div 
          className="absolute inset-0 w-full h-full opacity-70"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.20) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 20%, rgba(255,255,255,0.12) 0%, transparent 60%),
              radial-gradient(ellipse at 40% 80%, rgba(255,255,255,0.10) 0%, transparent 70%)
            `,
            filter: 'blur(4px)'
          }}
        />
        
        {/* Test element to confirm background is working */}
        <div 
          className="absolute top-4 left-4 text-white text-sm opacity-50 z-50"
          style={{ pointerEvents: 'none' }}
        >
          Smoke Background Active
        </div>
        
        {/* Enhanced Pure CSS Smoke Background */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 10% 20%, rgba(255,255,255,0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 90% 80%, rgba(255,255,255,0.20) 0%, transparent 60%),
              radial-gradient(ellipse at 30% 90%, rgba(255,255,255,0.18) 0%, transparent 45%),
              radial-gradient(ellipse at 70% 10%, rgba(255,255,255,0.22) 0%, transparent 55%)
            `,
            filter: 'blur(6px)',
            mixBlendMode: 'screen'
          }}
        />

        {/* Animated smoke overlays */}
        <div className="smoke-layer-1" />
        <div className="smoke-layer-2" />
        <div className="smoke-layer-3" />
      </div>

      {/* CSS for smoke animations */}
      <style>{`
        .smoke-layer-1, .smoke-layer-2, .smoke-layer-3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .smoke-layer-1 {
          background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.25) 0%, transparent 70%);
          animation: smokeFloat1 25s ease-in-out infinite alternate;
        }

        .smoke-layer-2 {
          background: radial-gradient(circle at 70% 60%, rgba(255,255,255,0.20) 0%, transparent 60%);
          animation: smokeFloat2 30s ease-in-out infinite alternate-reverse;
        }

        .smoke-layer-3 {
          background: radial-gradient(circle at 50% 80%, rgba(255,255,255,0.18) 0%, transparent 80%);
          animation: smokeFloat3 20s ease-in-out infinite alternate;
        }

        @keyframes smokeFloat1 {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(2deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10px) translateX(-15px) rotate(-1deg);
            opacity: 0.2;
          }
        }

        @keyframes smokeFloat2 {
          0% {
            transform: translateY(10px) translateX(-10px) rotate(1deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px) rotate(-2deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(5px) translateX(-20px) rotate(0deg);
            opacity: 0.3;
          }
        }

        @keyframes smokeFloat3 {
          0% {
            transform: translateY(-5px) translateX(5px) rotate(-1deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-25px) translateX(-10px) rotate(1deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0px) translateX(10px) rotate(-0.5deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </>
  );
}