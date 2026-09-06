import React, { useState, useEffect } from 'react';
import { Field, InspectionPoint } from '../../types/field';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Layers, Filter, Eye, AlertTriangle, Bug, CheckCircle, ShieldAlert, MapPin } from 'lucide-react';

interface FieldOverviewMapProps {
  field: Field;
}

// Helper component to smoothly re-center leaflet map when active field changes
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, 16, { animate: true });
    }
  }, [center[0], center[1], map]);
  return null;
};

// Helper component to handle canvas clicks
const MapClickDetector: React.FC<{
  points: InspectionPoint[];
  onSelect: (pt: InspectionPoint) => void;
}> = ({ points, onSelect }) => {
  useMapEvents({
    click: (e) => {
      if (points.length === 0) return;
      // Find closest point to click
      let closestPt = points[0];
      let minDistance = Infinity;
      points.forEach((pt) => {
        const d = Math.pow(pt.lat - e.latlng.lat, 2) + Math.pow(pt.lng - e.latlng.lng, 2);
        if (d < minDistance) {
          minDistance = d;
          closestPt = pt;
        }
      });
      if (closestPt) {
        onSelect(closestPt);
      }
    },
  });
  return null;
};

export const FieldOverviewMap: React.FC<FieldOverviewMapProps> = ({ field }) => {
  const [activeLayer, setActiveLayer] = useState<'All' | 'Disease' | 'Pest' | 'Risk'>('All');
  const [timeFilter, setTimeFilter] = useState<'Today' | '7 Days' | '30 Days'>('Today');
  const [selectedPoint, setSelectedPoint] = useState<InspectionPoint | null>(
    field.inspectionPoints?.[0] || null
  );

  const center = (field.polygon?.center && field.polygon.center.length === 2
    ? field.polygon.center
    : [13.1143, 80.1548]) as [number, number];

  const polygonBounds = (field.polygon?.bounds && field.polygon.bounds.length > 0
    ? field.polygon.bounds
    : [
        [13.1170, 80.1520],
        [13.1180, 80.1580],
        [13.1110, 80.1590],
        [13.1105, 80.1525],
      ]) as [number, number][];

  const allPoints = field.inspectionPoints || [];

  // Filter inspection points based on layer & time
  const filteredPoints = allPoints.filter((pt) => {
    if (activeLayer === 'Disease') return pt.type === 'disease' || pt.type === 'warning' || !!pt.diseaseName;
    if (activeLayer === 'Pest') return pt.type === 'pest' || (pt.pestCount !== undefined && pt.pestCount > 3);
    if (activeLayer === 'Risk') return pt.severity === 'high' || pt.severity === 'moderate';
    return true; // 'All'
  });

  // Re-sync selected point whenever field or layer filter changes
  useEffect(() => {
    if (filteredPoints.length > 0) {
      // Keep selected if still in filtered set, else pick first filtered
      if (!selectedPoint || !filteredPoints.some((p) => p.id === selectedPoint.id)) {
        setSelectedPoint(filteredPoints[0]);
      }
    } else if (allPoints.length > 0) {
      setSelectedPoint(allPoints[0]);
    } else {
      setSelectedPoint(null);
    }
  }, [field.id, activeLayer, filteredPoints.length]);

  const getPointColor = (pt: InspectionPoint) => {
    if (pt.severity === 'high' || pt.type === 'disease') return '#dc2626'; // Red
    if (pt.severity === 'moderate' || pt.type === 'warning') return '#d97706'; // Amber
    if (pt.type === 'pest') return '#e11d48'; // Rose
    return '#16a34a'; // Green
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              FIELD OVERVIEW MAP
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Spatial Hotspots
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic distribution of leaf observations, pest counts, and risk zones for {field.name}
          </p>
        </div>

        {/* Controls: Layer Switcher & Time Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Controls */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['All', 'Disease', 'Pest', 'Risk'] as const).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeLayer === layer
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['Today', '7 Days', '30 Days'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeFilter(tf)}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  timeFilter === tf
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas & Point Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 h-72 sm:h-96 rounded-lg overflow-hidden border border-slate-200 relative">
          <MapContainer
            center={center}
            zoom={16}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <MapRecenter center={center} />
            <MapClickDetector
              points={filteredPoints.length > 0 ? filteredPoints : allPoints}
              onSelect={(pt) => setSelectedPoint(pt)}
            />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Field Boundary Polygon */}
            <Polygon
              positions={polygonBounds}
              pathOptions={{
                color: '#166534',
                fillColor: '#22c55e',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '4, 4',
              }}
              eventHandlers={{
                click: () => {
                  if (filteredPoints.length > 0) {
                    setSelectedPoint(filteredPoints[0]);
                  }
                },
              }}
            />

            {/* Field Inspection Hotspot Points */}
            {(filteredPoints.length > 0 ? filteredPoints : allPoints).map((pt) => {
              const isSelected = selectedPoint?.id === pt.id;
              return (
                <CircleMarker
                  key={pt.id}
                  center={[pt.lat, pt.lng]}
                  radius={isSelected ? 11 : pt.severity === 'high' ? 9 : 7}
                  pathOptions={{
                    color: isSelected ? '#0f172a' : '#ffffff',
                    fillColor: getPointColor(pt),
                    fillOpacity: isSelected ? 1.0 : 0.85,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedPoint(pt),
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs space-y-1">
                      <div className="font-bold text-slate-900">{pt.label}</div>
                      <div className="text-slate-600">
                        Type: <span className="capitalize font-semibold">{pt.type}</span>
                      </div>
                      {pt.diseaseName && (
                        <div className="text-rose-700 font-semibold">{pt.diseaseName}</div>
                      )}
                      {pt.pestCount !== undefined && (
                        <div className="text-slate-700">Pest count: {pt.pestCount} insects/leaf</div>
                      )}
                      <div className="text-[10px] text-slate-400">Checked: {pt.lastChecked}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-md text-xs space-y-1.5 pointer-events-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              MAP LEGEND
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-1 ring-rose-200" />
              <span className="text-slate-700 font-medium">Disease Hotspot (High Risk)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-amber-200" />
              <span className="text-slate-700 font-medium">Suspected Lesions / Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-1 ring-emerald-200" />
              <span className="text-slate-700 font-medium">Healthy Scouting Point</span>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Details Sidebar */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          {selectedPoint ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  SCOUTING POINT DETAIL
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedPoint.severity === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedPoint.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedPoint.severity} Priority
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedPoint.label}</h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  GPS: {selectedPoint.lat.toFixed(4)}°N, {selectedPoint.lng.toFixed(4)}°E
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                {selectedPoint.diseaseName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Disease Signal:</span>
                    <span className="font-bold text-rose-700">{selectedPoint.diseaseName}</span>
                  </div>
                )}
                {selectedPoint.pestCount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pest Count:</span>
                    <span className="font-bold text-slate-800">{selectedPoint.pestCount} insects / leaf</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Observation Filter:</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {timeFilter} ({activeLayer} Layer)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Observation:</span>
                  <span className="font-medium text-slate-700">{selectedPoint.lastChecked}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPoint.type === 'disease' || selectedPoint.severity === 'high'
                  ? 'Hotspot shows early angular lesions with bacterial oozing risk under high humidity. Immediate spot inspection recommended.'
                  : selectedPoint.type === 'warning'
                  ? 'Mild discoloration observed. Closely monitor row aeration and keep aphid traps active.'
                  : 'Monitored area remains healthy and within acceptable threshold limits.'}
              </p>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              Click any point on the map to view scouting notes.
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Points in view: {filteredPoints.length || allPoints.length}</span>
            <span className="font-medium text-emerald-700">Total area: {field.areaAcres} acres</span>
          </div>
        </div>
      </div>
    </div>
  );
};
