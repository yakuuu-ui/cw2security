// src/components/Profile.jsx
import axios from 'axios';
import { ShoppingBag, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('/src/assets/images/profile.png');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    console.log('Profile.jsx: isAuthenticated:', isAuthenticated);
    console.log('Profile.jsx: user:', user);
    console.log('Profile.jsx: loading:', loading);
    console.log('Profile.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('Profile.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('Profile.jsx: CSRF Token Error:', error.message);
        toast.error('⚠️ Failed to fetch security token. Please refresh the page.', {
          position: "top-right",
          autoClose: 4000,
        });
      });

    if (!isAuthenticated && !user.token) {
      toast.error('🔐 Please log in to view your profile.', {
        position: "top-right",
        autoClose: 4000,
      });
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, phone, email, image } = response.data.data;
        setUserData((prev) => ({
          ...prev,
          fname: fname || '',
          lname: lname || '',
          phone: phone || '',
          email: email || '',
        }));
        setProfilePic(image ? `/Uploads/${image}` : '/src/assets/images/profile.png');
      } else {
        toast.error('❌ Failed to fetch user data. Please refresh the page and try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/v1/auth/uploadImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setProfilePic(`/Uploads/${response.data.data}`);
        toast.success('📸 Profile picture updated successfully! Your new photo has been saved.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('❌ Failed to upload profile picture. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error uploading profile picture:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error uploading profile picture.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const updatedData = {
        fname: userData.fname,
        lname: userData.lname,
        phone: userData.phone,
        email: userData.email,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/update/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('✅ Profile information updated successfully! Your changes have been saved.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('❌ Failed to update profile. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (userData.newPassword.length < 8) {
      toast.error('🔒 Password must be at least 8 characters long for security.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (userData.newPassword !== userData.confirmPassword) {
      toast.error('🔒 Passwords do not match. Please ensure both passwords are identical.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (userData.newPassword === userData.oldPassword) {
      toast.error('🔒 New password cannot be the same as your current password.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const passwordData = {
        oldPassword: userData.oldPassword,
        newPassword: userData.newPassword,
        confirmNewPassword: userData.confirmPassword,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/updatePassword/${userId}`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('🔐 Password changed successfully! Your new password is now active.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUserData((prev) => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast.error('❌ Failed to update password. Please check your old password and try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating password:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-[#00bf63]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout />
      <div className="flex min-h-screen bg-gray-100 p-10 gap-6">
        <div className="w-1/4 flex flex-col space-y-4 mt-14 border-r border-gray-300 p-4">
          <button className="flex items-center gap-2 p-2 border bg-blue-600 text-white rounded-md w-full hover:bg-blue-700 transition">
            <User size={18} /> My Profile
          </button>
          <Link to="/my-orders">
            <button className="flex items-center gap-2 p-2 border rounded-md w-full bg-white text-gray-700 hover:bg-gray-50 transition">
              <ShoppingBag size={18} /> My Orders
            </button>
          </Link>
        </div>
        <div className="w-2/4 space-y-6">
          <h2 className="text-2xl font-semibold text-blue-700">Account Settings</h2>
          <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700">Personal Details</h3>
            {/* <div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-1 bg-[#00bf63] text-white rounded-full hover:bg-[#009f4e] transition"
              >
                <FaEdit size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div> */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="fname"
                  value={userData.fname}
                  onChange={(e) => setUserData({ ...userData, fname: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  value={userData.lname}
                  onChange={(e) => setUserData({ ...userData, lname: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-md font-semibold text-white transition ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
          <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  value={userData.oldPassword}
                  onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={userData.newPassword}
                  onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-md font-semibold text-white transition ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </>
  );
};

export default Profile;