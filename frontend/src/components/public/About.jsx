import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const About = () => {
    return (
        <>
            <Layout />
            <div className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    About musicio
                </h1>
                <p className="text-gray-600 text-sm text-center mb-6">
                    Your trusted marketplace for musical instruments.
                </p>

                <div className="space-y-6 text-gray-700">
                    {/* Our Story */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Our Story</h2>
                        <p>
                            musicio was founded by musicians, for musicians. We started as a small team passionate about making quality instruments accessible to everyone. Today, musicio connects instrument lovers and sellers across the country, making it easy to find the perfect instrument for your needs.
                        </p>
                    </section>

                    {/* Our Mission */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                        <p>
                            We strive to make buying and selling musical instruments simple, safe, and enjoyable. Our mission is to empower musicians of all levels by providing a trusted platform, expert support, and a wide selection of instruments.
                        </p>
                    </section>

                    {/* Why Choose musicio */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Why Choose musicio?</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Wide Selection</strong> – Guitars, pianos, drums, and more from top brands and independent sellers.</li>
                            <li><strong>Expert Support</strong> – Our team is here to help you choose the right instrument.</li>
                            <li><strong>Secure Shopping</strong> – Safe payments and buyer protection for peace of mind.</li>
                            <li><strong>Fast Shipping</strong> – Reliable delivery to your door.</li>
                        </ul>
                    </section>

                    {/* Our Team */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Our Team</h2>
                        <p>
                            We are musicians, music lovers, and tech enthusiasts dedicated to making music accessible to all. Your satisfaction is our top priority.
                        </p>
                    </section>

                    {/* Join Our Community */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Join Our Community</h2>
                        <p>
                            Whether you’re a beginner or a pro, musicio welcomes you. Join us and discover a better way to buy and sell instruments!
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                        <p>Have questions or feedback? We’d love to hear from you!</p>
                        <p className="mt-2"><strong>Email:</strong> support@musicio.com</p>
                        <p><strong>Phone:</strong> +1 234 567 890</p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
