import React, { useState } from "react";
import styled from "styled-components";
import kitchenImage from "../../assets/jpg/kitchen1.jpg"; // 기본 이미지

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
  height: 360px;
  width: 100%;
  max-width: 1200px; 
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SubImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
`;

const SubImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
`;

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 기본 이미지로 kitchenImage 사용
  const imageUrls = images.length > 0 ? images : [kitchenImage];
  
  // 필요한 만큼 이미지 반복
  const displayImages = [...imageUrls];
  while (displayImages.length < 5) {
    displayImages.push(displayImages[0]);
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <>
      <ImageGrid>
        <MainImage 
          src={displayImages[0]} 
          alt="대표이미지" 
          onClick={() => handleImageClick(displayImages[0])}
        />
        <SubImages>
          {displayImages.slice(1, 5).map((image, index) => (
            <SubImage
              key={index}
              src={image}
              alt={`주방 이미지 ${index + 2}`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </SubImages>
      </ImageGrid>

      {selectedImage && (
        <Modal onClick={() => setSelectedImage(null)}>
          <CloseButton onClick={() => setSelectedImage(null)}>✕</CloseButton>
          <ModalImage src={selectedImage} alt="확대된 이미지" onClick={(e) => e.stopPropagation()} />
        </Modal>
      )}
    </>
  );
};

export default ImageGallery;
