
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Eye, Music, ShoppingCart, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const checkWishlist = async (itemId, customerId, token, csrfToken) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/wishlist/check/${itemId}?customerId=${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        return response.data.isWishlisted;
    } catch (error) {
        console.error('ItemCard.jsx: Error checking wishlist:', error.response?.data || error.message);
        throw error;
    }
};

const ItemCard = ({ item, customerId }) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('ItemCard.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('ItemCard.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: isWishlisted, isLoading: isWishlistLoading } = useQuery({
        queryKey: ['WISHLIST_CHECK', item._id, customerId],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('ItemCard.jsx: JWT Token for wishlist check:', token);
            if (!token || !customerId) {
                return false;
            }
            return checkWishlist(item._id, customerId, token, csrfToken);
        },
        enabled: !!customerId && !!csrfToken,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    useEffect(() => {
        document.body.style.overflow = modalIsOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [modalIsOpen]);

    const toggleWishlistMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for wishlist toggle:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            if (isWishlisted) {
                return axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, {
                    params: { customerId: userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            } else {
                return axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId: userId, itemId: item._id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            }
        },
        onSuccess: () => {
            toast.success(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error toggling wishlist:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to update wishlist.');
            }
        }
    });

    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for add to cart:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            return axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId: userId,
                itemId: item._id,
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Item added to cart successfully.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error adding to cart:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to add item to cart.');
            }
        }
    });

    const toggleWishlist = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        toggleWishlistMutation.mutate();
    };

    const addToCart = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        addToCartMutation.mutate();
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === 'increase' ? prev + 1 : Math.max(1, prev - 1)));
    };

    // Generate random rating for demo purposes
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const reviews = Math.floor(Math.random() * 50) + 10; // 10-60 reviews

    return (
        <div
            className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
        >
            <ToastContainer theme="light" position="top-right" autoClose={4000} />

            {/* Product Image Container */}
            <div className="relative overflow-hidden bg-gray-50">
                <img
                    src={`http://localhost:3000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button
                            className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalIsOpen(true);
                            }}
                        >
                            <Eye size={20} />
                        </button>
                        <button
                            className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${isWishlisted
                                ? 'bg-red-500/90 text-white hover:bg-red-600'
                                : 'bg-white/90 text-gray-800 hover:bg-white'
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist();
                            }}
                            disabled={isWishlistLoading || isCsrfLoading}
                        >
                            <FaHeart size={18} />
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Featured
                    </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-800">{rating}.0</span>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <div className="flex items-center space-x-2 mb-2">
                    <Music size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Musical Instrument</span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {item.name}
                </h3>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">Rs {item.price}</span>
                        <span className="text-sm text-gray-400 line-through">Rs {Math.round(item.price * 1.2)}</span>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        -20% OFF
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            className="bg-gray-50 text-gray-600 px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange('decrease');
                            }}
                        >
                            -
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-center text-gray-800 bg-white font-medium">
                            {quantity}
                        </span>
                        <button
                            className="bg-gray-50 text-gray-600 px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange('increase');
                            }}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart();
                        }}
                        disabled={addToCartMutation.isLoading || isCsrfLoading}
                    >
                        <ShoppingCart size={16} />
                        <span>{addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}</span>
                    </button>
                </div>

                {/* Quick View Button */}
                <button
                    className="w-full mt-3 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/item/details/${item._id}`);
                    }}
                >
                    <Eye size={16} />
                    <span>Quick View</span>
                </button>
            </div>

            {/* Enhanced Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Item Details"
                className="fixed bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-auto border-0"
                overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] backdrop-blur-sm"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">({reviews} reviews)</span>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                -20% OFF
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Section */}
                    <div className="relative">
                        <img
                            src={`http://localhost:3000/uploads/${item.image}`}
                            alt={item.name}
                            className="w-full h-80 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${isWishlisted
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white/90 text-gray-800 hover:bg-white'
                                }`}
                            onClick={toggleWishlist}
                            disabled={isWishlistLoading || isCsrfLoading}
                        >
                            <FaHeart size={18} />
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-gray-900">Rs {item.price}</span>
                            <span className="text-lg text-gray-400 line-through">Rs {Math.round(item.price * 1.2)}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    className="bg-gray-50 text-gray-600 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => handleQuantityChange('decrease')}
                                >
                                    -
                                </button>
                                <span className="w-16 h-10 flex items-center justify-center text-center text-gray-800 bg-white font-medium">
                                    {quantity}
                                </span>
                                <button
                                    className="bg-gray-50 text-gray-600 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => handleQuantityChange('increase')}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="flex-1 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                onClick={addToCart}
                                disabled={addToCartMutation.isLoading || isCsrfLoading}
                            >
                                <ShoppingCart size={18} />
                                <span>{addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}</span>
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                                onClick={() => {
                                    setModalIsOpen(false);
                                    navigate(`/item/details/${item._id}`);
                                }}
                            >
                                <Eye size={18} />
                                <span>View Full Details</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ItemCard;
