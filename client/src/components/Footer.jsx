import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold mb-2">BanglaBnB</h2>
          <p className="text-sm text-gray-200">
            Discover unique places to stay in Bangladesh hosted by real people.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-sm text-gray-100">
            <li>
              <Link to="/listings">Find a Stay</Link>
            </li>
            <li>
              <Link to="/register">Become a Host</Link>
            </li>
            <li>
              <Link to="/help">Help Center</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-sm text-gray-100">
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/refund-policy">Refund Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact / Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <p className="text-sm">📧 help@banglabnb.com</p>
          <p className="text-sm">📱 WhatsApp: +880-1XXX-XXXXXX</p>
          <div className="mt-2 space-x-2">
            {/* Add social icons if needed */}
            <a href="#" className="inline-block hover:text-yellow-300 text-sm">
              Facebook
            </a>
            <a href="#" className="inline-block hover:text-yellow-300 text-sm">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-sm text-gray-200 mt-8 border-t border-green-600 pt-4">
        &copy; {new Date().getFullYear()} BanglaBnB. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
