import React from "react";
import styled from "styled-components";
import kitchenImage from "../../assets/jpg/kitchen1.jpg"; // ← 이미지 경로 맞춰줘

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
  height: 360px; /* 원하는 전체 높이로 조정 */
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
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
  border-radius: 10px;
`;

const ImageGallery = () => {
  return (
    <ImageGrid>
      <MainImage src={kitchenImage} alt="대표이미지" />
      <SubImages>
        <SubImage src={kitchenImage} />
        <SubImage src={kitchenImage} />
        <SubImage src={kitchenImage} />
        <SubImage src={kitchenImage} />
      </SubImages>
    </ImageGrid>
  );
};

export default ImageGallery;
