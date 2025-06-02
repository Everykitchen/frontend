import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useKakaoLoader from "../../hooks/useKakaoLoader";
import starIcon from "../../assets/icons/starIcon.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";

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
    border-bottom: 1px solid #ddd;
`;

const TabItem = styled.button`
    font-size: 18px;
    font-weight: bold;
    border: none;
    background: none;
    cursor: pointer;
    color: ${(props) => (props.$active ? "black" : "#aaa")};
    border-bottom: ${(props) => (props.$active ? "3px solid #ffbc39" : "none")};
    padding: 8px 0;
    margin-bottom: -1px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin: 80px 0 20px;
    text-align: left;
    padding-bottom: 16px;
    border-bottom: 1px solid #ddd;
`;

const Box = styled.div`
    padding: 20px 0;
    margin-bottom: 24px;
    text-align: left;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
        padding-bottom: 40px;
        margin-bottom: 40px;
    }
`;

const MapContainer = styled.div`
    width: 100%;
    height: 300px;
    border-radius: 10px;
    overflow: hidden;
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
        font-size: 14px;
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

const ReviewHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-size: 14px;
`;

const ReviewerEmail = styled.strong`
    font-weight: 600;
    margin-right: 18px;
`;

const StarContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ReviewDate = styled.span`
    color: #999;
    font-weight: 400;
    font-size: 12px;
    margin-left: 10px;
`;

const StarIcon = styled.img`
    width: 14px;
    margin-right: 4px;
`;

const EmptyStarIcon = styled(StarIcon)`
    filter: grayscale(100%) opacity(50%);
`;

const Paragraph = styled.p`
    line-height: 1.7;
    margin-bottom: 12px;
`;

const CategoryTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin: 32px 0 16px;
    color: #ffbc39;
`;

const StrongText = styled.strong`
    font-weight: bold;
    display: inline-block;
    margin-bottom: 24px;
    font-size: 16px;
`;

const FacilityHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background: #fcfcfc;
    border-radius: 8px 8px 0 0;

    div,
    h4 {
        flex: 1;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 80%;
            height: 1px;
            background-color: #d2d2d2;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    padding-bottom: 24px;
`;

const FacilityItem = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background: #fcfcfc;

    div,
    h4 {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        color: #333;
    }

    &:last-child {
        padding-bottom: 30px;
    }
`;

const FacilityContainer = styled.div`
    margin-top: 16px;
    background: #fcfcfc;
    border-radius: 8px;
    border: 1px solid #d2d2d2;
    overflow: hidden;
`;

const IngredientHeader = styled.div`
    display: flex;
    padding: 16px;
    background: #fcfcfc;
    padding-bottom: 24px;

    div {
        flex: 1;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        position: relative;

        &:first-child {
            flex: 1;
            text-align: center;
        }

        &:last-child {
            text-align: center;
        }

        &::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 80%;
            height: 1px;
            background-color: #d2d2d2;
            left: 50%;
            transform: translateX(-50%);
        }

        &:not(:last-child)::before {
            content: none;
        }
    }
`;

const IngredientItem = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background: #fcfcfc;

    div {
        flex: 1;
        color: #333;
        font-size: 14px;
        text-align: center;

        &:first-child {
            flex: 1;
            text-align: center;
            font-weight: 500;
        }

        &:last-child {
            text-align: center;
            font-weight: 500;
        }
    }

    &:last-child {
        padding-bottom: 30px;
    }
`;

const IngredientContainer = styled(FacilityContainer)`
    margin-top: 0;
`;

const ToolGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
`;

const ToolItem = styled.div`
    padding: 12px 20px;
    background: rgba(255, 188, 57, 0.15);
    border-radius: 30px;
    font-size: 14px;
    color: #333;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
`;

const PageButton = styled.button`
    padding: 8px 12px;
    border: 1px solid ${(props) => (props.$active ? "#ffbc39" : "#ddd")};
    background-color: ${(props) => (props.$active ? "#ffbc39" : "white")};
    color: ${(props) => (props.$active ? "white" : "#333")};
    border-radius: 4px;
    cursor: pointer;
    font-weight: ${(props) => (props.$active ? "bold" : "normal")};

    &:hover {
        background-color: ${(props) => (props.$active ? "#ffbc39" : "#f5f5f5")};
    }
`;

const TopInfoWrapper = styled.div`
    margin-bottom: 16px;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 80px;
`;

const KitchenName = styled.h1`
    font-size: 32px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: -0.64px;
`;

const ShareButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #ebebeb;
    }
`;

const KitchenInfoLine = styled.div`
    margin: 8px 0;
    line-height: 1.4;
`;

const StarLine = styled.div`
    margin-top: 5px;
    font-size: 14px;
    color: #555;
    display: flex;
    align-items: center;
`;

const InfoSection = ({
    selectedTab,
    setSelectedTab,
    sections,
    kitchenData,
    onShare,
}) => {
    const REVIEWS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(kitchenData.reviews.length / REVIEWS_PER_PAGE);
    const [scrolling, setScrolling] = useState(false);
    const mapRef = useRef(null);

    const loaded = useKakaoLoader();

    useEffect(() => {
        if (
            !loaded ||
            !window.kakao ||
            !window.kakao.maps ||
            !kitchenData ||
            !kitchenData.latitude ||
            !kitchenData.longitude
        )
            return;

        const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(
                kitchenData.latitude,
                kitchenData.longitude
            ),
            level: 4,
        });

        new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(
                kitchenData.latitude,
                kitchenData.longitude
            ),
        });
    }, [loaded, kitchenData]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (!scrolling) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const tab = entry.target.dataset.tab;
                            if (tab) {
                                setSelectedTab(tab);
                            }
                        }
                    });
                }
            },
            {
                rootMargin: "-20% 0px -70% 0px",
                threshold: 0,
            }
        );

        Object.values(sections).forEach((sectionRef) => {
            if (sectionRef.current) {
                observer.observe(sectionRef.current);
            }
        });

        return () => observer.disconnect();
    }, [sections, setSelectedTab, scrolling]);

    const handleTabClick = (tab) => {
        setScrolling(true);
        setSelectedTab(tab);
        sections[tab].current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            setScrolling(false);
        }, 1000);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        sections["후기"].current?.scrollIntoView({ behavior: "smooth" });
    };

    // 별점 평균 계산
    const averageRating = (
        kitchenData.reviews.reduce((acc, curr) => acc + curr.star, 0) /
        kitchenData.reviews.length
    ).toFixed(1);

    return (
        <Container>
            {/* 상단 주방 정보 영역 */}
            <TopInfoWrapper>
                <TopRow>
                    <KitchenName>{kitchenData.kitchenName}</KitchenName>
                    <ShareButton onClick={onShare}>
                        <img
                            src={shareIcon}
                            alt="공유"
                            style={{ width: 20, height: 20 }}
                        />
                    </ShareButton>
                </TopRow>
                <KitchenInfoLine>{kitchenData.location}</KitchenInfoLine>
                <KitchenInfoLine>
                    {kitchenData.defaultPrice[0].price.toLocaleString()}원 ~ /
                    1시간
                </KitchenInfoLine>
                <StarLine>
                    <img
                        src={starIcon}
                        alt="별점"
                        style={{ width: 14, marginRight: 4 }}
                    />
                    {kitchenData.reviews.length > 0
                        ? `${averageRating} | `
                        : ""}
                    후기 ({kitchenData.reviewCount})
                </StarLine>
            </TopInfoWrapper>

            <StickyTabNav>
                <TabNav>
                    {Object.keys(sections).map((tab) => (
                        <TabItem
                            key={tab}
                            $active={selectedTab === tab}
                            onClick={() => handleTabClick(tab)}
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
            <Paragraph>{kitchenData.description}</Paragraph>
            <MapContainer ref={mapRef} />
            <InfoTable>
                <tbody>
                    <tr>
                        <td>위치</td>
                        <td>{kitchenData.location}</td>
                    </tr>
                    <tr>
                        <td>면적</td>
                        <td>{kitchenData.size}m²</td>
                    </tr>
                    <tr>
                        <td>기준 인원</td>
                        <td>{kitchenData.baseClientNumber}명</td>
                    </tr>
                    <tr>
                        <td>최대 인원</td>
                        <td>{kitchenData.maxClientNumber}명</td>
                    </tr>
                    <tr>
                        <td>영업 시간</td>
                        <td>
                            {kitchenData.openTime} - {kitchenData.closeTime}
                        </td>
                    </tr>
                </tbody>
            </InfoTable>

            {/* 시설정보 */}
            <SectionTitle ref={sections["시설정보"]} data-tab="시설정보">
                시설정보
            </SectionTitle>
            <Box>
                <StrongText>주방 시설</StrongText>
                <FacilityContainer>
                    <FacilityHeader>
                        <h4>시설명</h4>
                        <div>수량</div>
                        <div>상세설명</div>
                    </FacilityHeader>
                    {kitchenData.kitchenFacility.map((facility, index) => (
                        <FacilityItem key={index}>
                            <h4>{facility.facilityName}</h4>
                            <div>{facility.amount}개</div>
                            <div>{facility.detail}</div>
                        </FacilityItem>
                    ))}
                </FacilityContainer>
            </Box>
            <Box>
                <StrongText>구비 도구</StrongText>
                <ToolGrid>
                    {kitchenData.cookingTool
                        .filter((tool) => tool.check)
                        .map((tool, index) => (
                            <ToolItem key={index}>{tool.name}</ToolItem>
                        ))}
                </ToolGrid>
            </Box>
            <Box>
                <StrongText>제공 물품</StrongText>
                <ToolGrid>
                    {kitchenData.providedItem
                        .filter((item) => item.check)
                        .map((item, index) => (
                            <ToolItem key={index}>{item.name}</ToolItem>
                        ))}
                </ToolGrid>
            </Box>

            {/* 재료정보 */}
            <SectionTitle ref={sections["재료정보"]} data-tab="재료정보">
                재료정보
            </SectionTitle>
            <Box>
                <CategoryTitle>기본재료</CategoryTitle>
                <IngredientContainer>
                    <IngredientHeader>
                        <div>재료명</div>
                        <div>기준 단위</div>
                        <div>금액</div>
                    </IngredientHeader>
                    {kitchenData.ingredients &&
                    kitchenData.ingredients.filter(
                        (ingredient) => !ingredient.additional
                    ).length > 0 ? (
                        kitchenData.ingredients
                            .filter((ingredient) => !ingredient.additional)
                            .map((ingredient, idx) => (
                                <IngredientItem key={idx}>
                                    <div>{ingredient.name}</div>
                                    <div>{ingredient.baseUnit}</div>
                                    <div>
                                        {ingredient.price.toLocaleString()}원
                                    </div>
                                </IngredientItem>
                            ))
                    ) : (
                        <div
                            style={{
                                padding: 16,
                                color: "#888",
                                textAlign: "center",
                            }}
                        >
                            등록된 기본재료가 없습니다.
                        </div>
                    )}
                </IngredientContainer>
            </Box>
            <Box>
                <CategoryTitle>추가재료</CategoryTitle>
                <IngredientContainer>
                    <IngredientHeader>
                        <div>재료명</div>
                        <div>기준 단위</div>
                        <div>금액</div>
                    </IngredientHeader>
                    {kitchenData.ingredients &&
                    kitchenData.ingredients.filter(
                        (ingredient) => ingredient.additional
                    ).length > 0 ? (
                        kitchenData.ingredients
                            .filter((ingredient) => ingredient.additional)
                            .map((ingredient, idx) => (
                                <IngredientItem key={idx}>
                                    <div>{ingredient.name}</div>
                                    <div>{ingredient.baseUnit}</div>
                                    <div>
                                        {ingredient.price.toLocaleString()}원
                                    </div>
                                </IngredientItem>
                            ))
                    ) : (
                        <div
                            style={{
                                padding: 16,
                                color: "#888",
                                textAlign: "center",
                            }}
                        >
                            등록된 추가재료가 없습니다.
                        </div>
                    )}
                </IngredientContainer>
            </Box>

            {/* 후기 */}
            <SectionTitle ref={sections["후기"]} data-tab="후기">
                후기 ({kitchenData.reviewCount})
            </SectionTitle>
            {kitchenData.reviews
                .slice(
                    (currentPage - 1) * REVIEWS_PER_PAGE,
                    currentPage * REVIEWS_PER_PAGE
                )
                .map((review, index) => (
                    <ReviewCard key={index}>
                        <ReviewHeader>
                            <ReviewerEmail>{review.email}</ReviewerEmail>
                            <StarContainer>
                                {[...Array(5)].map((_, i) =>
                                    i < review.star ? (
                                        <StarIcon
                                            key={i}
                                            src={starIcon}
                                            alt="star"
                                        />
                                    ) : (
                                        <EmptyStarIcon
                                            key={i}
                                            src={starIcon}
                                            alt="empty star"
                                        />
                                    )
                                )}
                            </StarContainer>
                            <ReviewDate>
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </ReviewDate>
                        </ReviewHeader>
                        <div>{review.review}</div>
                    </ReviewCard>
                ))}

            {totalPages > 1 && (
                <PaginationContainer>
                    {[...Array(totalPages)].map((_, i) => (
                        <PageButton
                            key={i + 1}
                            $active={currentPage === i + 1}
                            onClick={() => handlePageClick(i + 1)}
                        >
                            {i + 1}
                        </PageButton>
                    ))}
                </PaginationContainer>
            )}
        </Container>
    );
};

export default InfoSection; 