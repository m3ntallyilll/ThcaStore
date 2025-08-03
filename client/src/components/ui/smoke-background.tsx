import { useEffect, useRef } from 'react';

interface SmokeBackgroundProps {
  className?: string;
}

export function SmokeBackground({ className = '' }: SmokeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Add custom CSS to remove background and make it blend
    const addCustomStyles = () => {
      try {
        // Wait for iframe to load
        iframe.onload = () => {
          const style = document.createElement('style');
          style.textContent = `
            .smoke-video {
              mix-blend-mode: screen;
              filter: contrast(1.2) brightness(1.1);
              opacity: 0.6;
            }
          `;
          document.head.appendChild(style);
        };
      } catch (error) {
        console.log('Cross-origin restrictions prevent direct styling');
      }
    };

    addCustomStyles();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        mixBlendMode: 'multiply'
      }}
    >
      {/* YouTube Embed with custom styling */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          ref={iframeRef}
          src="https://www.youtube.com/embed/x37iFVV4hBw?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&playlist=x37iFVV4hBw"
          className="smoke-video w-full h-full object-cover scale-150"
          style={{
            border: 'none',
            mixBlendMode: 'screen',
            filter: 'contrast(1.3) brightness(0.8) saturate(0.7)',
            opacity: 0.4,
            transform: 'scale(1.2)',
            transformOrigin: 'center center'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={false}
          title="Smoke Background"
        />
      </div>

      {/* Additional smoke overlay for better blending */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255,255,255,0.06) 0%, transparent 50%)
          `,
          mixBlendMode: 'overlay',
          animation: 'smokeFloat 20s ease-in-out infinite alternate'
        }}
      />

      {/* CSS Animation for floating smoke effect */}
      <style>{`
        @keyframes smokeFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-10px) rotate(-1deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}