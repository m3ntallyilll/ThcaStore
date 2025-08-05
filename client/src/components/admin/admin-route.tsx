import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Show loading state while auth is being checked
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-dark-800 border-dark-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-400">Please login to access admin features.</p>
            <Button 
              onClick={() => setLocation('/')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center pt-20">
        <Card className="w-full max-w-md bg-dark-800 border-dark-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldX className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-white">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-400">
              This page is restricted to administrators only. You don't have permission to view this content.
            </p>
            <Button 
              onClick={() => setLocation('/')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is admin, render the protected content
  return <>{children}</>;
}