import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import mapPlaceholder from "../../assets/jpg/map.jpg";
import starIcon from "../../assets/icons/starIcon.svg";

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

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
    font-size: 18px;
    font-weight: bold;
    border: none;
    background: none;
    cursor: pointer;
    color: ${(props) => (props.active ? "black" : "#aaa")};
    border-bottom: ${(props) => (props.active ? "3px solid #ffbc39" : "none")};
`;

const SectionTitle = styled.h2`
    font-size: 22px;
    font-weight: bold;
    margin: 50px 0 16px;
    text-align: left;
`;

const Box = styled.div`
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 24px;
    background-color: #fff;
    text-align: left;
`;

const MapImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 12px;
`;

const InfoTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;

    td {
        border: 1px solid #ddd;
        padding: 10px;
        line-height: 1.3;
    }

    td:first-child {
        width: 20%;
        background-color: #f7f7f7;
        font-weight: bold;
    }
`;

const ReviewCard = styled.div`
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 8px;
    background-color: #fdfdfd;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StarIcon = styled.img`
    width: 14px;
    margin-right: 4px;
`;

const Paragraph = styled.p`
    line-height: 1.7;
    margin-bottom: 12px;
`;

const StrongText = styled.strong`
    font-weight: bold;
    display: inline-block;
    margin-bottom: 10px;
`;

const InfoSection = ({ selectedTab, setSelectedTab, sections }) => {
    const REVIEWS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const reviews = [
        {
            name: "박세연",
            stars: 5,
            content:
                "공간이 정말 깔끔하고 정돈돼 있어서 기분 좋게 이용했어요. 친구들이랑 생일 파티했는데 조리부터 식사까지 너무 편하고 좋았습니다. 재방문 의사 있어요!",
        },
        {
            name: "김도윤",
            stars: 4,
            content:
                "적당한 인원 수에 딱 맞는 크기, 그리고 조용한 분위기가 좋아요. 청결 상태도 만족스럽고, 재료도 넉넉해서 요리에 집중할 수 있었어요.",
        },
        {
            name: "이하은",
            stars: 5,
            content:
                "기본 재료가 다양하고 품질도 좋아서 베이킹에 최적화된 공간이었어요. 디저트 클래스 열기에 완벽한 장소입니다. 다음엔 촬영도 해보고 싶어요!",
        },
        {
            name: "장민재",
            stars: 5,
            content:
                "호스트 분도 친절하고, 위치도 찾아가기 쉬웠어요. 주방기구 종류가 많아서 요리 초보자도 편하게 쓸 수 있어요!",
        },
        {
            name: "이수정",
            stars: 4,
            content:
                "조리 공간이 넓고 자연광이 들어와서 사진 찍기에도 정말 좋아요. 재료가 신선해서 만족했습니다.",
        },
    ];

    // 스크롤 시 탭 자동 활성화
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible && visible.target.dataset.tab) {
                    setSelectedTab(visible.target.dataset.tab);
                }
            },
            {
                rootMargin: "-40% 0px -55% 0px",
                threshold: 0.1,
            }
        );

        Object.keys(sections).forEach((key) => {
            if (sections[key].current) {
                observer.observe(sections[key].current);
            }
        });

        return () => observer.disconnect();
    }, [sections, setSelectedTab]);

    return (
        <Container>
            <StickyTabNav>
                <TabNav>
                    {Object.keys(sections).map((tab) => (
                        <TabItem
                            key={tab}
                            active={selectedTab === tab}
                            onClick={() => {
                                setSelectedTab(tab);
                                sections[tab].current?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                        >
                            {tab}
                        </TabItem>
                    ))}
                </TabNav>
            </StickyTabNav>

            {/* 공간정보 */}
            <SectionTitle ref={sections["공간정보"]} data-tab="공간정보">
                공간정보
            </SectionTitle>
            <Paragraph>
                이국적인 이태원의 중심 상업지역에 위치한 ‘오버지 쿠킹스튜디오’는
                요리를 사랑하는 모든 이들의 요리 공간입니다. 따뜻한 조명 아래,
                현대적이면서도 감성적인 분위기가 물씬 풍기는 공간으로, 각종
                클래스나 모임에도 적합하게 설계되어 있습니다.
            </Paragraph>
            <MapImage src={mapPlaceholder} alt="지도 API 자리" />
            <InfoTable>
                <tbody>
                    <tr>
                        <td>위치</td>
                        <td>서울특별시 은평구 응암동 123-4</td>
                    </tr>
                    <tr>
                        <td>면적</td>
                        <td>약 30평 (99㎡)</td>
                    </tr>
                    <tr>
                        <td>기준 인원</td>
                        <td>4명</td>
                    </tr>
                    <tr>
                        <td>최대 인원</td>
                        <td>10명</td>
                    </tr>
                    <tr>
                        <td>영업 시간</td>
                        <td>매일 10:00 ~ 22:00</td>
                    </tr>
                </tbody>
            </InfoTable>

            {/* 시설정보 */}
            <SectionTitle ref={sections["시설정보"]} data-tab="시설정보">
                시설정보
            </SectionTitle>
            <Box>
                <StrongText>조리대</StrongText>
                <Paragraph>
                    고급 대리석 상판을 갖춘 이케아 조리대 1개(3.2m)와 넉넉한
                    작업 공간을 제공하는 대리석 작업대 1개(2m)가 마련되어 있어
                    다양한 조리 활동이 가능합니다.
                </Paragraph>
            </Box>
            <Box>
                <StrongText>인덕션</StrongText>
                <Paragraph>
                    삼성 3구 인덕션은 고화력으로 조리가 빠르며, 안전 센서가
                    탑재되어 초보자도 쉽게 사용할 수 있습니다.
                </Paragraph>
            </Box>
            <Box>
                <StrongText>조리도구</StrongText>
                <Paragraph>
                    이동식 테이블, 휘핑볼, 타올, 계량컵, 전자저울, 온도계,
                    스패출라 등 다양한 도구가 완비되어 있으며, 위생적으로
                    관리되고 있습니다.
                </Paragraph>
            </Box>
            <Box>
                <StrongText>구비품목</StrongText>
                <Paragraph>
                    위생장갑, 키친타올, 종이호일, 물티슈 등 소모품도 충분히
                    구비되어 있어 사용 중 불편함이 없습니다.
                </Paragraph>
            </Box>

            {/* 재료정보 */}
            <SectionTitle ref={sections["재료정보"]} data-tab="재료정보">
                재료정보
            </SectionTitle>
            <Box>
                <StrongText>기본 재료 (1kg)</StrongText>
                <Paragraph>
                    밀가루, 설탕, 소금, 베이킹파우더, 드라이이스트, 초밀가루 등
                    다양한 기본 재료가 준비되어 있어 베이킹이나 요리에 필요한
                    모든 재료를 갖추고 있습니다.
                </Paragraph>
            </Box>
            <Box>
                <StrongText>추가 재료 (10g)</StrongText>
                <Paragraph>
                    코코넛분말, 커피, 말차가루, 크리미트, 분당, 초코칩, 견과류
                    등 고급 재료들도 소분 포장으로 제공되며, 사용 후 정산
                    가능합니다.
                </Paragraph>
            </Box>
            <Box>
                <StrongText>포장 재료</StrongText>
                <Paragraph>
                    딸기잼, 블루베리잼, 견과류, 바닐라익스트랙, 마쉬멜로우,
                    바닐라빈 등 다양한 데코레이션과 포장재도 준비되어 있어
                    완성도 높은 결과물을 만들 수 있습니다.
                </Paragraph>
            </Box>

            {/* 후기 */}
            <SectionTitle ref={sections["후기"]} data-tab="후기">
                후기
            </SectionTitle>
            {reviews
                .slice(
                    (currentPage - 1) * REVIEWS_PER_PAGE,
                    currentPage * REVIEWS_PER_PAGE
                )
                .map((review, idx) => (
                    <ReviewCard key={idx}>
                        <div>
                            <strong>{review.name}</strong>
                            <div
                                style={{
                                    display: "inline-flex",
                                    marginLeft: 8,
                                }}
                            >
                                {[...Array(review.stars)].map((_, i) => (
                                    <StarIcon key={i} src={starIcon} />
                                ))}
                            </div>
                        </div>
                        <Paragraph>{review.content}</Paragraph>
                    </ReviewCard>
                ))}
            <div style={{ display: "flex", gap: "12px", marginTop: 16 }}>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                <span>
                    {currentPage} /{" "}
                    {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(
                                prev + 1,
                                Math.ceil(reviews.length / REVIEWS_PER_PAGE)
                            )
                        )
                    }
                    disabled={
                        currentPage ===
                        Math.ceil(reviews.length / REVIEWS_PER_PAGE)
                    }
                >
                    다음
                </button>
            </div>
        </Container>
    );
};

export default InfoSection;
