import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-slate-600">Use your wildflowerschools.org account.</p>
        <div className="pt-2">
          <Button onClick={() => loginWithGoogle()} className="bg-wildflower-blue hover:bg-blue-700 text-white w-full">
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
