
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { isAuthenticated, getRole } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', recaptchaToken: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('Login.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('Login.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRecaptchaChange = (token) => {
    setFormData({ ...formData, recaptchaToken: token });
    setErrors({ ...errors, recaptchaToken: '' });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    if (!formData.password) {
      temp.password = 'Password is required';
    }
    if (!formData.recaptchaToken) {
      temp.recaptchaToken = 'Please complete the reCAPTCHA';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          recaptchaToken: formData.recaptchaToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('OTP sent to your email!');
        navigate('/verify-otp', { state: { userId: response.data.userId, email: formData.email, rememberMe } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('Please verify your email')) {
        toast.error('Please verify your email before logging in');
        navigate('/verify-otp', { state: { userId: error.response?.data?.userId, email: formData.email, rememberMe } });
      } else if (msg.includes('Invalid credentials')) {
        toast.error('Invalid email or password');
      } else if (msg.includes('reCAPTCHA')) {
        toast.error('reCAPTCHA verification failed');
      } else if (msg.includes('Account is locked')) {
        toast.error('Too many attempts. Please try again after 15 minutes.');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error('Login failed: Please try again.');
      }
      console.error('Login.jsx: Login Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = getRole();
      toast.success('Already logged in!');
      navigate(role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [isAuthenticated, getRole, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="absolute top-8 left-14 flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="musicio logo" className="w-11 mr-2" />
        </Link>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[27rem] max-w-lg flex flex-col items-center">
        <h2 className="text-3xl font-medium text-center text-blue-700 mb-2">Sign In</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Log in to your musicio account.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4 w-full flex justify-center">
            <ReCAPTCHA
              sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
              onChange={handleRecaptchaChange}
            />
            {errors.recaptchaToken && <p className="text-red-500 text-sm mt-1 text-center">{errors.recaptchaToken}</p>}
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2 text-black">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="accent-blue-600"
              />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading || isCsrfLoading}
            className={`w-full p-3 rounded-lg font-semibold text-white transition ${loading || isCsrfLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Logging in...</span>
              </div>
            ) : isCsrfLoading ? (
              'Loading...'
            ) : (
              'Log in'
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          New to musicio?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default Login;
