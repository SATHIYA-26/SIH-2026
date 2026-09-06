import React, { useState, useEffect } from 'react';
import { Field, InspectionPoint } from '../../types/field';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { MapPin, AlertTriangle, Bug, CheckCircle, ShieldCheck } from 'lucide-react';

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
  const allPoints = field.inspectionPoints || [];
  const [selectedPoint, setSelectedPoint] = useState<InspectionPoint | null>(
    allPoints.length > 0 ? allPoints[0] : null
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

  // Re-sync selected point whenever field changes
  useEffect(() => {
    if (allPoints.length > 0) {
      setSelectedPoint(allPoints[0]);
    } else {
      setSelectedPoint(null);
    }
  }, [field.id, allPoints.length]);

  const getPointColor = (pt: InspectionPoint) => {
    if (pt.severity === 'high' || pt.type === 'disease') return '#dc2626'; // Red
    if (pt.severity === 'moderate' || pt.type === 'warning') return '#d97706'; // Amber
    if (pt.type === 'pest') return '#e11d48'; // Rose
    return '#16a34a'; // Green
  };

  const getSimpleSummary = (pt: InspectionPoint) => {
    if (pt.severity === 'high' || pt.type === 'disease') {
      return 'Leaf spots or infection found in this area. Spray plant protection medicine to stop spreading.';
    }
    if (pt.severity === 'moderate' || pt.type === 'warning') {
      return 'Some leaf yellowing or minor bugs found here. Keep checking this spot regularly.';
    }
    return 'Crops in this area are healthy and growing normally.';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header without cluttered right-side buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Field Map & Checked Spots
            </h3>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {allPoints.length} Checked Spots
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap any colored dot on the map to see leaf health and insect numbers for that spot.
          </p>
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
              points={allPoints}
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
                  if (allPoints.length > 0) {
                    setSelectedPoint(allPoints[0]);
                  }
                },
              }}
            />

            {/* Field Inspection Hotspot Points */}
            {allPoints.map((pt) => {
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
                      {pt.diseaseName && (
                        <div className="text-rose-700 font-semibold">{pt.diseaseName}</div>
                      )}
                      {pt.pestCount !== undefined && (
                        <div className="text-slate-700">Insects: {pt.pestCount} bugs per leaf</div>
                      )}
                      <div className="text-[10px] text-slate-400">Checked: {pt.lastChecked}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Simple Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-md text-xs space-y-1.5 pointer-events-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              MAP GUIDE
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-1 ring-rose-200" />
              <span className="text-slate-700 font-medium">Problem / Disease Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-amber-200" />
              <span className="text-slate-700 font-medium">Needs Attention</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-1 ring-emerald-200" />
              <span className="text-slate-700 font-medium">Healthy Crop Spot</span>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Details Sidebar */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          {selectedPoint ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  SELECTED SPOT DETAILS
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
                  {selectedPoint.severity === 'high'
                    ? 'High Attention'
                    : selectedPoint.severity === 'moderate'
                    ? 'Medium Attention'
                    : 'Healthy'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedPoint.label}</h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Checked area in {field.name}
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                {selectedPoint.diseaseName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Disease / Issue:</span>
                    <span className="font-bold text-rose-700">{selectedPoint.diseaseName}</span>
                  </div>
                )}
                {selectedPoint.pestCount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Insects Count:</span>
                    <span className="font-bold text-slate-800">{selectedPoint.pestCount} bugs per leaf</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Checked:</span>
                  <span className="font-medium text-slate-700">{selectedPoint.lastChecked}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded border border-slate-200">
                {getSimpleSummary(selectedPoint)}
              </p>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-700">No Checked Spots Found</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Perform a field check to add inspection spots on the map.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Checked spots: {allPoints.length}</span>
            <span className="font-medium text-emerald-700">Field area: {field.areaAcres} acres</span>
          </div>
        </div>
      </div>
    </div>
  );
};
