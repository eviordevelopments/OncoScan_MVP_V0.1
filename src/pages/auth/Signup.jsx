import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from 'sonner';
import { Loader2, Activity, Eye, EyeOff, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'clinician',
    institution: '',
    specialty: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await signup(userData);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
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
                Join the Future of Thyroid Screening
              </h2>
              <p className="text-[#9CA3AF] text-lg">
                Create your account to access AI-powered malignancy risk assessment and streamlined clinical workflows.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[#9CA3AF]">HIPAA compliant and secure</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[#9CA3AF]">Real-time AI analysis</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[#9CA3AF]">Comprehensive reporting</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0C2D5C] mb-2">Create Account</h2>
              <p className="text-[#9CA3AF]">Get started with OncoScan AI</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-[#0C2D5C]">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0C2D5C]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#0C2D5C]">Account Type</Label>
                <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinician">Clinician/Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'clinician' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-[#0C2D5C]">Institution</Label>
                    <Input
                      id="institution"
                      type="text"
                      placeholder="General Hospital"
                      value={formData.institution}
                      onChange={(e) => handleChange('institution', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-[#0C2D5C]">Specialty</Label>
                    <Input
                      id="specialty"
                      type="text"
                      placeholder="Radiology"
                      value={formData.specialty}
                      onChange={(e) => handleChange('specialty', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0C2D5C]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    className="pr-10"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#0C2D5C]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <Label htmlFor="terms" className="text-sm text-[#9CA3AF] cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-[#0F3F96] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#0F3F96] hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#0F3F96] hover:bg-[#0C2D5C] text-white text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[#9CA3AF]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0F3F96] hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
