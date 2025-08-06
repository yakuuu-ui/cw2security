// import { useState } from 'react';
// import { FaComments, FaReply, FaStar } from 'react-icons/fa';
// import Modal from 'react-modal';

// // This is required to bind modal to app element, for accessibility reasons
// Modal.setAppElement('#root');

// const Review = () => {
//     const reviews = [
//         {
//             id: 1,
//             food: { name: 'Veg Pizza', image: '/src/assets/images/restaurant.jpg', orderId: 'ORDER001' },
//             reviewer: { name: 'Santosh KC', phone: '9840922949' },
//             review: 'Delicious pizza with fresh ingredients!',
//             date: '01 May 2023',
//             time: '10:25 pm'
//         },
//         {
//             id: 2,
//             food: { name: 'Cheese Burger', image: '/src/assets/images/burger.jpg', orderId: 'ORDER002' },
//             reviewer: { name: 'Anusha Shah', phone: '9812345678' },
//             review: 'Loved the burger, very cheesy and tasty!',
//             date: '02 May 2023',
//             time: '8:15 pm'
//         }
//     ];

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentReview, setCurrentReview] = useState(null);
//     const [rating, setRating] = useState(0);
//     const [reply, setReply] = useState('');

//     const openModal = (review) => {
//         setCurrentReview(review);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setRating(0);
//         setReply('');
//     };

//     const handleSubmitReply = () => {
//         // Handle the reply submission logic here
//         alert(`Reply: ${reply}, Rating: ${rating}`);
//         closeModal();
//     };

//     return (
//         <div className="p-3 bg-white rounded-lg">
//             <div className="flex items-center mb-4">
//                 <FaComments className="text-xl mr-2" />
//                 <h2 className="text-xl font-medium">Customer Reviews ({reviews.length})</h2>
//             </div>
//             <table className="min-w-full bg-white border border-gray-200">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th className="py-2 px-4 border-b">SN</th>
//                         <th className="py-2 px-4 border-b">Food</th>
//                         <th className="py-2 px-4 border-b">Reviewer</th>
//                         <th className="py-2 px-4 border-b">Review</th>
//                         <th className="py-2 px-4 border-b">Date</th>
//                         <th className="py-2 px-4 border-b">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reviews.map((review, index) => (
//                         <tr key={review.id} className="text-center">
//                             <td className="py-2 px-4 border-b">{index + 1}</td>
//                             <td className="py-2 px-4 border-b flex items-center justify-start space-x-4">
//                                 <img src={review.food.image} alt={review.food.name} className="w-12 h-12 object-cover rounded" />
//                                 <div className="flex flex-col items-start">
//                                     <span>{review.food.name}</span>
//                                     <span className="text-xs text-gray-500">{review.food.orderId}</span>
//                                 </div>
//                             </td>
//                             <td className="py-2 px-4 border-b">
//                                 {review.reviewer.name}<br />
//                                 <span className="text-xs text-gray-500">{review.reviewer.phone}</span>
//                             </td>
//                             <td className="py-2 px-4 border-b">{review.review}</td>
//                             <td className="py-2 px-4 border-b">
//                                 {review.date}<br />
//                                 <span className="text-xs text-gray-500">{review.time}</span>
//                             </td>
//                             <td className="py-2 px-4 border-b">
//                                 <button onClick={() => openModal(review)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center space-x-1">
//                                     <FaReply /> <span>Give Reply</span>
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Modal */}
//             <Modal
//                 isOpen={isModalOpen}
//                 onRequestClose={closeModal}
//                 contentLabel="Reply to Review"
//                 className="bg-white rounded-lg p-6 w-96"
//                 overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
//             >
//                 <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
//                     &times;
//                 </button>
//                 {currentReview && (
//                     <>
//                         <div className="flex flex-col items-center mb-4">
//                             <img src={currentReview.food.image} alt={currentReview.food.name} className="w-16 h-16 object-cover rounded mb-2" />
//                             <span className="font-semibold">{currentReview.food.name}</span>
//                             <div className="flex mb-2">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                     <FaStar
//                                         key={star}
//                                         className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
//                                         onClick={() => setRating(star)}
//                                     />
//                                 ))}
//                             </div>
//                             <span className="text-xs text-gray-500">{currentReview.reviewer.name}</span>
//                             <p className="mt-2 text-gray-600">{currentReview.review}</p>
//                         </div>
//                         <textarea
//                             value={reply}
//                             onChange={(e) => setReply(e.target.value)}
//                             placeholder="Write your reply"
//                             className="mt-4 w-full p-2 border border-gray-300 rounded"
//                         />
//                         <button onClick={handleSubmitReply} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
//                             Give Reply
//                         </button>
//                     </>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default Review;
