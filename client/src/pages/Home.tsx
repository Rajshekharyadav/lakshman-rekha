import { HeroSlider } from "@/components/HeroSlider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CloudRain, Sprout, MapPin, Bell, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as any);
      });
    }
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission('granted'),
      () => setLocationPermission('denied')
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Location Permission Banner */}
      {locationPermission !== 'granted' && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-warning" />
              <div>
                <CardTitle className="text-base">Enable Location Access</CardTitle>
                <CardDescription>
                  Location access is required for danger zone alerts and emergency features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={requestLocation} 
              variant="outline" 
              className="border-warning text-warning hover:bg-warning/10"
              data-testid="button-enable-location"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Enable Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-lg text-muted-foreground">
          Your personalized safety dashboard with AI-powered predictions
        </p>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Women Safety Card */}
        <Link href="/women-safety">
          <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full" data-testid="card-women-safety">
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Women Safety & Empowerment</CardTitle>
              <CardDescription className="text-base">
                Access government schemes and real-time danger zone alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bell className="w-4 h-4" />
                  <span>Live danger zone tracking</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>100+ schemes available</span>
                </div>
              </div>
              <Button className="mt-4 w-full" data-testid="button-explore-women-safety">
                Explore Features
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Disaster Management Card */}
        <Link href="/disaster">
          <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full" data-testid="card-disaster">
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-md bg-warning/10 flex items-center justify-center">
                <CloudRain className="w-6 h-6 text-warning" />
              </div>
              <CardTitle className="text-xl">Disaster Management</CardTitle>
              <CardDescription className="text-base">
                Weather forecasts and disaster risk zone mapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bell className="w-4 h-4" />
                  <span>Real-time weather alerts</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Risk zone mapping</span>
                </div>
              </div>
              <Button className="mt-4 w-full" data-testid="button-explore-disaster">
                View Forecast
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Farmers Support Card */}
        <Link href="/farmers">
          <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full" data-testid="card-farmers">
            <CardHeader className="space-y-3">
              <div className="w-12 h-12 rounded-md bg-safe/10 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-safe" />
              </div>
              <CardTitle className="text-xl">Farmers Support</CardTitle>
              <CardDescription className="text-base">
                AI crop recommendations and disease detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Crop profitability analysis</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CloudRain className="w-4 h-4" />
                  <span>Weather-based suggestions</span>
                </div>
              </div>
              <Button className="mt-4 w-full" data-testid="button-explore-farmers">
                Get Recommendations
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Alerts</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Schemes Available</CardDescription>
            <CardTitle className="text-3xl">150+</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risk Zones</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Safety Check-ins</CardDescription>
            <CardTitle className="text-3xl">47</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
