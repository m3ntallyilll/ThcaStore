import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema, loginSchema } from '@shared/schema';
import type { InsertUser, LoginRequest } from '@shared/schema';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await login(data);
      toast('Welcome back!', 'success');
      onClose();
    } catch (error: any) {
      toast(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: InsertUser) => {
    setIsLoading(true);
    try {
      await register(data);
      toast('Account created successfully!', 'success');
      onClose();
    } catch (error: any) {
      toast(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    onSwitchMode(newMode);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-dark rounded-2xl p-8 w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-display font-bold mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-gray-400">
                {mode === 'login' ? 'Sign in to your account' : 'Join our community'}
              </p>
            </div>

            {mode === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 focus:border-gold"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 focus:border-gold"
                    {...loginForm.register('password')}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-gray-400">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-gold hover:text-gold-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold to-gold-600 text-black py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-white/10 border-white/20 focus:border-gold"
                      {...registerForm.register('firstName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="bg-white/10 border-white/20 focus:border-gold"
                      {...registerForm.register('lastName')}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="bg-white/10 border-white/20 focus:border-gold"
                    {...registerForm.register('username')}
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 focus:border-gold"
                    {...registerForm.register('email')}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 focus:border-gold"
                    {...registerForm.register('password')}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cannabis to-cannabis-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cannabis/30 transition-all duration-300"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <Button
                  variant="link"
                  onClick={switchMode}
                  className="text-gold hover:text-gold-300 transition-colors ml-1 p-0"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
