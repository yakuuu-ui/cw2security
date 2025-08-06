
import axios from "axios";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";
import logo from "../../assets/images/logo.svg";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/auth/csrf-token", { withCredentials: true })
      .then((response) => {
        console.log("CSRF Token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        toast.error("Failed to initialize form security.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "terms") {
      setIsChecked(checked);
      setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
    } else if (type === "checkbox" && name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validatePassword = (password) => {
    const result = zxcvbn(password);
    const minScore = 3; // Require "good" strength
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&*]/.test(password),
      strength: result.score >= minScore,
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
      errors: {
        length: requirements.length ? "" : "Password must be at least 8 characters.",
        uppercase: requirements.uppercase ? "" : "Password must include at least one uppercase letter.",
        lowercase: requirements.lowcase ? "" : "Password must include at least one lowercase letter.",
        number: requirements.number ? "" : "Password must include at least one number.",
        special: requirements.special ? "" : "Password must include at least one special character (@, #, $, etc.).",
        strength: requirements.strength ? "" : "Password is too weak.",
      },
    };
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = Object.values(passwordValidation.errors)
          .filter(Boolean)
          .join(" ");
      }
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms and Conditions.";
    }
    if (!recaptchaToken) {
      newErrors.captcha = "Please complete the CAPTCHA.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          ...formData,
          recaptchaToken,
          termsAccepted: isChecked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful! Please log in with your new account.");
        const { token, userId, role } = response.data;
        // Remove automatic login - user should log in manually
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setRecaptchaToken(value);
    setErrors((prevErrors) => ({ ...prevErrors, captcha: "" }));
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="absolute top-8 left-14 flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="musicio logo" className="w-11 mr-2" />
        </Link>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[27rem] max-w-lg flex flex-col items-center">
        <h2 className="text-3xl font-medium text-center text-blue-700 mb-2">Sign Up</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Create an account to start your music journey.</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="mb-4 w-full flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium text-center">First Name</label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter first name"
              />
              {errors.fname && <p className="text-red-500 text-sm text-center">{errors.fname}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium text-center">Last Name</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter last name"
              />
              {errors.lname && <p className="text-red-500 text-sm text-center">{errors.lname}</p>}
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-gray-700 font-medium text-center">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm text-center">{errors.phone}</p>}
          </div>

          <div className="mb-4 w-full">
            <label className="block text-gray-700 font-medium text-center">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm text-center">{errors.email}</p>}
          </div>

          <div className="mb-4 w-full">
            <label className="block text-gray-700 font-medium text-center">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm text-center">{errors.password}</p>}
            <div className="mt-2 text-sm text-gray-500 text-center">
              <p>Password requirements:</p>
              <ul className="list-none space-y-1">
                <li className={passwordValidation.requirements.length ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.length ? "✓" : "✗"} At least 8 characters
                </li>
                <li className={passwordValidation.requirements.uppercase ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.uppercase ? "✓" : "✗"} At least one uppercase letter
                </li>
                <li className={passwordValidation.requirements.lowercase ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.lowercase ? "✓" : "✗"} At least one lowercase letter
                </li>
                <li className={passwordValidation.requirements.number ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.number ? "✓" : "✗"} At least one number
                </li>
                <li className={passwordValidation.requirements.special ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.special ? "✓" : "✗"} At least one special character (@, #, $, etc.)
                </li>
                <li className={passwordValidation.requirements.strength ? "text-green-500" : "text-red-500"}>
                  {passwordValidation.requirements.strength ? "✓" : "✗"} Strong password
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-gray-700 font-medium text-center">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm text-center">{errors.confirmPassword}</p>}
          </div>

          <div className="mb-4 w-full flex justify-center">
            <ReCAPTCHA
              sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi" // Replace with actual reCAPTCHA site key
              onChange={onCaptchaChange}
            />
            {errors.captcha && <p className="text-red-500 text-sm text-center">{errors.captcha}</p>}
          </div>

          <div className="mb-4 w-full flex justify-center items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={isChecked}
              onChange={handleChange}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-500 text-center">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm text-center mb-4">{errors.terms}</p>}

          <div className="mb-4 w-full flex justify-center items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleChange}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-500 text-center">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
                <span>Loading...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default Register;
