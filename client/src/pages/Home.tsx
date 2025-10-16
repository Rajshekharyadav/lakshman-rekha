import { HeroSlider } from "@/components/HeroSlider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CloudRain, Sprout, MapPin, Bell, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ThreeBackground } from "@/components/ThreeBackground";

export default function Home() {
  const { user } = useAuth();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as any);
        if (result.state === 'granted') {
          getCurrentLocation();
        }
      });
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setLocationPermission('granted');
        setLocationError(null);
        
        // Simple address approximation based on coordinates
        const getApproximateLocation = (lat: number, lng: number) => {
          if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
            return `India (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          }
          return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        };
        
        setCurrentLocation(prev => prev ? {
          ...prev,
          address: getApproximateLocation(latitude, longitude)
        } : null);
      },
      (error) => {
        setLocationPermission('denied');
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const requestLocation = () => {
    getCurrentLocation();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[1] opacity-20"
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>
      
      {/* Content Overlay */}
      <div className="relative z-10 bg-gradient-to-br from-black/40 via-transparent to-black/40 min-h-screen backdrop-blur-[1px]">
        <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Location Permission Banner */}
      {locationPermission !== 'granted' && (
        <Card className="backdrop-blur-md bg-orange-500/20 border-orange-400/30 hover:bg-orange-500/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-300" />
              <div>
                <CardTitle className="text-base text-white">Enable Location Access</CardTitle>
                <CardDescription className="text-white/80">
                  Location access is required for danger zone alerts and emergency features
                </CardDescription>
                {locationError && (
                  <p className="text-sm text-red-300 mt-1">{locationError}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={requestLocation} 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 text-white font-semibold"
              data-testid="button-enable-location"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {locationPermission === 'denied' ? 'Retry Location Access' : 'Enable Location'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="space-y-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-xl text-white/90 font-medium backdrop-blur-sm bg-white/10 rounded-full px-6 py-3 inline-block border border-white/20">
          Your personalized safety dashboard with AI-powered predictions
        </p>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Women Safety Card */}
        <Link href="/women-safety">
          <Card className="cursor-pointer h-full group relative overflow-hidden backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25" data-testid="card-women-safety">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors font-bold">Women Safety & Empowerment</CardTitle>
              <CardDescription className="text-base text-white/80">
                Access government schemes and real-time danger zone alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Bell className="w-4 h-4" />
                  <span>Live danger zone tracking</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <TrendingUp className="w-4 h-4" />
                  <span>100+ schemes available</span>
                </div>
              </div>
              <Button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white font-semibold" data-testid="button-explore-women-safety">
                Explore Features
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Disaster Management Card */}
        <Link href="/disaster">
          <Card className="cursor-pointer h-full group relative overflow-hidden backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25" data-testid="card-disaster">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <CloudRain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white group-hover:text-orange-300 transition-colors font-bold">Disaster Management</CardTitle>
              <CardDescription className="text-base text-white/80">
                Weather forecasts and disaster risk zone mapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Bell className="w-4 h-4" />
                  <span>Real-time weather alerts</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>Risk zone mapping</span>
                </div>
              </div>
              <Button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 text-white font-semibold" data-testid="button-explore-disaster">
                View Forecast
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Farmers Support Card */}
        <Link href="/farmers">
          <Card className="cursor-pointer h-full group relative overflow-hidden backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25" data-testid="card-farmers">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white group-hover:text-green-300 transition-colors font-bold">Farmers Support</CardTitle>
              <CardDescription className="text-base text-white/80">
                AI crop recommendations and disease detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <TrendingUp className="w-4 h-4" />
                  <span>Crop profitability analysis</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <CloudRain className="w-4 h-4" />
                  <span>Weather-based suggestions</span>
                </div>
              </div>
              <Button className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white font-semibold" data-testid="button-explore-farmers">
                Get Recommendations
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Weather Widget */}
      {currentLocation && (
        <WeatherWidget location={currentLocation} />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Active Alerts</CardDescription>
            <CardTitle className="text-3xl text-white font-bold">3</CardTitle>
          </CardHeader>
        </Card>
        <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Schemes Available</CardDescription>
            <CardTitle className="text-3xl text-white font-bold">150+</CardTitle>
          </CardHeader>
        </Card>
        <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Risk Zones</CardDescription>
            <CardTitle className="text-3xl text-white font-bold">12</CardTitle>
          </CardHeader>
        </Card>
        <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Safety Check-ins</CardDescription>
            <CardTitle className="text-3xl text-white font-bold">47</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Current Location Map */}
      {currentLocation && (
        <Card className="mt-8 backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-blue-400" />
              Your Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentLocation.address ? (
                <p className="text-sm text-white/90">{currentLocation.address}</p>
              ) : (
                <p className="text-sm text-white/70">Getting address...</p>
              )}
              <div className="flex gap-4 text-xs">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  Lat: {currentLocation.lat.toFixed(6)}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  Lng: {currentLocation.lng.toFixed(6)}
                </Badge>
              </div>
              <div className="h-64 w-full rounded-lg overflow-hidden border border-white/20">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng-0.01},${currentLocation.lat-0.01},${currentLocation.lng+0.01},${currentLocation.lat+0.01}&layer=mapnik&marker=${currentLocation.lat},${currentLocation.lng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}
