import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Box } from "@chakra-ui/react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BaseSlider = ({ images, speed, slidesToShow, slidesToScroll }) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
  };

  return (
    <Box>
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src.image}
              alt={src.alt}
              style={{
                width: "300px",
                height: "180px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Slider>
    </Box>
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
};

BaseSlider.defaultProps = {
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
};

export default BaseSlider;
