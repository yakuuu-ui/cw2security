import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const CancellationPolicy = () => {
    return (
        <>
            <Layout />
            <div className="max-w-4xl mx-auto p-6 bg-white mt-10">
                <h1 className="text-3xl font-bold text-center text-[#00bf63] mb-6">
                    Cancellation Policy
                </h1>
                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">1. Overview</h2>
                        <p>
                            At <strong>Musicio</strong>, we understand that plans change. If you need to cancel an order,
                            please review our cancellation policy below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">2. Order Cancellation</h2>
                        <p>You may cancel an order under the following conditions:</p>
                        <ul className="list-disc pl-5">
                            <li>Orders can be canceled within <strong>5 minutes</strong> of placing the order without any charges.</li>
                            <li>Once the restaurant starts preparing your food, cancellation is no longer possible.</li>
                            <li>If an order is canceled before preparation, you may be eligible for a full refund.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">3. Non-Cancelable Orders</h2>
                        <p>Cancellation is not allowed in the following cases:</p>
                        <ul className="list-disc pl-5">
                            <li>After the restaurant has accepted and started preparing the food.</li>
                            <li>For special deals, promotions, or limited-time offers.</li>
                            <li>For pre-scheduled orders that are within 30 minutes of delivery time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">4. Cancellation Fees</h2>
                        <p>
                            If cancellation is requested after the restaurant has started preparing the food,
                            a cancellation fee may apply to cover the restaurant’s and delivery service's costs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-[#00bf63]">5. Refund Process</h2>
                        <p>
                            If your cancellation request is approved, the refund will be processed as follows:
                        </p>
                        <ol className="list-decimal pl-5">
                            <li>Refunds will be issued to the original payment method.</li>
                            <li>Processing times vary based on the payment provider (typically 5-10 business days).</li>
                            <li>If paid via cash on delivery (COD), no refund is applicable.</li>
                        </ol>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CancellationPolicy;
