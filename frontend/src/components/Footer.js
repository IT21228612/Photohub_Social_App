import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-6">
      <p>© {new Date().getFullYear()} HomeStock ~ Home Inventory Management Systems. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
