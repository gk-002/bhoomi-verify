import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map, StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Configure MapLibre Web Worker explicitly for Vite bundler
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
if (typeof window !== 'undefined' && (maplibregl as any).setWorkerUrl) {
  (maplibregl as any).setWorkerUrl(workerUrl);
}

export interface MapLibreMapProps {
  styleUrl?: string | StyleSpecification;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  onMapReady?: (map: Map) => void;
  onMouseMove?: (coords: { lat: number; lng: number }) => void;
  children?: React.ReactNode;
}

// Default initial location: Maharashtra, India (74.88°E, 19.07°N)
const DEFAULT_CENTER: [number, number] = [74.88, 19.07];
const DEFAULT_ZOOM = 12;
export const DEMO_STYLE_URL = 'https://demotiles.maplibre.org/style.json';

export const MapLibreMap: React.FC<MapLibreMapProps> = ({
  styleUrl = DEMO_STYLE_URL,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  minZoom = 2,
  maxZoom = 22,
  className = '',
  onMapReady,
  onMouseMove,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const onMapReadyRef = useRef(onMapReady);
  const onMouseMoveRef = useRef(onMouseMove);
  const prevStyleKeyRef = useRef<string>('');

  onMapReadyRef.current = onMapReady;
  onMouseMoveRef.current = onMouseMove;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize MapLibre instance once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setErrorMessage(null);

    const styleKey = typeof styleUrl === 'string' ? styleUrl : JSON.stringify(styleUrl);
    prevStyleKeyRef.current = styleKey;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: styleUrl,
        center: center,
        zoom: zoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        attributionControl: { compact: true }
      });

      // Navigation & Scale Controls
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
        'top-right'
      );
      map.addControl(
        new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }),
        'bottom-left'
      );

      // Once map loads, dismiss loader and trigger ready callback
      map.on('load', () => {
        setIsLoading(false);
        map.resize();
        if (onMapReadyRef.current) {
          onMapReadyRef.current(map);
        }
      });

      // Fallback: dismiss loader if idle or after safety timeout
      map.on('idle', () => {
        setIsLoading(false);
      });

      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
        map.resize();
      }, 1500);

      // Error handler
      map.on('error', (e: any) => {
        const err = e?.error;
        if (err && err.message && (err.message.includes('style') || err.message.includes('WebGL'))) {
          console.error('[MapLibre GL Error]', err);
          setErrorMessage(err.message || 'Failed to load map style.');
          setIsLoading(false);
        }
      });

      // Mouse move listener
      map.on('mousemove', (e: any) => {
        if (onMouseMoveRef.current) {
          onMouseMoveRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        }
      });

      mapRef.current = map;

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        clearTimeout(safetyTimer);
        resizeObserver.disconnect();
        map.remove();
        mapRef.current = null;
      };
    } catch (err: any) {
      console.error('[MapLibre GL Initialization Error]', err);
      setErrorMessage(err?.message || 'WebGL initialization error.');
      setIsLoading(false);
    }
  }, []);

  // Update style only when style actually changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const styleKey = typeof styleUrl === 'string' ? styleUrl : JSON.stringify(styleUrl);
    if (styleKey === prevStyleKeyRef.current) return;
    prevStyleKeyRef.current = styleKey;

    try {
      setIsLoading(true);
      map.setStyle(styleUrl);

      let called = false;
      const onStyleDone = () => {
        if (called) return;
        called = true;
        setIsLoading(false);
        map.resize();
        if (onMapReadyRef.current) {
          onMapReadyRef.current(map);
        }
      };

      map.once('styledata', onStyleDone);
      map.once('idle', onStyleDone);

      const timer = setTimeout(() => {
        onStyleDone();
      }, 300);

      return () => {
        clearTimeout(timer);
        map.off('styledata', onStyleDone);
        map.off('idle', onStyleDone);
      };
    } catch (err) {
      console.error('[MapLibre GL setStyle error]', err);
      setIsLoading(false);
    }
  }, [styleUrl]);

  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-xl bg-slate-100 ${className}`}>
      {/* MapLibre DOM Mount Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[500px] rounded-xl"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-xs transition-opacity duration-200 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/95 rounded-xl shadow-md border border-slate-200 text-xs font-semibold text-slate-700 pointer-events-auto">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Loading MapLibre GL...</span>
          </div>
        </div>
      )}

      {/* Error Fallback Banner */}
      {errorMessage && (
        <div className="absolute top-4 left-4 right-4 z-40 p-3 bg-rose-50/95 border border-rose-300 rounded-xl text-xs text-rose-900 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => {
              setErrorMessage(null);
              setIsLoading(true);
              if (mapRef.current) {
                mapRef.current.setStyle(DEMO_STYLE_URL);
              }
            }}
            className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-rose-300 rounded-lg text-rose-800 font-semibold flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Additional UI Children (controls, overlays, legends) */}
      {children}
    </div>
  );
};

export default MapLibreMap;
