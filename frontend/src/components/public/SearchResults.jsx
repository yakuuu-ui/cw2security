import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate for navigation
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/Layout";

const SearchResults = () => {
    const [items, setItems] = useState([]); // To store the fetched items
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(""); // To handle any errors

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query"); // Retrieve the 'query' from the URL
    const navigate = useNavigate(); // Added navigate to programmatically navigate to item details

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`http://localhost:3000/api/v1/item/search?query=${query}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError("Error fetching search results: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div>
            <Layout />
            <div className="container mx-auto p-4">
                {/* Dynamically display the query in the title */}
                <h1 className="text-xl font-bold text-center mb-6">Search Results for "{query}"</h1>

                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/item/details/${item._id}`)} // Navigate to item details on click
                            >
                                <img
                                    src={`http://localhost:3000/uploads/${item.image}`}
                                    alt={item.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-600 mt-2">{item.description}</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-4">${item.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center">No items found for "{query}".</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchResults;
