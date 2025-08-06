
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Gift, Music, Star, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import Footer from '../common/customer/Footer';
import Hero from '../common/customer/Hero';
import ItemCard from '../common/customer/ItemCard';
import Layout from '../common/customer/Layout';

const fetchItems = async (token, csrfToken) => {
    try {
        const headers = token ? {
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': csrfToken
        } : {
            'X-CSRF-Token': csrfToken
        };

        const response = await axios.get('http://localhost:3000/api/v1/item/items-by-tags', {
            headers,
            withCredentials: true
        });
        console.log('Home.jsx: fetchItems response:', response.status, response.data);
        return response.data;
    } catch (error) {
        console.error('Home.jsx: fetchItems error:', error.response?.data || error.message);
        throw error;
    }
};

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const customerId = user?.userId;
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('Home.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('Home.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ITEMS_BY_TAGS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('Home.jsx: JWT Token:', token);
            // Allow guests: fetch without token if not present
            return fetchItems(token, csrfToken);
        },
        enabled: !!csrfToken,
        select: (data) => data || undefined,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to load items.', { autoClose: 4000 });
            }
        }
    });

    const featuredItems = data?.Featured ?? [];
    const trendingItems = data?.Trending ?? [];
    const bestSellerItems = data?.Popular ?? [];
    const specialItems = data?.Special ?? [];

    if (isLoading || isCsrfLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading amazing instruments...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">🎸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-4">Error fetching items: {error.response?.data?.message || error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Layout />
            <Hero />
            <div className="bg-gray-50 min-h-screen">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />

                {/* Featured Instruments Section */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <Star className="text-yellow-500" size={32} />
                                <h2 className="text-4xl font-bold text-gray-900">
                                    Featured Instruments
                                </h2>
                                <Star className="text-yellow-500" size={32} />
                            </div>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Discover our handpicked collection of premium musical instruments, carefully selected for quality and performance.
                            </p>
                        </div>

                        {featuredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {featuredItems.map((item) => (
                                    <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Music className="text-gray-400 mx-auto mb-4" size={64} />
                                <p className="text-gray-500 text-lg">No featured instruments available</p>
                                <p className="text-gray-400">Check back soon for new arrivals!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Trending Instruments Section */}
                <section className="py-12 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <TrendingUp className="text-orange-500" size={32} />
                                <h2 className="text-4xl font-bold text-gray-900">
                                    Trending Now
                                </h2>
                                <TrendingUp className="text-orange-500" size={32} />
                            </div>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                The most popular instruments that musicians are loving right now.
                            </p>
                        </div>

                        {trendingItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {trendingItems.map((item) => (
                                    <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <TrendingUp className="text-gray-400 mx-auto mb-4" size={64} />
                                <p className="text-gray-500 text-lg">No trending instruments available</p>
                                <p className="text-gray-400">Be the first to discover what's hot!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Best Sellers Section */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <Zap className="text-yellow-500" size={32} />
                                <h2 className="text-4xl font-bold text-gray-900">
                                    Best Sellers
                                </h2>
                                <Zap className="text-yellow-500" size={32} />
                            </div>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Our most loved instruments that customers can't stop raving about.
                            </p>
                        </div>

                        {bestSellerItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {bestSellerItems.map((item) => (
                                    <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Zap className="text-gray-400 mx-auto mb-4" size={64} />
                                <p className="text-gray-500 text-lg">No best sellers available</p>
                                <p className="text-gray-400">These will be the instruments everyone wants!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Special Offers Section */}
                <section className="py-12 px-4 bg-blue-600">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <Gift className="text-white" size={32} />
                                <h2 className="text-4xl font-bold text-white">
                                    musicio Specials
                                </h2>
                                <Gift className="text-white" size={32} />
                            </div>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                                Exclusive deals and limited-time offers on premium instruments.
                            </p>
                        </div>

                        {specialItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {specialItems.map((item) => (
                                    <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Gift className="text-white/50 mx-auto mb-4" size={64} />
                                <p className="text-white/80 text-lg">No special offers available</p>
                                <p className="text-white/60">Amazing deals coming soon!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Find Your Perfect Sound?
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Explore our complete collection of musical instruments and discover the one that speaks to your soul.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/menu')}
                                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                            >
                                Browse All Instruments
                            </button>
                            <button
                                onClick={() => navigate('/contact-us')}
                                className="border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
