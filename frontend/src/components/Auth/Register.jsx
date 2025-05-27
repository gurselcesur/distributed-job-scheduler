import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, User, Lock, AlertCircle, CheckCircle, Zap, Sparkles, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await register(formData.username, formData.password);
      setSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-orange animate-bounce-slow" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">CronFlow</span>'a
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Join Us</h2>
          <p className="text-text-secondary">
            Create a new account or{' '}
            <Link
              to="/login"
              className="font-medium text-secondary hover:text-secondary-light transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-bg-glass backdrop-blur-xl rounded-3xl border border-border-glass p-8 shadow-glass animate-slide-up" style={{animationDelay: '0.1s'}}>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 animate-slide-up">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-400 font-semibold">Hata!</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-accent-emerald/10 backdrop-blur-xl border border-accent-emerald/30 rounded-2xl p-4 flex items-center gap-4 animate-slide-up">
                <div className="w-10 h-10 bg-accent-emerald/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-emerald" />
                </div>
                <div>
                  <h3 className="text-accent-emerald font-semibold">Başarılı!</h3>
                  <p className="text-accent-emerald/80 text-sm">{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Username Field */}
              <div className="group">
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-muted group-focus-within:text-secondary transition-colors duration-300" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl text-white placeholder-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300 group-hover:border-border-light"
                    placeholder="Enter your username (min. 3 characters)"
                  />
                  <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted group-focus-within:text-secondary transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl text-white placeholder-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300 group-hover:border-border-light"
                    placeholder="Enter your password (min. 6 characters)"
                  />
                  <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-text-muted group-focus-within:text-secondary transition-colors duration-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-bg-medium/50 backdrop-blur-sm border border-border-glass rounded-2xl text-white placeholder-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300 group-hover:border-border-light"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full p-4 bg-gradient-secondary hover:shadow-glow rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Create Account
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-secondary hover:text-secondary-light transition-colors"
              >
                Sign in now
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass p-4">
            <p className="text-text-secondary text-sm">
              🔐 Secure registration • 🚀 Instant activation • ⚡ Free usage
            </p>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mt-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="bg-bg-glass backdrop-blur-xl rounded-2xl border border-border-glass p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-cyan" />
              Password Requirements
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-emerald rounded-full"></div>
                <span className="text-text-secondary">At least 6 characters long</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                <span className="text-text-secondary">Must match password confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                <span className="text-text-secondary">Should be secure and memorable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 