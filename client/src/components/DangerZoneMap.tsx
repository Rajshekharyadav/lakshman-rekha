import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface DangerZone {
  id: string;
  state: string;
  location: { lat: number; lng: number };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  totalCrimes: number;
}

// Sample danger zones - will be replaced with real data
const sampleZones: DangerZone[] = [
  { id: '1', state: 'Delhi', location: { lat: 28.7041, lng: 77.1025 }, riskLevel: 'high', totalCrimes: 1500 },
  { id: '2', state: 'Mumbai', location: { lat: 19.0760, lng: 72.8777 }, riskLevel: 'critical', totalCrimes: 2000 },
  { id: '3', state: 'Bangalore', location: { lat: 12.9716, lng: 77.5946 }, riskLevel: 'medium', totalCrimes: 800 },
  { id: '4', state: 'Kolkata', location: { lat: 22.5726, lng: 88.3639 }, riskLevel: 'high', totalCrimes: 1200 },
];

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'critical': return '#ef4444'; // red
    case 'high': return '#f97316'; // orange
    case 'medium': return '#eab308'; // yellow
    case 'low': return '#22c55e'; // green
    default: return '#6b7280'; // gray
  }
};

export function DangerZoneMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        // Default to India center if permission denied
        setUserLocation({ lat: 20.5937, lng: 78.9629 });
      }
    );
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !userLocation) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [userLocation.lat, userLocation.lng], 
        5
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add user location marker with pulsing effect
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
      iconSize: [16, 16],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup('Your Location');

    // Add danger zones
    sampleZones.forEach((zone) => {
      if (!mapRef.current) return;

      // Add circle for danger zone
      L.circle([zone.location.lat, zone.location.lng], {
        color: getRiskColor(zone.riskLevel),
        fillColor: getRiskColor(zone.riskLevel),
        fillOpacity: 0.3,
        radius: zone.riskLevel === 'critical' ? 50000 : zone.riskLevel === 'high' ? 30000 : 20000,
      }).addTo(mapRef.current)
        .bindPopup(`
          <div class="p-2">
            <p class="font-semibold">${zone.state}</p>
            <p class="text-sm text-muted-foreground">Risk: ${zone.riskLevel}</p>
            <p class="text-xs">Crimes: ${zone.totalCrimes}</p>
          </div>
        `);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Danger Zone Map</h3>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-safe text-safe">
            <div className="w-2 h-2 rounded-full bg-safe mr-1" />
            Low Risk
          </Badge>
          <Badge variant="outline" className="border-warning text-warning">
            <div className="w-2 h-2 rounded-full bg-warning mr-1" />
            Medium
          </Badge>
          <Badge variant="outline" className="border-emergency text-emergency">
            <div className="w-2 h-2 rounded-full bg-emergency mr-1" />
            High Risk
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="h-96 w-full"
          data-testid="map-danger-zones"
        />
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>Red zones indicate high-crime areas. Stay alert and enable location tracking for real-time alerts.</span>
      </div>
    </div>
  );
}
