
import React, { useEffect, useRef } from 'react';

interface StatusLoggerProps {
  logs: string[];
}

export const StatusLogger: React.FC<StatusLoggerProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={containerRef}
      className="bg-black/60 border border-white/5 rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs space-y-2 scroll-smooth"
    >
      {logs.length === 0 && (
        <div className="text-gray-600 animate-pulse italic">
          Aguardando resposta do satélite...
        </div>
      )}
      {logs.map((log, index) => (
        <div 
          key={index} 
          className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
        >
          <span className="text-blue-500/50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
          <span className="text-gray-300">{log}</span>
          {index === logs.length - 1 && (
            <span className="w-1.5 h-3 bg-white animate-pulse inline-block"></span>
          )}
        </div>
      ))}
    </div>
  );
};
