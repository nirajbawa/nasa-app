// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm border-b border-green-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 flex items-center">
//                 <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
//                   <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                   </svg>
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">KrishiVed</span>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/login"
//                 className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 href="/signup"
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 Join Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center">
//           <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//             Welcome to{" "}
//             <span className="text-green-600">KrishiVed</span>
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//             Connect with fellow farmers, share knowledge, and grow your agricultural business. 
//             Join our community of passionate farmers from around the world.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/signup"
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//             >
//               Get Started Today
//             </Link>
//             <Link
//               href="#features"
//               className="border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//             >
//               Learn More
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div id="features" className="bg-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose KrishiVed</h2>
//             <p className="text-lg text-gray-600">Everything you need to succeed in modern farming</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center p-6">
//               <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
//               <p className="text-gray-600">Connect with thousands of farmers worldwide and share experiences, tips, and knowledge.</p>
//             </div>
            
//             <div className="text-center p-6">
//               <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
//               <p className="text-gray-600">Track your farm's performance with detailed analytics and insights to optimize your operations.</p>
//             </div>
            
//             <div className="text-center p-6">
//               <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
//               <p className="text-gray-600">Stay ahead with the latest farming technologies, techniques, and sustainable practices.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-green-600 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Farm?</h2>
//           <p className="text-xl text-green-100 mb-8">Join thousands of farmers who are already using FarmConnect to improve their operations.</p>
//           <Link
//             href="/signup"
//             className="bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
//           >
//             Start Your Journey
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
