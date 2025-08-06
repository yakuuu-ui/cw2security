
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images/logo.svg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('ForgotPassword.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('ForgotPassword.jsx: CSRF Token Error:', error.message);
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

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/forgot-password',
        {
          email: formData.email.trim().toLowerCase(),
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
        sessionStorage.setItem('resetEmail', formData.email);
        sessionStorage.setItem('userId', response.data.userId);
        navigate('/reset-password', { state: { email: formData.email } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('No account found')) {
        toast.error('No account found with that email');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else {
        toast.error('Failed to process request. Please try again.');
      }
      console.error('ForgotPassword.jsx: Error:', error.response?.data || error.message);
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
        <h2 className="text-3xl font-medium text-start text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-start mb-6 mt-2">
          Enter your email to receive a 6-digit OTP to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || isCsrfLoading}
            className={`w-full p-3 rounded-lg font-semibold text-white transition ${loading || isCsrfLoading ? 'bg-[#009f4e] cursor-not-allowed' : 'bg-[#00bf63] hover:bg-[#009f4e]'
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
                <span>Sending OTP...</span>
              </div>
            ) : isCsrfLoading ? (
              'Loading...'
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Back to{' '}
          <Link to="/login" className="text-[#00bf63] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default ForgotPassword;
