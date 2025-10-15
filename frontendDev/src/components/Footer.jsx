import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} AI Resume Builder & Job Tracker. All rights reserved.</p>
        <p className="mt-2">
          Made with ❤️ using <span className="text-blue-400">React & Node.js</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
