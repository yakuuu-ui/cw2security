import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-gray-100 rounded-lg shadow-md mt-4 mb-8">
      {/* Text Section */}
      <div className="md:w-1/2 text-left">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-700">musicio</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover, compare, and buy your favorite musical instruments online. Simple, fast, and reliable.
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="bg-blue-600 text-white py-3 px-8 text-lg rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Shop Instruments
        </button>
      </div>
      {/* Image Section */}
      <div className="md:w-1/2 flex justify-center ml-8">
        <img
          src="/src/assets/images/hungerend.png"
          alt="Les Paul Guitar"
          className="w-full max-w-lg rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero;
