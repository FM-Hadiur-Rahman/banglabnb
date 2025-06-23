// src/components/HeroBanner.jsx
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerImages = [
  "/banner1.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
  "/banner4.jpg",
  "/banner5.jpg",
  "/banner6.jpg",
  "/banner7.jpg",
];

const HeroBanner = ({ activeTab, setActiveTab }) => {
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
      {bannerImages.map((img, index) => (
        <div key={index}>
          <div
            className="min-h-[60vh] md:h-[70vh] bg-cover bg-center flex flex-col items-center justify-center text-white text-center relative px-4 sm:px-6 md:px-12"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="z-10 px-4">
              <h1 className="text-3xl sm:text-xl md:text-4xl font-bold mb-4">
                Experience Bangladesh Like Never Before
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Book unique stays or shared rides with real people.
              </p>

              {/* CTA Buttons */}
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

              {/* Stay/Ride Toggle */}
              <div className="flex justify-center gap-4 mt-4 mb-4">
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
        </div>
      ))}
    </Slider>
  );
};

export default HeroBanner;
