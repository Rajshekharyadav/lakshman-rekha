import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, CloudRain, Sprout, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { signInWithGoogle, user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    setLocation('/');
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-safe/5 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">Sarthi</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Predictive AI Safety Net
            </p>
          </div>
          
          <p className="text-lg text-foreground/90 leading-relaxed max-w-lg">
            Protect vulnerable communities with AI-powered predictions. Real-time safety alerts, 
            disaster forecasting, and agricultural intelligence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <p className="text-sm font-semibold">Women Safety</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <CloudRain className="w-8 h-8 text-primary" />
              <p className="text-sm font-semibold">Disaster Alert</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <Sprout className="w-8 h-8 text-primary" />
              <p className="text-sm font-semibold">Farmer Support</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your personalized safety dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              size="lg"
              className="w-full h-12 text-base font-semibold"
              data-testid="button-google-signin"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground pt-4">
              By signing in, you agree to allow location access for safety features and emergency alerts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
