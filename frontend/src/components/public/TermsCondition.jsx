import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const TermsConditions = () => {
    return (
        <>
            <Layout />
            <div className="max-w-4xl mx-auto p-6 bg-white mt-10">
                <h1 className="text-3xl font-bold text-center text-[#00bf63] mb-6">
                    Terms & Conditions
                </h1>
                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">1. Introduction</h2>
                        <p>
                            Welcome to <strong>Musicio</strong>. By accessing and using our services, you agree to comply
                            with these Terms & Conditions. Please read them carefully before using our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">2. Eligibility</h2>
                        <p>To use Musicio, you must:</p>
                        <ul className="list-disc pl-5">
                            <li>Be at least 18 years old or have parental consent.</li>
                            <li>Provide accurate registration details.</li>
                            <li>Agree to comply with all applicable laws and regulations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">3. Ordering & Payment</h2>
                        <ul className="list-disc pl-5">
                            <li>Orders placed through Musicio are subject to availability.</li>
                            <li>All payments must be made securely through our provided payment methods.</li>
                            <li>Once an order is confirmed, cancellations or modifications may not be possible.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">4. Delivery & Refund Policy</h2>
                        <ul className="list-disc pl-5">
                            <li>Estimated delivery times are approximate and may vary.</li>
                            <li>We are not responsible for delays caused by external factors.</li>
                            <li>Refunds are only applicable in cases of incorrect or missing orders.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">5. User Responsibilities</h2>
                        <ul className="list-disc pl-5">
                            <li>Do not misuse our platform for fraudulent activities.</li>
                            <li>Maintain confidentiality of your account details.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">6. Account Suspension</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts found violating our policies,
                            engaging in fraud, or misusing our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">7. Limitation of Liability</h2>
                        <p>
                            Musicio is not liable for any direct, indirect, incidental, or consequential damages
                            arising from the use of our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">8. Changes to Terms</h2>
                        <p>
                            We may update these Terms & Conditions at any time. Continued use of our services
                            after changes means you accept the revised terms.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsConditions;
