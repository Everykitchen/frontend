import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import kitchenImage from "../../assets/jpg/kitchen1.jpg"; // 기본 이미지
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GALLERY_HEIGHT = 330;
const IMAGE_WIDTH = 520;
const GAP = 32;

const GalleryWrapper = styled.div`
  width: 100vw;
  max-width: 100vw;
  height: 320px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto 3px auto;
  background: #fff;
`;

const CarouselTrack = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  ${({ animate, offset }) => css`
    transition: ${animate ? 'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)' : 'none'};
    transform: translateX(${offset}px);
  `}
`;

const GalleryImage = styled.img`
  width: ${IMAGE_WIDTH}px;
  max-width: 100vw;
  max-height: ${GALLERY_HEIGHT}px;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  background: #eee;
  margin: 8px;
  z-index: 2;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fcfcfc;
  font-size: 50px;
  z-index: 5;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;
const LeftArrow = styled(ArrowButton)`
  left: 24px;
`;
const RightArrow = styled(ArrowButton)`
  right: 24px;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  width: 500px;
  height: 100%;
  pointer-events: none;
  z-index: 4;
`;
const LeftGradient = styled(GradientOverlay)`
  left: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 100%);
`;
const RightGradient = styled(GradientOverlay)`
  right: 0;
  background: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 100%);
`;

function getDisplayImages(images, current) {
  // Always return 5 images: [prev2, prev, current, next, next2] for infinite carousel
  const total = images.length;
  if (total === 1) return [images[0], images[0], images[0], images[0], images[0]];
  if (total === 2) {
    return [images[1], images[0], images[1], images[0], images[1]];
  }
  if (total === 3) {
    // Repeat for 3 images
    return [images[(current+1)%3], images[(current+2)%3], images[current], images[(current+1)%3], images[(current+2)%3]];
  }
  if (total === 4) {
    return [
      images[(current-2+4)%4],
      images[(current-1+4)%4],
      images[current],
      images[(current+1)%4],
      images[(current+2)%4]
    ];
  }
  // 5 or more
  return [
    images[(current-2+total)%total],
    images[(current-1+total)%total],
    images[current],
    images[(current+1)%total],
    images[(current+2)%total]
  ];
}

const ImageGallery = ({ images = [] }) => {
  const imageUrls = images.length > 0 ? images : [kitchenImage];
  const total = imageUrls.length;
  const [current, setCurrent] = useState(0); // index of center image
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState(0); // -1: left, 1: right, 0: none
  const timeoutRef = useRef();

  // Calculate offset for sliding animation
  const getOffset = () => {
    if (!animating) return 0;
    // Slide left: move track right (+), Slide right: move track left (-)
    return slideDir * -(IMAGE_WIDTH + GAP);
  };

  // Handle slide with animation, then update current index
  const slide = (dir) => {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + dir + total) % total);
      setAnimating(false);
      setSlideDir(0);
    }, 500);
  };

  // Clean up timeout on unmount
  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const displayImages = getDisplayImages(imageUrls, current);

  return (
    <GalleryWrapper>
      <LeftGradient />
      <RightGradient />
      <LeftArrow onClick={() => slide(-1)} aria-label="이전 이미지">
        <FaChevronLeft />
      </LeftArrow>
      <RightArrow onClick={() => slide(1)} aria-label="다음 이미지">
        <FaChevronRight />
      </RightArrow>
      <CarouselTrack animate={animating} offset={getOffset()}>
        {displayImages.map((img, idx) => (
          <GalleryImage key={idx} src={img} alt={`주방 이미지 ${idx}`} draggable={false} />
        ))}
      </CarouselTrack>
    </GalleryWrapper>
  );
};

export default ImageGallery;
