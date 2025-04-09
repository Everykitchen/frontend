// InfoSection.js
import React from "react";
import styled from "styled-components";
import mapPlaceholder from "../../assets/jpg/map.jpg";

const StickyTabNav = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  padding-top: 20px;
`;

const TabNav = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
`;

const TabItem = styled.button`
  font-size: 16px;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.active ? "black" : "#aaa")};
  border-bottom: ${(props) => (props.active ? "2px solid #ffbc39" : "none")};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 40px 0 16px;
`;

const Box = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
  background-color: #fff;
`;

const ReviewCard = styled.div`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #fdfdfd;
`;

const MapImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 12px;
`;

const InfoSection = ({ selectedTab, setSelectedTab, sections }) => {
  return (
    <>
      <StickyTabNav>
        <TabNav>
          {Object.keys(sections).map((tab) => (
            <TabItem
              key={tab}
              active={selectedTab === tab}
              onClick={() => {
                setSelectedTab(tab);
                sections[tab].current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {tab}
            </TabItem>
          ))}
        </TabNav>
      </StickyTabNav>

      <SectionTitle ref={sections["공간정보"]}>공간정보</SectionTitle>
      <p>
        이국적인 이태원의 중심 상업지역에 위치한 ‘오버지 쿠킹스튜디오’는 요리를 사랑하는 모든 이들의 요리 공간입니다. 다양한 조리 도구와 쾌적한 주방 환경이 준비되어 있습니다.
      </p>
      <MapImage src={mapPlaceholder} alt="지도 API 자리" />
      <Box>
        <p>위치</p>
        <input type="text" placeholder="주소" style={{ width: "100%", padding: "8px" }} />
        <p>면적</p>
        <input type="text" placeholder="평수" style={{ width: "100%", padding: "8px" }} />
        <p>기준 인원</p>
        <input type="text" placeholder="4명" style={{ width: "100%", padding: "8px" }} />
        <p>최대 인원</p>
        <input type="text" placeholder="10명" style={{ width: "100%", padding: "8px" }} />
        <p>영업 시간</p>
        <input type="text" placeholder="10:00 ~ 22:00" style={{ width: "100%", padding: "8px" }} />
      </Box>

      <SectionTitle ref={sections["시설정보"]}>시설정보</SectionTitle>
      <Box>
        <strong>조리대</strong>
        <p>이케아 조리대 1개 (3.2m)</p>
        <p>대리석 작업대 1개 (2m)</p>
      </Box>
      <Box>
        <strong>인덕션</strong>
        <p>삼성 인덕션 3구</p>
      </Box>
      <Box>
        <strong>조리도구</strong>
        <p>이동식 테이블, 휘핑볼, 타올, 계량컵, 전자저울, 온도계, 스패출라, 각종 사이즈의 도마 등</p>
      </Box>
      <Box>
        <strong>구비품목</strong>
        <p>위생장갑, 키친타올, 종이호일, 물티슈 등</p>
      </Box>

      <SectionTitle ref={sections["재료정보"]}>재료정보</SectionTitle>
      <Box>
        <strong>기본 재료 (1kg)</strong>
        <p>밀가루 2,000원 / 설탕 1,500원 / 소금 1,000원 / 베이킹파우더 1,300원 / 드라이이스트 1,500원 / 초밀가루 2,500원</p>
      </Box>
      <Box>
        <strong>추가 재료 (10g)</strong>
        <p>코코넛분말, 커피, 말차가루, 크리미트, 분당, 초코칩 등</p>
      </Box>
      <Box>
        <strong>포장 재료</strong>
        <p>딸기잼, 블루베리잼, 견과류, 바닐라익스트랙, 마쉬멜로우, 바닐라빈 등</p>
      </Box>

      <SectionTitle ref={sections["후기"]}>후기</SectionTitle>
      <ReviewCard>
        <strong>박세연 ⭐⭐⭐⭐⭐</strong>
        <p>공간이 정말 깔끔하고 정돈돼 있어서 기분 좋게 이용했어요.</p>
      </ReviewCard>
      <ReviewCard>
        <strong>김도윤 ⭐⭐⭐⭐</strong>
        <p>적당한 인원 수에 딱 맞는 크기, 그리고 조용한 분위기가 좋아요.</p>
      </ReviewCard>
      <ReviewCard>
        <strong>이하은 ⭐⭐⭐⭐⭐</strong>
        <p>기본 재료가 정말 다양하게 준비돼 있어 베이킹하기 완벽해요!</p>
      </ReviewCard>
    </>
  );
};

export default InfoSection;
