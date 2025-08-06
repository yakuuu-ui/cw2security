import { useEffect, useRef, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        phone: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [profilePic, setProfilePic] = useState('/src/assets/images/profile.png');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:3000/api/v1/auth/getCustomer/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({
                    fullName: `${data.data.fname} ${data.data.lname}` || '',
                    phone: data.data.phone || '',
                    email: data.data.email || '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setProfilePic(data.data.image || '/src/assets/images/profile.png');
                setIsLoading(false);
            } else {
                console.error('Failed to fetch user data');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePic', file);

            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:3000/api/v1/auth/updateCustomer/${userId}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfilePic(data.profilePicUrl || '/src/assets/images/profile.png');
                } else {
                    console.error('Failed to upload profile picture');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handleProfileUpdate = async () => {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        const updatedData = {
            fname: userData.fullName.split(' ')[0], // Extract first name
            lname: userData.fullName.split(' ')[1], // Extract last name
            phone: userData.phone,
            email: userData.email,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/v1/auth/updateCustomer/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('✅ Profile information updated successfully! Your changes have been saved.', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log('Profile updated successfully', data);
                setIsLoading(false);
            } else {
                console.error('Failed to update profile');
                toast.error('❌ Failed to update profile. Please try again.', {
                    position: "top-right",
                    autoClose: 4000,
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        // Validate new password length
        if (userData.newPassword.length < 6) {
            setErrorMessage('🔒 Password must be at least 6 characters long for security.');
            return;
        }
        // Ensure passwords match
        if (userData.newPassword !== userData.confirmPassword) {
            setErrorMessage('🔒 Passwords do not match. Please ensure both passwords are identical.');
            return;
        }


        setErrorMessage(''); // Clear error message
        setIsLoading(true);

        const userId = localStorage.getItem('userId');
        const passwordData = {
            oldPassword: userData.oldPassword,  // Add old password
            newPassword: userData.newPassword
        };

        try {
            const response = await fetch(`http://localhost:3000/api/v1/auth/updatePassword/${userId}`, {
                method: 'PUT',  // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passwordData)  // Send both old and new password
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('🔐 Password changed successfully! Your new password is now active.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });


                setIsLoading(false);
            } else {
                console.error('Failed to update password');
                toast.error('❌ Failed to update password. Please check your old password and try again.', {
                    position: "top-right",
                    autoClose: 4000,
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading state while data is being fetched or updated
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                <FaCog /> User Settings
            </h2>



            {/* Profile Update Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-left text-black mb-4">Profile Information</h3>
                <form>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={userData.fullName}
                            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleProfileUpdate}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-left text-black mb-4">Change Password</h3>
                <form>
                    <div className="mb-4">
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={userData.oldPassword}
                            onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={userData.newPassword}
                            onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={userData.confirmPassword}
                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Change Password
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Settings;
