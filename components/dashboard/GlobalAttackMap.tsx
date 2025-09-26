
import React from 'react';
import { Attack, AlertSeverity } from '../../types';

interface GlobalAttackMapProps {
  attacks: Attack[];
}

const severityColors: Record<AlertSeverity, string> = {
  [AlertSeverity.Low]: 'rgba(52, 211, 153, 0.7)', // green
  [AlertSeverity.Medium]: 'rgba(251, 191, 36, 0.7)', // amber
  [AlertSeverity.High]: 'rgba(239, 68, 68, 0.7)', // red
  [AlertSeverity.Critical]: 'rgba(217, 70, 239, 0.8)', // fuchsia
};

const severityGlow: Record<AlertSeverity, string> = {
  [AlertSeverity.Low]: 'drop-shadow(0 0 3px rgb(52 211 153 / 0.8))',
  [AlertSeverity.Medium]: 'drop-shadow(0 0 4px rgb(251 191 36 / 0.8))',
  [AlertSeverity.High]: 'drop-shadow(0 0 5px rgb(239 68 68 / 0.8))',
  [AlertSeverity.Critical]: 'drop-shadow(0 0 6px rgb(217 70 239 / 0.9))',
};

// Simplified Mercator projection
const project = (lat: number, lng: number, width: number, height: number) => {
  const x = (lng + 180) * (width / 360);
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = height / 2 - width * mercN / (2 * Math.PI);
  return { x, y };
};

export const GlobalAttackMap: React.FC<GlobalAttackMapProps> = ({ attacks }) => {
  const width = 800;
  const height = 400;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4 px-2">Global Attack Origins</h3>
      <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-md overflow-hidden relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Simple world map path - placeholder */}
            <path d="M400,200 L401,201" fill="#242F46" /> 
            <image href="https://raw.githubusercontent.com/d3/d3-geo/main/test/data/world-110m.json.svg" 
                x="0" y="0" height="400" width="800" 
                className="opacity-20"
                style={{
                  // This is a dummy URL and won't render, we'll style the background
                }}
            />
        </svg>

        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/88/World_map_miller_projection_blank.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.15 }}></div>

        <div className="absolute inset-0">
          {attacks.map(attack => {
            const { x, y } = project(attack.lat, attack.lng, width, height);
            const size = attack.severity === AlertSeverity.Critical ? 12 : attack.severity === AlertSeverity.High ? 10 : 8;
            return (
              <div
                key={attack.id}
                className="absolute rounded-full animate-ping"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: severityColors[attack.severity],
                  transform: 'translate(-50%, -50%)',
                  animationDuration: '2s'
                }}
              ></div>
            );
          })}
          {attacks.map(attack => {
            const { x, y } = project(attack.lat, attack.lng, width, height);
             const size = attack.severity === AlertSeverity.Critical ? 10 : attack.severity === AlertSeverity.High ? 8 : 6;
            return (
              <div
                key={attack.id}
                className="absolute rounded-full"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: severityColors[attack.severity],
                  transform: 'translate(-50%, -50%)',
                  filter: severityGlow[attack.severity]
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
