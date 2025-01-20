import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, Home, Bell, Settings, User } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 992 && width <= 1600) {
        setScale(0.9);
      } else if (width >= 700 && width <= 767) {
        setScale(0.8);
      } else if (width >= 600 && width < 700) {
        setScale(0.75);
      } else if (width <= 600) {
        setScale(0.5);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="ml-4 text-xl font-semibold">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Settings className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <User className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-screen pt-16">
        {/* Left Menu */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 text-white transition-all duration-300 ${
            isMenuOpen ? 'w-64' : 'w-16'
          }`}
        >
          <div className="p-4">
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <Home className="h-5 w-5" />
                {isMenuOpen && <span>Home</span>}
              </li>
              {/* Add more menu items as needed */}
            </ul>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gray-800 rounded-full p-1 text-white"
          >
            {isMenuOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Main Content</h2>
                  <p className="text-gray-600">
                    This is the main content area. It will adapt based on the screen size and menu state.
                    The entire page will scale according to the viewport width breakpoints.
                  </p>
                </div>
              </div>

              {/* Right Panel */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Right Panel</h3>
                <p className="text-gray-600">
                  This panel contains additional information or widgets.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold">Company Name</h4>
              <p className="text-gray-400">© 2024 All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;