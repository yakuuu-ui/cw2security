import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';

const Support = () => {
    const [feedbacks, setFeedbacks] = useState([
        { _id: 1, name: 'Santosh KC', email: 'santosh@gmail.com', title: 'Great Service', message: 'Loved the experience!', date: '2025-02-15' },
        { _id: 2, name: 'Ramesh Thapa', email: 'ramesh@gmail.com', title: 'Good App', message: 'App is user-friendly.', date: '2025-02-14' },
        { _id: 3, name: 'Naran KC', email: 'naran@example.com', title: 'Support Needed', message: 'Had an issue with payment.', date: '2025-02-13' },
    ]);

    return (
        <div className="max-w-7xl mx-auto p-3">
            <h2 className="text-xl font-medium text-left text-black mb-8 flex items-center space-x-2">
                <FaCommentDots className="text-blue-500" />
                <span>Customer Feedback</span>
            </h2>

            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Message</th>
                        <th className="py-2 px-4 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map(feedback => (
                        <tr key={feedback._id} className="border-b">
                            <td className="py-2 px-4 flex items-center space-x-2">
                                <FaCommentDots className="text-green-500" />
                                <span>{feedback.name}</span>
                            </td>
                            <td className="py-2 px-4">{feedback.email}</td>
                            <td className="py-2 px-4">{feedback.title}</td>
                            <td className="py-2 px-4">{feedback.message}</td>
                            <td className="py-2 px-4">{feedback.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Support;
