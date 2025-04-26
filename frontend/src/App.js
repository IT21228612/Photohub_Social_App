// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// User - Item Display, Order
import PostsWall from "./components/PostsWall";



function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-grow p-4">
                    <Routes>
                        {/* User - Viewing Items */}
                        <Route path="/inventory" element={<PostsWall />} />
                       
                    </Routes>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
