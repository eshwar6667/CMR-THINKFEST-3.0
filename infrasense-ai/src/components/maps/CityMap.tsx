import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue } from '../../types';

interface CityMapProps {
  issues: Issue[];
  selectedIssue?: Issue | null;
  onSelectIssue?: (issue: Issue) => void;
  mapType?: 'satellite' | 'road' | 'dark';
}

export const CityMap: React.FC<CityMapProps> = ({
  issues,
  selectedIssue,
  onSelectIssue,
  mapType = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [40.7306, -73.9352], // Center around NYC
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Layers & Tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = '';
    let attribution = '';

    if (mapType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (mapType === 'road') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{y}/{x}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      // Dark Mode (Grafana-like)
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{y}/{x}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }

    L.tileLayer(tileUrl, { attribution, maxZoom: 20 }).addTo(map);
  }, [mapType]);

  // Sync Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    // Clear old markers
    layer.clearLayers();

    issues.forEach((issue) => {
      const { latitude, longitude, address } = issue.location;
      if (!latitude || !longitude) return;

      // Color based on severity
      const severityColor = 
        issue.severity === 'Critical' ? '#ef4444' : 
        issue.severity === 'High' ? '#f59e0b' : 
        issue.severity === 'Medium' ? '#3b82f6' : '#10b981';

      // Create glowing HTML dot marker
      const customIcon = L.divIcon({
        className: 'custom-gps-marker',
        html: `
          <div style="
            position: relative;
            width: 14px;
            height: 14px;
            background-color: ${severityColor};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px ${severityColor};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              position: absolute;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: ${severityColor};
              opacity: 0.3;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          </div>
          <style>
            @keyframes ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon });

      // Hover popup details
      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
          <strong style="color: ${severityColor}">${issue.category} (${issue.severity})</strong><br/>
          <span>${address}</span><br/>
          <span style="color: #64748b; font-size: 9px;">ID: ${issue.id} | Status: ${issue.status}</span>
        </div>
      `, {
        direction: 'top',
        className: 'dark:bg-slate-900 border-none rounded-lg p-2 shadow-lg dark:text-white',
      });

      if (onSelectIssue) {
        marker.on('click', () => {
          onSelectIssue(issue);
        });
      }

      marker.addTo(layer);
    });
  }, [issues, onSelectIssue]);

  // Center on Selected Issue
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIssue) return;

    const { latitude, longitude } = selectedIssue.location;
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15, { animate: true, duration: 1 });
    }
  }, [selectedIssue]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-darkbg-border shadow-soft bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      
      {/* Map Layers Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[10] bg-white/90 dark:bg-darkbg-card/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-darkbg-border shadow-md flex items-center gap-4 text-[10px] font-semibold text-slate-550 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-critical" /> Critical</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> High</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-500" /> Medium</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Low</span>
      </div>
    </div>
  );
};
export default CityMap;
