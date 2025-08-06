import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const RefundPolicy = () => {
    return (
        <>
            <Layout />
            <div className="max-w-4xl mx-auto p-6 bg-white mt-10">
                <h1 className="text-3xl font-bold text-center text-[#00bf63] mb-6">
                    Refund Policy
                </h1>
                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">1. Overview</h2>
                        <p>
                            At <strong>Musicio</strong>, we strive to provide the best food delivery experience. However,
                            if you are not satisfied with your order, you may be eligible for a refund under the
                            conditions outlined below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">2. Refund Eligibility</h2>
                        <p>Refunds may be issued in the following cases:</p>
                        <ul className="list-disc pl-5">
                            <li>Incorrect items were delivered.</li>
                            <li>The order was not delivered within the estimated timeframe.</li>
                            <li>Food quality issues (spoiled or contaminated items).</li>
                            <li>Order was charged but not received.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">3. Non-Refundable Cases</h2>
                        <p>We do not offer refunds in the following cases:</p>
                        <ul className="list-disc pl-5">
                            <li>Change of mind after the order is confirmed.</li>
                            <li>Incorrect address provided by the customer.</li>
                            <li>Partial consumption of the food.</li>
                            <li>Delivery delays due to weather, traffic, or other unavoidable conditions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">4. Refund Process</h2>
                        <p>To request a refund, please follow these steps:</p>
                        <ol className="list-decimal pl-5">
                            <li>Contact our support team within 24 hours of receiving your order.</li>
                            <li>Provide order details and a reason for the refund request.</li>
                            <li>Attach clear photos if applicable (incorrect/damaged food items).</li>
                            <li>Our team will review and process eligible refunds within 5-7 business days.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">5. Payment Reversal</h2>
                        <p>
                            Approved refunds will be credited back to the original payment method. Depending on
                            your bank or payment provider, it may take 5-10 business days for the refund to reflect.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RefundPolicy;
