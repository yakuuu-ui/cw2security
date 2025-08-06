import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const PrivacyPolicy = () => {
    return (
        <>
            <Layout />
            <div className="max-w-4xl mx-auto p-6 bg-white mt-10">
                <h1 className="text-3xl font-bold text-center text-[#00bf63] mb-6">
                    Privacy Policy
                </h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">1. Introduction</h2>
                        <p>
                            Welcome to <strong>Musicio</strong>, your go-to food delivery platform.
                            Your privacy is important to us, and we are committed to protecting
                            your personal data. This policy explains how we collect, use, and
                            safeguard your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">2. Information We Collect</h2>
                        <p>We collect the following types of information when you use our services:</p>
                        <ul className="list-disc pl-5">
                            <li><strong>Personal Information:</strong> Name, email, phone number, and address.</li>
                            <li><strong>Payment Information:</strong> Credit/debit card details (processed securely).</li>
                            <li><strong>Order History:</strong> Previous orders, preferences, and feedback.</li>
                            <li><strong>Device & Location Data:</strong> IP address, browser type, and GPS location (if enabled).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">3. How We Use Your Information</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-5">
                            <li>Process and deliver your food orders efficiently.</li>
                            <li>Provide customer support and respond to queries.</li>
                            <li>Improve our services through analytics and user feedback.</li>
                            <li>Send promotions, discounts, and special offers (with your consent).</li>
                            <li>Ensure security and prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">4. Sharing Your Information</h2>
                        <p>We do not sell your personal information. However, we may share it with:</p>
                        <ul className="list-disc pl-5">
                            <li>Payment gateways for secure transactions.</li>
                            <li>Delivery partners to complete your orders.</li>
                            <li>Third-party services (only for analytics and marketing, with your consent).</li>
                            <li>Legal authorities when required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">5. Data Security</h2>
                        <p>
                            We use industry-standard encryption and security measures to protect
                            your data. However, no system is 100% secure. Please keep your login
                            credentials confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5">
                            <li>Access, update, or delete your personal data.</li>
                            <li>Opt out of marketing emails and notifications.</li>
                            <li>Request a copy of the data we hold about you.</li>
                        </ul>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
