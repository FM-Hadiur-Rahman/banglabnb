import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // ✅ import

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBanner = ({ activeTab, setActiveTab }) => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            className="w-full h sm:h-60 md:h-70 lg:h-75 xl:h-80 object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-12">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {banner.caption || t("hero.default_caption")}
            </motion.h1>

            {banner.link && (
              <motion.button
                onClick={() => navigate(banner.link)}
                className="bg-white text-green-700 px-6 py-2 rounded mt-2 mb-4 hover:bg-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {t("hero.explore_now")}
              </motion.button>
            )}

            <motion.div
              className="space-x-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
              >
                {t("hero.become_host")}
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded"
              >
                {t("hero.find_stay")}
              </Link>
            </motion.div>

            <motion.div
              className="flex justify-center gap-4 mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={() => setActiveTab("stay")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "stay"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                🛏 {t("hero.stay")}
              </button>
              <button
                onClick={() => setActiveTab("ride")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "ride"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                🚗 {t("hero.ride")}
              </button>
            </motion.div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HeroBanner;
