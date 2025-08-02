import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import CheckEmailPage from "../pages/CheckEmailPage.jsx";
import CheckPasswordPage from "../pages/CheckPasswordPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import MessagePage from "../component/MessagePage.jsx";
import AuthLayout from "../layout/index.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path : "register",
            element: <AuthLayout> <RegisterPage/>   </AuthLayout> 
        },
        {
            path : "email",
            element : <AuthLayout> <CheckEmailPage/> </AuthLayout>
        },
        {
            path : "password",
            element: <AuthLayout> <CheckPasswordPage/> </AuthLayout>
        },
        {
            path : "forgot-password",
            element: <AuthLayout> <ForgotPasswordPage/> </AuthLayout>
        },
        {
            path : "/",
            element: <HomePage/>,
            children: [
                {
                    path : ":userId",
                    element:  <MessagePage/>
                }
            ]
        }

    ],
  },
]);

export default router;
