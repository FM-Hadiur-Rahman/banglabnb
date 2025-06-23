import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBanner = ({ activeTab, setActiveTab }) => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/banners`)
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("❌ Failed to fetch banners", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {banners.map((banner) => (
        <div key={banner._id} className="relative">
          <img
            src={banner.imageUrl}
            alt={banner.caption}
            className="w-full h-[60vh] md:h-[70vh] object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2">
              {banner.caption || "Experience Bangladesh Like Never Before"}
            </h1>

            {banner.link && (
              <button
                onClick={() => navigate(banner.link)}
                className="bg-white text-green-700 px-6 py-2 rounded mt-2 mb-4 hover:bg-gray-100"
              >
                Explore Now
              </button>
            )}

            <div className="space-x-4 mb-4">
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
              >
                Become a Host
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded"
              >
                Find a Stay
              </Link>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setActiveTab("stay")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "stay"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                🛏 Stay
              </button>
              <button
                onClick={() => setActiveTab("ride")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "ride"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                🚗 Ride
              </button>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HeroBanner;
