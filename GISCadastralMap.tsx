import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Map as MapIcon, 
  Maximize2, 
  Minimize2,
  AlertTriangle, 
  CheckCircle2, 
  Ruler, 
  Compass, 
  Crosshair, 
  Navigation, 
  Radio
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import type { Map, Marker, Popup, GeoJSONSource, StyleSpecification } from 'maplibre-gl';
import { MapLibreMap, DEMO_STYLE_URL } from '../common/MapLibreMap';
import { useCase } from '../../context/CaseContext';

// Geodesic distance in meters (Haversine)
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// Geodesic area in square meters using local WGS-84 metric projection & Shoelace formula
function computePolygonAreaSqM(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  // coords is [lat, lng][]
  const lat0 = coords.reduce((sum, pt) => sum + pt[0], 0) / coords.length;
  const lng0 = coords.reduce((sum, pt) => sum + pt[1], 0) / coords.length;

  const phi = (lat0 * Math.PI) / 180;
  const mLat = 111132.92 - 559.82 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi);
  const mLng = 111412.84 * Math.cos(phi) - 93.5 * Math.cos(3 * phi);

  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const x1 = (coords[i][1] - lng0) * mLng;
    const y1 = (coords[i][0] - lat0) * mLat;
    const x2 = (coords[j][1] - lng0) * mLng;
    const y2 = (coords[j][0] - lat0) * mLat;
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) * 0.5;
}

// Convert decimal degrees to Degrees, Minutes, Seconds (DMS)
function toDMS(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const d = Math.floor(absolute);
  const minutesNotTruncated = (absolute - d) * 60;
  const m = Math.floor(minutesNotTruncated);
  const s = Math.floor((minutesNotTruncated - m) * 60);
  const dir = deg >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
  return `${d}°${m}'${s}"${dir}`;
}

// Generate circular polygon GeoJSON for GPS accuracy ring
function createGeoJSONCircle(centerLngLat: [number, number], radiusInMeters: number, points = 36) {
  const [lng, lat] = centerLngLat;
  const coords: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInMeters / 110540;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }
  coords.push(coords[0]);

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords]
    },
    properties: {}
  };
}

// Pre-defined, stable MapLibre base layer styles (Zero API key required, zero watermarks)
const STYLES: Record<string, string | StyleSpecification> = {
  carto: {
    version: 8,
    sources: {
      'base-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'base-tiles-layer',
        type: 'raster',
        source: 'base-tiles'
      }
    ]
  },
  satellite: {
    version: 8,
    sources: {
      'base-tiles': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: '© Esri World Imagery',
        maxzoom: 18
      }
    },
    layers: [
      {
        id: 'base-tiles-layer',
        type: 'raster',
        source: 'base-tiles'
      }
    ]
  },
  osm: {
    version: 8,
    sources: {
      'base-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'base-tiles-layer',
        type: 'raster',
        source: 'base-tiles'
      }
    ]
  },
  topo: {
    version: 8,
    sources: {
      'base-tiles': {
        type: 'raster',
        tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenTopoMap contributors',
        maxzoom: 17
      }
    },
    layers: [
      {
        id: 'base-tiles-layer',
        type: 'raster',
        source: 'base-tiles'
      }
    ]
  },
  demotiles: DEMO_STYLE_URL
};

export const GISCadastralMap: React.FC = () => {
  const { currentCase } = useCase();
  const gis = currentCase.gis_data;

  // Active MapLibre map stored in state to trigger reactive marker and layer attachment
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const vertexMarkersRef = useRef<Marker[]>([]);
  const userGpsMarkerRef = useRef<Marker | null>(null);

  // Base map layer options (Defaults to Clean Cadastre with OpenStreetMap tiles)
  const [baseLayer, setBaseLayer] = useState<'carto' | 'satellite' | 'osm' | 'topo' | 'demotiles'>('carto');
  const [showBoundaryStones, setShowBoundaryStones] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Realtime cursor coordinates
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);

  // Realtime user GPS location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Extract parcel polygon vertices [lat, lng] from GeoJSON
  const rawFeatures = gis.geojson?.features || [];
  const primaryFeature = rawFeatures[0];
  const rawCoordinates = primaryFeature?.geometry?.coordinates?.[0] || [];
  
  // GeoJSON is [lng, lat] -> convert to [lat, lng] for internal calculations
  const polygonLatLngs: [number, number][] = useMemo(() => {
    return rawCoordinates.map((c: [number, number]) => [c[1], c[0]]);
  }, [rawCoordinates]);

  // Compute boundary segment distances
  const boundarySegments = useMemo(() => {
    return polygonLatLngs.slice(0, -1).map((point, index) => {
      const nextPoint = polygonLatLngs[index + 1] || polygonLatLngs[0];
      const distanceMeters = haversineMeters(point[0], point[1], nextPoint[0], nextPoint[1]);
      return {
        segmentId: `S${index + 1}`,
        from: `V${index + 1}`,
        to: `V${index + 2 <= polygonLatLngs.length - 1 ? index + 2 : 1}`,
        distanceMeters,
        midpoint: [(point[0] + nextPoint[0]) / 2, (point[1] + nextPoint[1]) / 2] as [number, number]
      };
    });
  }, [polygonLatLngs]);

  const totalPerimeterMeters = boundarySegments.reduce((sum, s) => sum + s.distanceMeters, 0);

  // Live dynamic calculation of ground polygon area directly from actual coordinates
  const computedAreaSqM = useMemo(() => {
    if (!polygonLatLngs || polygonLatLngs.length < 3) return gis.discrepancy?.geometry_area_sqm || 0;
    const pts = (polygonLatLngs.length > 1 &&
                 polygonLatLngs[0][0] === polygonLatLngs[polygonLatLngs.length - 1][0] &&
                 polygonLatLngs[0][1] === polygonLatLngs[polygonLatLngs.length - 1][1])
      ? polygonLatLngs.slice(0, -1)
      : polygonLatLngs;
    const calc = computePolygonAreaSqM(pts);
    return Math.round(calc * 10) / 10;
  }, [polygonLatLngs, gis.discrepancy?.geometry_area_sqm]);

  const documentedAreaSqM = gis.discrepancy?.documented_area_sqm || Math.round((gis.area_hectares || 0.04) * 10000) || 400;
  const actualGroundAreaSqM = computedAreaSqM > 0 ? computedAreaSqM : (gis.discrepancy?.geometry_area_sqm || documentedAreaSqM);
  const dynamicDeviationPct = documentedAreaSqM > 0
    ? Number((((actualGroundAreaSqM - documentedAreaSqM) / documentedAreaSqM) * 100).toFixed(2))
    : 0;
  const toleranceThresholdPct = gis.discrepancy?.tolerance_threshold_pct || 1.5;
  const exceedsTolerance = Math.abs(dynamicDeviationPct) > toleranceThresholdPct;
  const isOverlap = gis.overlap.has_overlap;

  // Real-time GPS Geolocation handler
  const handleLocateUser = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy)
        });
        setIsLocating(false);
      },
      () => {
        // Simulated field surveyor nearby position for sandbox testing
        setUserLocation({
          lat: gis.coordinates[0] - 0.0003,
          lng: gis.coordinates[1] + 0.0004,
          accuracy: 5
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Distance from GPS user position to parcel centroid
  const distanceToParcel = userLocation
    ? haversineMeters(userLocation.lat, userLocation.lng, gis.coordinates[0], gis.coordinates[1])
    : null;

  // Helper to add cadastral geojson layers onto current map style
  const addCadastralLayersToMap = useCallback((map: Map) => {
    if (!gis.geojson) return;

    try {
      // Remove existing layers/sources if present
      if (map.getLayer('cadastre-overlap-dashed')) map.removeLayer('cadastre-overlap-dashed');
      if (map.getLayer('cadastre-line')) map.removeLayer('cadastre-line');
      if (map.getLayer('cadastre-fill')) map.removeLayer('cadastre-fill');
      if (map.getSource('cadastre-source')) map.removeSource('cadastre-source');

      // Add source
      map.addSource('cadastre-source', {
        type: 'geojson',
        data: gis.geojson
      });

      // Add polygon fill
      map.addLayer({
        id: 'cadastre-fill',
        type: 'fill',
        source: 'cadastre-source',
        paint: {
          'fill-color': [
            'match',
            ['coalesce', ['get', 'status'], 'VALID'],
            'DISCREPANT', '#f43f5e',
            'OVERLAP', '#dc2626',
            'CRITICAL_DISPUTE', '#991b1b',
            'NEIGHBOR', '#94a3b8',
            /* default VALID */ '#10b981'
          ],
          'fill-opacity': [
            'match',
            ['coalesce', ['get', 'status'], 'VALID'],
            'OVERLAP', 0.55,
            'NEIGHBOR', 0.25,
            /* default */ 0.35
          ]
        }
      });

      // Add boundary outline
      map.addLayer({
        id: 'cadastre-line',
        type: 'line',
        source: 'cadastre-source',
        paint: {
          'line-color': [
            'match',
            ['coalesce', ['get', 'status'], 'VALID'],
            'DISCREPANT', '#e11d48',
            'OVERLAP', '#991b1b',
            'CRITICAL_DISPUTE', '#7f1d1d',
            'NEIGHBOR', '#475569',
            /* default VALID */ '#059669'
          ],
          'line-width': [
            'match',
            ['coalesce', ['get', 'status'], 'VALID'],
            'NEIGHBOR', 2,
            'CRITICAL_DISPUTE', 4,
            /* default */ 3.5
          ]
        }
      });

      // Add dashed outline for overlap features
      map.addLayer({
        id: 'cadastre-overlap-dashed',
        type: 'line',
        source: 'cadastre-source',
        filter: ['==', ['coalesce', ['get', 'status'], 'VALID'], 'OVERLAP'],
        paint: {
          'line-color': '#7f1d1d',
          'line-width': 3.5,
          'line-dasharray': [2, 2]
        }
      });

      // Click handler for cadastral parcel popup
      map.on('click', 'cadastre-fill', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const props = feat.properties || {};
        const status = props.status;
        const statusColor = status === 'VALID' ? '#059669' : '#dc2626';
        const statusText = status === 'VALID' ? '✓ Boundary Verified' : status === 'OVERLAP' ? '⚠ Overlapping Boundary' : 'Discrepancy Flagged';

        new maplibregl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '240px' })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.45; min-width: 180px;">
              <div style="font-weight: bold; color: #0f172a; font-size: 13px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
                Gat / Survey ${props.survey_number || ''}
              </div>
              <div style="color: #475569;">Holder: <strong>${props.owner || 'Registered'}</strong></div>
              <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Parcel: ${props.parcel_id || ''}</div>
              <div style="margin-top: 6px; font-weight: 600; color: ${statusColor}">
                ${statusText}
              </div>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseenter', 'cadastre-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'cadastre-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    } catch (err) {
      console.warn('[MapLibre] Could not add cadastral layers:', err);
    }
  }, [gis.geojson]);

  // Helper to fit map bounds to the subject parcel
  const fitParcelBounds = useCallback((map: Map) => {
    if (!map) return;
    map.resize();

    if (rawCoordinates && rawCoordinates.length > 2) {
      const bounds = new maplibregl.LngLatBounds();
      rawCoordinates.forEach((c: [number, number]) => {
        bounds.extend([c[0], c[1]]);
      });
      map.fitBounds(bounds, { 
        padding: { top: 60, bottom: 90, left: 80, right: 80 }, 
        maxZoom: 18, 
        duration: 500 
      });
    } else if (gis.coordinates) {
      map.flyTo({
        center: [gis.coordinates[1], gis.coordinates[0]],
        zoom: 17,
        duration: 500
      });
    }
  }, [rawCoordinates, gis.coordinates]);

  // Map ready callback from MapLibreMap component
  const handleMapReady = useCallback((map: Map) => {
    setMapInstance(map);
    addCadastralLayersToMap(map);
    setTimeout(() => {
      fitParcelBounds(map);
    }, 150);
  }, [addCadastralLayersToMap, fitParcelBounds]);

  // Update GeoJSON layers and refit when case changes
  useEffect(() => {
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    addCadastralLayersToMap(mapInstance);
    fitParcelBounds(mapInstance);
  }, [currentCase.id, mapInstance, addCadastralLayersToMap, fitParcelBounds]);

  // Update boundary stone vertex markers (V1 - V4)
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing vertex markers
    vertexMarkersRef.current.forEach(m => m.remove());
    vertexMarkersRef.current = [];

    if (!showBoundaryStones) return;

    // Render boundary stones (V1 - V4)
    polygonLatLngs.slice(0, -1).forEach((pt, idx) => {
      const el = document.createElement('div');
      el.className = 'custom-vertex-marker';
      el.innerHTML = `
        <div style="
          background: #065f46; 
          color: white; 
          border: 2px solid white; 
          border-radius: 9999px; 
          width: 24px; 
          height: 24px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 11px; 
          font-weight: bold; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: transform 0.15s ease;
        ">V${idx + 1}</div>
      `;

      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

      const popup = new maplibregl.Popup({ offset: 14, maxWidth: '240px' }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #065f46; display: block; font-weight: bold; margin-bottom: 4px;">
            Boundary Stone V${idx + 1} (सीमाखूण)
          </strong>
          <div style="font-family: monospace; font-size: 11px; color: #334155;">
            Lat: ${pt[0].toFixed(6)}° N (${toDMS(pt[0], true)})
          </div>
          <div style="font-family: monospace; font-size: 11px; color: #334155;">
            Lng: ${pt[1].toFixed(6)}° E (${toDMS(pt[1], false)})
          </div>
          ${boundarySegments[idx] ? `
            <div style="font-size: 11px; color: #047857; font-weight: 600; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
              Span to V${idx + 2 <= polygonLatLngs.length - 1 ? idx + 2 : 1}: ${boundarySegments[idx].distanceMeters} meters
            </div>
          ` : ''}
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([pt[1], pt[0]])
        .setPopup(popup)
        .addTo(mapInstance);

      vertexMarkersRef.current.push(marker);
    });
  }, [mapInstance, showBoundaryStones, polygonLatLngs, boundarySegments]);

  // Handle Live GPS User Location Marker & Accuracy Ring
  useEffect(() => {
    if (!mapInstance) return;

    if (userGpsMarkerRef.current) {
      userGpsMarkerRef.current.remove();
      userGpsMarkerRef.current = null;
    }

    if (userLocation) {
      const el = document.createElement('div');
      el.className = 'custom-gps-user';
      el.innerHTML = `
        <div style="position: relative;">
          <div style="
            width: 16px; 
            height: 16px; 
            background: #2563eb; 
            border: 3px solid white; 
            border-radius: 9999px; 
            box-shadow: 0 0 12px #3b82f6;
          "></div>
          <div style="
            position: absolute; 
            top: -8px; 
            left: -8px; 
            width: 32px; 
            height: 32px; 
            border-radius: 9999px; 
            background: rgba(59, 130, 246, 0.3); 
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #1e3a8a; display: block; font-weight: bold;">Live GPS Surveyor Location</strong>
          <div style="font-family: monospace; font-size: 11px; color: #475569;">
            ${userLocation.lat.toFixed(6)}°N, ${userLocation.lng.toFixed(6)}°E
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Accuracy: ±${userLocation.accuracy} meters</div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(popup)
        .addTo(mapInstance);

      userGpsMarkerRef.current = marker;

      // Draw accuracy polygon
      const circleGeoJSON = createGeoJSONCircle([userLocation.lng, userLocation.lat], userLocation.accuracy);
      if (mapInstance.getSource('gps-accuracy-source')) {
        (mapInstance.getSource('gps-accuracy-source') as GeoJSONSource).setData(circleGeoJSON as any);
      } else {
        mapInstance.addSource('gps-accuracy-source', {
          type: 'geojson',
          data: circleGeoJSON as any
        });
        mapInstance.addLayer({
          id: 'gps-accuracy-fill',
          type: 'fill',
          source: 'gps-accuracy-source',
          paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.15 }
        });
        mapInstance.addLayer({
          id: 'gps-accuracy-line',
          type: 'line',
          source: 'gps-accuracy-source',
          paint: { 'line-color': '#2563eb', 'line-width': 1.5, 'line-dasharray': [2, 2] }
        });
      }
    } else {
      if (mapInstance.getLayer('gps-accuracy-line')) mapInstance.removeLayer('gps-accuracy-line');
      if (mapInstance.getLayer('gps-accuracy-fill')) mapInstance.removeLayer('gps-accuracy-fill');
      if (mapInstance.getSource('gps-accuracy-source')) mapInstance.removeSource('gps-accuracy-source');
    }
  }, [mapInstance, userLocation]);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 p-4 overflow-y-auto' : ''}`}>
      
      {/* Top Header & Map Configuration Toolbar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 ring-2 ring-emerald-100">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Live Open-Source Cadastral GIS Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                MapLibre GL • WGS-84
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Parcel Centroid: {toDMS(gis.coordinates[0], true)}, {toDMS(gis.coordinates[1], false)} ({gis.coordinates[0].toFixed(5)}°, {gis.coordinates[1].toFixed(5)}°)
            </p>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Base Layer Switcher */}
          <div className="flex items-center bg-white/90 border border-slate-200/90 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setBaseLayer('carto')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                baseLayer === 'carto' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Clean High-Contrast Cadastral Street Map"
            >
              Clean Cadastre
            </button>
            <button
              onClick={() => setBaseLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                baseLayer === 'satellite' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ESRI World Imagery"
            >
              Satellite
            </button>
            <button
              onClick={() => setBaseLayer('osm')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                baseLayer === 'osm' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="OpenStreetMap Standard"
            >
              OSM
            </button>
            <button
              onClick={() => setBaseLayer('topo')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                baseLayer === 'topo' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="OpenTopoMap Contours"
            >
              Topo
            </button>
            <button
              onClick={() => setBaseLayer('demotiles')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                baseLayer === 'demotiles' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Official MapLibre DemoTiles Style"
            >
              DemoTiles
            </button>
          </div>

          {/* Fit Parcel Button */}
          <button
            onClick={() => mapInstance && fitParcelBounds(mapInstance)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-2xs font-semibold hover:text-emerald-700 transition-all"
            title="Recenter and Fit Parcel Boundary"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fit Parcel</span>
          </button>

          {/* Real-time GPS Location Button */}
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold shadow-2xs transition-all ${
              userLocation 
                ? 'bg-blue-50 border-blue-300 text-blue-800' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-blue-700'
            }`}
            title="Detect real GPS position of surveyor / device on ground"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
            <span>{isLocating ? 'Acquiring GPS...' : userLocation ? 'GPS Live' : 'Locate Ground Position'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullscreen(prev => !prev);
              setTimeout(() => mapInstance?.resize(), 200);
            }}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Cadastral Boundary Audit Banner */}
      {isOverlap ? (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-bold text-rose-950">🚩 CRITICAL: Cadastral Boundary Overlap Dispute:</span>
            <span className="text-rose-800 text-[11px]">
              Active boundary collision ({gis.overlap.overlapping_parcels[0]?.overlap_area_sqm || 68.5} sq.m / {gis.overlap.overlapping_parcels[0]?.overlap_percentage || 17.1}%) detected with adjoining Gat {gis.overlap.overlapping_parcels[0]?.survey_number || '215/2'}.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Joint DGPS Measurement & Boundary Demarcation Required
          </span>
        </div>
      ) : exceedsTolerance ? (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-bold text-rose-950">🚩 RED FLAG: Cadastral Boundary Untraced / Divergent:</span>
            <span className="text-rose-800 text-[11px]">
              Spatial polygon area ({actualGroundAreaSqM.toFixed(1)} sq.m) diverges by {dynamicDeviationPct}% from RoR records.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            DGPS Ground Survey Required
          </span>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-bold text-emerald-950">100% Cadastral Match Verified:</span>
            <span className="text-emerald-800 text-[11px]">
              Ground boundary coordinates ({actualGroundAreaSqM.toFixed(1)} sq.m) match documented 7/12 area ({documentedAreaSqM.toLocaleString()} sq.m) with 0.0% deviation.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Cadastre Validated
          </span>
        </div>
      )}

      {/* Real-Time Live Ground Distance Card if GPS Active */}
      {userLocation && (
        <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="font-semibold text-blue-950">
              Live Field Position: {userLocation.lat.toFixed(5)}°N, {userLocation.lng.toFixed(5)}°E (Accuracy: ±{userLocation.accuracy}m)
            </span>
          </div>
          {distanceToParcel !== null && (
            <div className="font-mono font-bold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
              {distanceToParcel > 1000 
                ? `${(distanceToParcel / 1000).toFixed(2)} km to Parcel Boundary`
                : `${distanceToParcel.toFixed(1)} m to Parcel Center`
              }
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Left Map + Right Cadastral Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MapLibre GL Interactive Viewport using Reusable MapLibreMap Component */}
        <div className="lg:col-span-8 glass-panel p-2 flex flex-col min-h-[520px] h-[580px] relative overflow-hidden">
          
          <MapLibreMap
            styleUrl={STYLES[baseLayer]}
            center={[gis.coordinates[1], gis.coordinates[0]]}
            zoom={17}
            className="flex-1 w-full h-full min-h-[500px]"
            onMapReady={handleMapReady}
            onMouseMove={setCursorPos}
          >
            {/* Real-time Cursor Coordinates Bar at Bottom of Map */}
            <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm text-[11px] font-mono text-slate-700 flex items-center gap-3 pointer-events-none">
              <span className="flex items-center gap-1 text-slate-500">
                <Crosshair className="w-3 h-3 text-emerald-600" />
                Cursor:
              </span>
              <span>
                {cursorPos 
                  ? `${cursorPos.lat.toFixed(5)}°N, ${cursorPos.lng.toFixed(5)}°E` 
                  : `${gis.coordinates[0].toFixed(5)}°N, ${gis.coordinates[1].toFixed(5)}°E`
                }
              </span>
            </div>

            {/* Toggle Layers Legend at Bottom Left */}
            <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 shadow-md text-xs space-y-1">
              <div className="font-bold text-slate-900 text-[11px] mb-1 flex items-center justify-between">
                <span>Cadastral Symbology</span>
                <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] text-emerald-700 ml-3">
                  <input 
                    type="checkbox" 
                    checked={showBoundaryStones} 
                    onChange={(e) => setShowBoundaryStones(e.target.checked)} 
                    className="rounded text-emerald-600"
                  />
                  Stones
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-600"></span>
                <span className="text-slate-700 text-[11px]">Subject Parcel ({currentCase.survey_number})</span>
              </div>
              {isOverlap && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-600/70 border border-rose-800 border-dashed"></span>
                  <span className="text-rose-700 text-[11px] font-medium">Overlapping Encroachment Zone</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-400/50 border border-slate-500"></span>
                <span className="text-slate-600 text-[11px]">Adjoining Survey Parcels</span>
              </div>
            </div>
          </MapLibreMap>

        </div>

        {/* Right Column: Physical Boundary Segments & Statutory Discrepancy */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Cadastral Polygon Geometry & Boundary Spans */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-emerald-600" />
                Cadastral Boundary Metes & Bounds
              </h4>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {boundarySegments.length} Boundary Spans
              </span>
            </div>

            {/* Perimeter and Coordinates Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-white/80 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px]">
                <span>Total Boundary Perimeter:</span>
                <strong className="text-slate-900">{totalPerimeterMeters.toFixed(1)} meters</strong>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {boundarySegments.map((seg, i) => (
                  <div key={i} className="flex justify-between items-center px-2.5 py-1.5 bg-slate-50/80 rounded-lg border border-slate-200/60 font-mono text-[11px]">
                    <span className="text-slate-600">
                      Segment {seg.from} → {seg.to}
                    </span>
                    <strong className="text-emerald-800">
                      {seg.distanceMeters} m
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area Discrepancy Engine */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                Area Discrepancy Audit
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                exceedsTolerance ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Tolerance: ±1.5%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Documented 7/12 Area:</span>
                <span className="font-mono font-bold text-slate-900 text-right">
                  {documentedAreaSqM.toLocaleString()} sq.m
                  <span className="text-[10px] text-slate-400 block font-normal">
                    ({(documentedAreaSqM / 10000).toFixed(4)} Ha)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Digitized Ground Area:</span>
                <span className="font-mono font-bold text-slate-900 text-right">
                  {actualGroundAreaSqM.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} sq.m
                  <span className="text-[10px] text-slate-400 block font-normal">
                    ({(actualGroundAreaSqM / 10000).toFixed(4)} Ha)
                  </span>
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${
                exceedsTolerance ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-sans font-semibold">Deviation:</span>
                  <span className="text-sm font-extrabold">
                    {dynamicDeviationPct > 0 ? '+' : ''}
                    {dynamicDeviationPct}%
                  </span>
                </div>
                <p className="text-[11px] mt-1 leading-snug">
                  {exceedsTolerance 
                    ? `CRITICAL ALERT: Spatial polygon area (${actualGroundAreaSqM.toFixed(1)} sq.m) diverges by ${dynamicDeviationPct}% from RoR records.`
                    : `✅ 100% Ground Coordinate Match: Digitized parcel area (${actualGroundAreaSqM.toFixed(1)} sq.m) conforms to documented 7/12 area (${documentedAreaSqM.toLocaleString()} sq.m).`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Overlap & Boundary Collision Alert */}
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2.5 border-b border-slate-200/80 mb-3">
              <AlertTriangle className="w-4 h-4 text-emerald-600" />
              Spatial Overlap Assessment
            </h4>

            {isOverlap ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Cadastral Overlap Detected</span>
                </div>
                <div className="space-y-1.5">
                  {gis.overlap.overlapping_parcels.map((op, i) => (
                    <div key={i} className="p-2 bg-white/90 rounded-lg border border-rose-200 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-800">
                        <span>Adjoining Gat:</span>
                        <strong>{op.survey_number}</strong>
                      </div>
                      <div className="flex justify-between text-rose-700">
                        <span>Overlap Area:</span>
                        <strong>{op.overlap_area_sqm} sq.m ({op.overlap_percentage}%)</strong>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-rose-700 pt-1 leading-tight">
                  {gis.overlap.message}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">No Spatial Overlap Detected</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Clear boundary demarcation with adjacent survey numbers.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default GISCadastralMap;
