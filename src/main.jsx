import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx"; // Ensure correct file extension
import Header from "./components/custom/Header.jsx";
import Immidiate from "./components/custom/ImmediateEmergency.jsx";
import { Toaster } from "./components/ui/sonner.jsx"; // Ensure correct file extension
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./view-trip/[tripId]/index.jsx"; // Ensure correct file extension
import { ParallaxProvider } from "react-scroll-parallax";
import MyTrips from "./my-trips/index.jsx";
import Emergency from "./Emergency/index.jsx";
import LiveScanner from "./imagescanner/Scanner.jsx";
import Scanner from "./imagescanner/Scanner.jsx";
import Contact from "./components/custom/contact.jsx";
import EmergencyServices from "./Emergency/index.jsx";
import Chatbot from "./view-trip/components/Chatbot.jsx";
import TransportPage from "./transport/Transportservice.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/create-trip",
        element: <CreateTrip />,
    },
    {
        path: "/view-trip/:tripId",
        element: <ViewTrip />,
    },
    {
        path: "/my-trip",
        element: <MyTrips />
    }, {
        path: "/emergency",
        element: <EmergencyServices />
    }, {

    }, {
        path: "/scan-text",
        element: <Scanner />
    },
    {
        path: "/contact",
        element: <Contact />
    }, {
        path: "/transport",
        element: <TransportPage />
    },
    {
        path: "/chatbot",
        element: <Chatbot />
    },
    
    {
        path: "/nearme",
        element: <Immidiate />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <ParallaxProvider>
                <Header />
                <Toaster />
                <RouterProvider router={router} />
            </ParallaxProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
