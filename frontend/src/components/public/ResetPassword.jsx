import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images/logo.svg';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const email = location.state?.email || sessionStorage.getItem('resetEmail') || '';
  const userId = sessionStorage.getItem('userId');

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        toast.error('Failed to initialize form security.');
      }
    };
    fetchCsrfToken();
  }, []);

  const validateOtp = () => {
    let temp = {};
    if (!otp.trim()) {
      temp.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      temp.otp = 'OTP must be 6 digits';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validatePassword = () => {
    let temp = {};
    if (!formData.password) {
      temp.password = 'New password is required';
    } else if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      temp.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    if (!formData.confirmPassword) {
      temp.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = 'Passwords do not match';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrors({ ...errors, otp: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId, otp },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('OTP verified successfully!');
        // Store the reset token for password reset
        sessionStorage.setItem('resetToken', response.data.token);
        setOtpVerified(true);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const resetToken = sessionStorage.getItem('resetToken');
    if (!resetToken) {
      toast.error('Reset token not found. Please try the forgot password process again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
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
        toast.success('Password reset successful! Please log in.');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('resetToken');
        setLoading(false);
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password Reset Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F3F4F6] font-sans">
      <div className="absolute top-8 left-14 flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Musicio Logo" className="w-11 mr-2" />
        </Link>
      </div>
      <div className="bg-white p-7 rounded-2xl shadow-lg w-[27rem] max-w-lg">
        <h2 className="text-3xl font-medium text-start text-gray-800">
          {otpVerified ? 'Reset Password' : 'Verify OTP'}
        </h2>
        <p className="text-sm text-gray-500 text-start mb-6 mt-2">
          {otpVerified
            ? 'Enter your new password.'
            : 'Enter the 6-digit OTP sent to your email.'}
        </p>
        {!otpVerified ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter 6-digit OTP"
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Verifying OTP...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter new password"
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
            <div>
              <label className="block text-gray-700 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >

                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          Back to{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default ResetPassword;