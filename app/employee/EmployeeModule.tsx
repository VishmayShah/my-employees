// import { Suspense } from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import ProtectedRoute from '../components/ProtectedRoute';
// import Navbar from '../components/Navbar';
// import ErrorBoundary from '../components/ErrorBoundary';
// import Loader from '../components/Loader';
// import EmployeePage from './page';

// const router = createBrowserRouter([
//   {
//     path: '/employee',
//     element: (
//       <ProtectedRoute allowedRoles={["employee"]}>
//         <ErrorBoundary>
//           <Navbar />
//         </ErrorBoundary>
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <EmployeePage /> },
//     ],
//   },
// ]);

// const EmployeeModule = () => (
//   <Suspense fallback={<Loader />}>
//     <RouterProvider router={router} />
//   </Suspense>
// );

// export default EmployeeModule;
