
import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/common/customer/ScrollToTop";
import { useAuth } from "./context/AuthContext";

// Error Page Component
const ErrorPage = () => <div>Error: Something went wrong!</div>;

// Lazy Imports with Debugging
const Home = lazy(() =>
  import("./components/public/Home").then((module) => {
    console.log("Home module:", module);
    return module;
  })
);
const OtpVerification = lazy(() =>
  import("./components/public/OtpVerification").then((module) => {
    console.log("OtpVerification module:", module);
    return module;
  })
);
const Login = lazy(() =>
  import("./components/public/Login").then((module) => {
    console.log("Login module:", module);
    return module;
  })
);
const ForgotPassword = lazy(() =>
  import("./components/public/ForgotPassword").then((module) => {
    console.log("Login module:", module);
    return module;
  })
);
const ResetPassword = lazy(() =>
  import("./components/public/ResetPassword").then((module) => {
    console.log("Login module:", module);
    return module;
  })
);
const Register = lazy(() =>
  import("./components/public/Register").then((module) => {
    console.log("Register module:", module);
    return module;
  })
);
const Layout = lazy(() =>
  import("./components/private").then((module) => {
    console.log("Layout module:", module);
    return module;
  })
);
const ContactUs = lazy(() =>
  import("./components/public/ContactUs").then((module) => {
    console.log("ContactUs module:", module);
    return module;
  })
);
const PrivacyPolicy = lazy(() =>
  import("./components/public/PrivacyPolicy").then((module) => {
    console.log("PrivacyPolicy module:", module);
    return module;
  })
);
const About = lazy(() =>
  import("./components/public/About").then((module) => {
    console.log("About module:", module);
    return module;
  })
);
const TermsCondition = lazy(() =>
  import("./components/public/TermsCondition").then((module) => {
    console.log("TermsCondition module:", module);
    return module;
  })
);
const RefundPolicy = lazy(() =>
  import("./components/public/RefundPolicy").then((module) => {
    console.log("RefundPolicy module:", module);
    return module;
  })
);
const CancellationPolicy = lazy(() =>
  import("./components/public/CancellationPolicy").then((module) => {
    console.log("CancellationPolicy module:", module);
    return module;
  })
);
const DeliveryCharges = lazy(() =>
  import("./components/public/DeliveryCharges").then((module) => {
    console.log("DeliveryCharges module:", module);
    return module;
  })
);
const Dashboard = lazy(() =>
  import("./components/private/dashboard").then((module) => {
    console.log("Dashboard module:", module);
    return module;
  }).catch((error) => {
    console.error("Failed to load Dashboard module:", error);
    return { default: () => <div>Error: Dashboard module not found</div> };
  })
);
const AllCategory = lazy(() =>
  import("./components/private/category").then((module) => {
    console.log("AllCategory module:", module);
    return module;
  })
);
const EditCategory = lazy(() =>
  import("./components/private/category/EditCategory").then((module) => {
    console.log("EditCategory module:", module);
    return module;
  })
);
const EditSubcategory = lazy(() =>
  import("./components/private/subcategory/EditSubCategory").then((module) => {
    console.log("EditSubcategory module:", module);
    return module;
  })
);
const EditItem = lazy(() =>
  import("./components/private/item/EditItem").then((module) => {
    console.log("EditItem module:", module);
    return module;
  })
);
const AddCategory = lazy(() =>
  import("./components/private/category/Form").then((module) => {
    console.log("AddCategory module:", module);
    return module;
  })
);
const AddSubcategory = lazy(() =>
  import("./components/private/subcategory/Form").then((module) => {
    console.log("AddSubcategory module:", module);
    return module;
  })
);
const AllSubcategory = lazy(() =>
  import("./components/private/subcategory").then((module) => {
    console.log("AllSubcategory module:", module);
    return module;
  })
);
const User = lazy(() =>
  import("./components/private/user").then((module) => {
    console.log("User module:", module);
    return module;
  })
);
const AddItem = lazy(() =>
  import("./components/private/item/Form").then((module) => {
    console.log("AddItem module:", module);
    return module;
  })
);
const ViewItem = lazy(() =>
  import("./components/private/item").then((module) => {
    console.log("ViewItem module:", module);
    return module;
  })
);
const CancelOrder = lazy(() =>
  import("./components/private/order/CancelOrder").then((module) => {
    console.log("CancelOrder module:", module);
    return module;
  })
);
const CompletedOrder = lazy(() =>
  import("./components/private/order/CompletedOrder").then((module) => {
    console.log("CompletedOrder module:", module);
    return module;
  })
);
const ConfirmOrder = lazy(() =>
  import("./components/public/ItemDetails").then((module) => {
    console.log("ConfirmOrder module:", module);
    return module;
  })
);
const PendingOrder = lazy(() =>
  import("./components/private/order/PendingOrder").then((module) => {
    console.log("PendingOrder module:", module);
    return module;
  })
);
const ProcessingOrder = lazy(() =>
  import("./components/private/order/ProcessingOrder").then((module) => {
    console.log("ProcessingOrder module:", module);
    return module;
  })
);
const Settings = lazy(() =>
  import("./components/private/user/Form").then((module) => {
    console.log("Settings module:", module);
    return module;
  })
);
const AllOrder = lazy(() =>
  import("./components/private/order").then((module) => {
    console.log("AllOrder module:", module);
    return module;
  })
);
const Support = lazy(() =>
  import("./components/private/user/Support").then((module) => {
    console.log("Support module:", module);
    return module;
  })
);
const ItemDetails = lazy(() =>
  import("./components/public/ItemDetails").then((module) => {
    console.log("ItemDetails module:", module);
    return module;
  })
);
const Profile = lazy(() =>
  import("./components/public/Profile").then((module) => {
    console.log("Profile module:", module);
    return module;
  })
);
const MyOrders = lazy(() =>
  import("./components/public/MyOrders").then((module) => {
    console.log("MyOrders module:", module);
    return module;
  })
);
const Cart = lazy(() =>
  import("./components/public/Cart").then((module) => {
    console.log("Cart module:", module);
    return module;
  })
);
const Wishlist = lazy(() =>
  import("./components/public/Wishlist").then((module) => {
    console.log("Wishlist module:", module);
    return module;
  })
);
const Checkout = lazy(() =>
  import("./components/public/Checkout").then((module) => {
    console.log("Checkout module:", module);
    return module;
  })
);
const Menu = lazy(() =>
  import("./components/public/Menu").then((module) => {
    console.log("Menu module:", module);
    return module;
  })
);
const OrderSuccess = lazy(() =>
  import("./components/public/OrderSuccess").then((module) => {
    console.log("OrderSuccess module:", module);
    return module;
  })
);
const SearchResults = lazy(() =>
  import("./components/public/SearchResults").then((module) => {
    console.log("SearchResults module:", module);
    return module;
  })
);

function App() {
  // Sync localStorage to sessionStorage for auth
  useEffect(() => {
    if (!sessionStorage.getItem('token') && localStorage.getItem('authToken')) {
      sessionStorage.setItem('token', localStorage.getItem('authToken'));
    }
    if (!sessionStorage.getItem('userId') && localStorage.getItem('userId')) {
      sessionStorage.setItem('userId', localStorage.getItem('userId'));
    }
  }, []);

  const { user, loading, getRole, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const role = getRole();
      console.log("App.jsx: getRole result:", role, { user, isAuthenticated });
      setIsAdmin(role === "admin");
    } else {
      console.log("App.jsx: Not authenticated or loading", { loading, isAuthenticated, user });
      setIsAdmin(false);
    }
  }, [loading, isAuthenticated, user, getRole]);

  console.log("App.jsx: isAdmin:", isAdmin);

  if (loading) return <div>Loading...</div>;

  const publicRoutes = [
    { path: "/", element: <Home />, errorElement: <ErrorPage /> },
    { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
    { path: "/verify-otp", element: <OtpVerification />, errorElement: <ErrorPage /> },
    { path: "/register", element: <Register />, errorElement: <ErrorPage /> },
    { path: "/contact-us", element: <ContactUs />, errorElement: <ErrorPage /> },
    { path: "/privacy-and-policy", element: <PrivacyPolicy />, errorElement: <ErrorPage /> },
    { path: "/about-us", element: <About />, errorElement: <ErrorPage /> },
    { path: "/terms-and-conditions", element: <TermsCondition />, errorElement: <ErrorPage /> },
    { path: "/refund-policy", element: <RefundPolicy />, errorElement: <ErrorPage /> },
    { path: "/cancellation-policy", element: <CancellationPolicy />, errorElement: <ErrorPage /> },
    { path: "/delivery-charges", element: <DeliveryCharges />, errorElement: <ErrorPage /> },
    { path: "/item/details/:id", element: <ItemDetails />, errorElement: <ErrorPage /> },
    { path: "/profile", element: <Profile />, errorElement: <ErrorPage /> },
    { path: "/forgot-password", element: <ForgotPassword/>, errorElement: <ErrorPage /> },
    { path: "/reset-password", element: <ResetPassword/>, errorElement: <ErrorPage /> },
    { path: "/my-orders", element: <MyOrders />, errorElement: <ErrorPage /> },
    { path: "/cart", element: <Cart />, errorElement: <ErrorPage /> },
    { path: "/wishlist", element: <Wishlist />, errorElement: <ErrorPage /> },
    { path: "/checkout", element: <Checkout />, errorElement: <ErrorPage /> },
    { path: "/menu", element: <Menu />, errorElement: <ErrorPage /> },
    { path: "/searchresult", element: <SearchResults />, errorElement: <ErrorPage /> },
    { path: "/checkout/success", element: <OrderSuccess />, errorElement: <ErrorPage /> },
    { path: "*", element: <div>404: Page not found</div>, errorElement: <ErrorPage /> },
  ];

  const privateRoutes = [
    {
      path: "/admin",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "dashboard", element: <Dashboard />, errorElement: <ErrorPage /> },
        { path: "category/edit-category/:id", element: <EditCategory />, errorElement: <ErrorPage /> },
        { path: "subcategory/edit-subcategory/:id", element: <EditSubcategory />, errorElement: <ErrorPage /> },
        { path: "menu/edit-item/:id", element: <EditItem />, errorElement: <ErrorPage /> },
        { path: "category/all-categories", element: <AllCategory />, errorElement: <ErrorPage /> },
        { path: "category/add-category", element: <AddCategory />, errorElement: <ErrorPage /> },
        { path: "subcategory/add-subcategory", element: <AddSubcategory />, errorElement: <ErrorPage /> },
        { path: "subcategory/all-subcategories", element: <AllSubcategory />, errorElement: <ErrorPage /> },
        { path: "support", element: <Support />, errorElement: <ErrorPage /> },
        { path: "users", element: <User />, errorElement: <ErrorPage /> },
        { path: "menu/all-items", element: <ViewItem />, errorElement: <ErrorPage /> },
        { path: "menu/add-item", element: <AddItem />, errorElement: <ErrorPage /> },
        { path: "order/all-orders", element: <AllOrder />, errorElement: <ErrorPage /> },
        { path: "order/pending-orders", element: <PendingOrder />, errorElement: <ErrorPage /> },
        { path: "order/confirmed-orders", element: <ConfirmOrder />, errorElement: <ErrorPage /> },
        { path: "order/processing-orders", element: <ProcessingOrder />, errorElement: <ErrorPage /> },
        { path: "order/completed-orders", element: <CompletedOrder />, errorElement: <ErrorPage /> },
        { path: "order/cancelled-orders", element: <CancelOrder />, errorElement: <ErrorPage /> },
        { path: "setting", element: <Settings />, errorElement: <ErrorPage /> },
      ],
    },
    { path: "*", element: <div>404: Page not found</div>, errorElement: <ErrorPage /> },
  ];

  const routes = isAdmin ? privateRoutes : publicRoutes;

  return (
    <div>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={createBrowserRouter(routes)} />
      </Suspense>
    </div>
  );
}
export default App;
