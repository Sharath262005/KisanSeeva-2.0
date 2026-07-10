import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { KSButton } from "../ui";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-green-700"
        >
          🚜 KisanSeeva
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">

          <a href="#services" className="hover:text-green-700 transition">
            Services
          </a>

          <a href="#features" className="hover:text-green-700 transition">
            Features
          </a>

          <a href="#about" className="hover:text-green-700 transition">
            About
          </a>

          <a href="#contact" className="hover:text-green-700 transition">
            Contact
          </a>

        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">

          <Link
            to="/login"
            className="border border-green-700 text-green-700 px-5 py-2 rounded-lg hover:bg-green-50 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Register
          </Link>

        </div>

        {/* Mobile */}
        <KSButton variant="outline" className="md:hidden p-2">
          <Menu size={24} />
        </KSButton>

      </div>
    </nav>
  );
}

export default Navbar;