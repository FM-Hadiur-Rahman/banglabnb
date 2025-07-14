import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBanner = () => {
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
        <div
          key={banner._id}
          className="relative h-[380px] sm:h-60 md:h-70 lg:h-75 xl:h-80"
        >
          <img
            src={banner.imageUrl}
            alt={banner.caption}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50" />

          <div className="absolute inset-0 z-10 overflow-y-auto py-6 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center text-white text-center">
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-snug"
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
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HeroBanner;
