import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Loader2, Activity, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    if (role === 'clinician') {
      setEmail('doctor@oncoscan.ai');
      setPassword('demo123');
    } else {
      setEmail('patient@example.com');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0C2D5C]">OncoScan AI</h1>
                <p className="text-[#9CA3AF]">Thyroid Screening Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0C2D5C]">
                AI-Powered Thyroid Nodule Screening
              </h2>
              <p className="text-[#9CA3AF] text-lg">
                Advanced malignancy risk assessment for early detection and improved patient outcomes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-white/20">
                <p className="text-2xl font-bold text-[#0F3F96]">88.7%</p>
                <p className="text-sm text-[#9CA3AF]">Sensitivity</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-white/20">
                <p className="text-2xl font-bold text-[#0F3F96]">0.839</p>
                <p className="text-sm text-[#9CA3AF]">AUC-ROC</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant • FDA Cleared • Encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0C2D5C] mb-2">Welcome Back</h2>
              <p className="text-[#9CA3AF]">Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0C2D5C]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0C2D5C]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0C2D5C]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[#9CA3AF]">Remember me</span>
                </label>
                <a href="#" className="text-[#0F3F96] hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#0F3F96] hover:bg-[#0C2D5C] text-white text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Demo Accounts:</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('clinician')}
                  className="text-xs"
                >
                  Clinician Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('patient')}
                  className="text-xs"
                >
                  Patient Demo
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-[#9CA3AF]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#0F3F96] hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
