import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Box } from "@chakra-ui/react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BaseSlider = ({
  images,
  speed,
  slidesToShow,
  slidesToScroll,
  vertical,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed,
    slidesToShow,
    slidesToScroll,
    vertical: true, // 👈 enables vertical sliding
    verticalSwiping: true, // 👈 allows swipe up/down
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {images.map((src, index) => (
        <div key={index} style={{ margin: "0 auto" }}>
          <img
            src={src.image}
            alt={src.alt}
            style={{
              width: vertical ? "260px" : "390px",
              height: vertical ? "140px" : "180px",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

BaseSlider.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ).isRequired,
  speed: PropTypes.number,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  vertical: PropTypes.bool, // 👈 new
};

BaseSlider.defaultProps = {
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  vertical: false,
};

export default BaseSlider;
