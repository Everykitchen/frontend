import React, { useState, useRef } from "react";
import styled from "styled-components";
import ImageGallery from "./ImageGallery";
import ReservationSidebar from "./ReservationSidebar";
import InfoSection from "./InfoSection";
import starIcon from "../../assets/icons/starIcon.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px 80px;
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 40px;
    align-items: flex-start;
`;

const LeftSection = styled.div`
    flex: 2;
`;

const KitchenDetailPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [count, setCount] = useState(1);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedTab, setSelectedTab] = useState("공간정보");

    const sections = {
        공간정보: useRef(null),
        시설정보: useRef(null),
        재료정보: useRef(null),
        후기: useRef(null),
    };

    const handleTimeClick = (hour) => {
        if (startTime === null || (startTime !== null && endTime !== null)) {
            setStartTime(hour);
            setEndTime(null);
        } else if (startTime !== null && endTime === null) {
            if (hour > startTime) setEndTime(hour);
            else setStartTime(hour);
        }
    };

    return (
        <Container>
            <ImageGallery />
            <div style={{ marginTop: 40 }} />

            <ContentWrapper>
                <LeftSection>
                    <div style={{ marginBottom: 16 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <h1>소담 쿠킹 스튜디오 메인홀</h1>
                            <img
                                src={shareIcon}
                                alt="공유"
                                style={{ width: 20, height: 20 }}
                            />
                        </div>
                    </div>
                    <div style={{ margin: "8px 0", lineHeight: "1.4" }}>
                        <div>서울 은평구</div>
                        <div>40,000원 / 1시간 [3시간부터]</div>
                        <div
                            style={{
                                marginTop: 4,
                                fontSize: 14,
                                color: "#555",
                            }}
                        >
                            <img
                                src={starIcon}
                                alt="star"
                                style={{ width: 14, marginRight: 4 }}
                            />
                            4.5 | 후기 (2)
                        </div>
                    </div>

                    <InfoSection
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        sections={sections}
                    />
                </LeftSection>

                <ReservationSidebar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    count={count}
                    setCount={setCount}
                    startTime={startTime}
                    endTime={endTime}
                    handleTimeClick={handleTimeClick}
                />
            </ContentWrapper>
        </Container>
    );
};

export default KitchenDetailPage;
