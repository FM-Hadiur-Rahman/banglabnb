import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-2">BanglaBnB</h2>
          <p className="text-sm text-gray-200">
            Discover unique stays across Bangladesh hosted by real people.
          </p>
          {/* 🔐 Trust Badge */}
          <div className="mt-3 text-xs bg-green-800 px-3 py-1 inline-block rounded-full font-semibold">
            🔒 Verified by National ID
          </div>
        </div>

        {/* Explore */}
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

        {/* Legal */}
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

        {/* Contact + Language + Apps */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <p className="text-sm">📧 help@banglabnb.com</p>
          <p className="text-sm">📱 WhatsApp: +880-1XXX-XXXXXX</p>

          {/* 🌍 Language Selector */}
          <div className="mt-3">
            <label htmlFor="lang" className="text-sm font-medium">
              🌍 Language:
            </label>
            <select
              id="lang"
              className="ml-2 text-black text-sm px-2 py-1 rounded"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          {/* 📱 App Badges */}
          <div className="flex gap-2 mt-4">
            <img
              src="/playstore-badge.png"
              alt="Get it on Google Play"
              className="h-10"
            />
            <img
              src="/appstore-badge.png"
              alt="Download on the App Store"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-200 mt-8 border-t border-green-600 pt-4">
        &copy; {new Date().getFullYear()} BanglaBnB. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
