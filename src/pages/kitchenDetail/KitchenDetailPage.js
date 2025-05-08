import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ImageGallery from "./ImageGallery";
import ReservationSidebar from "./ReservationSidebar";
import InfoSection from "./InfoSection";
import starIcon from "../../assets/icons/starIcon.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px 0px;
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 80px;
    align-items: flex-start;
`;

const LeftSection = styled.div`
    flex: 2;
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

const ShareModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 90%;
    max-width: 400px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const UrlInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 14px;
`;

const CopyButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #ffbc39;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #efac29;
    }
`;

const KitchenDetailPage = () => {
    const { id: kitchenId } = useParams();
    const [kitchen, setKitchen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [count, setCount] = useState(1);
    const [selectedTab, setSelectedTab] = useState("공간정보");
    const [showShareModal, setShowShareModal] = useState(false);

    const sections = {
        공간정보: useRef(null),
        시설정보: useRef(null),
        재료정보: useRef(null),
        후기: useRef(null),
    };

    useEffect(() => {
        if (!kitchenId) return;
        setLoading(true);
        setError(null);
        axios.get(`/api/common/kitchen/${kitchenId}`)
            .then(res => {
                setKitchen(res.data);
                setCount(res.data.baseClientNumber);
            })
            .catch(err => {
                setError("주방 정보를 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));
    }, [kitchenId]);

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('URL이 복사되었습니다.');
                setShowShareModal(false);
            })
            .catch(err => {
                console.error('URL 복사 실패:', err);
                alert('URL 복사에 실패했습니다.');
            });
    };

    if (loading) return <div style={{textAlign:'center',marginTop:100}}>로딩 중...</div>;
    if (error) return <div style={{textAlign:'center',marginTop:100,color:'red'}}>{error}</div>;
    if (!kitchen) return null;

    return (
        <Container>
            <ImageGallery images={kitchen.images} />
            <div style={{ marginTop: 60 }} />
            <ContentWrapper>
                <LeftSection>
                    <InfoSection
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        sections={sections}
                        kitchenData={kitchen}
                        onShare={handleShare}
                    />
                </LeftSection>
                <ReservationSidebar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    count={count}
                    setCount={setCount}
                    kitchenData={kitchen}
                />
            </ContentWrapper>
            {showShareModal && (
                <>
                    <Overlay onClick={() => setShowShareModal(false)} />
                    <ShareModal onClick={e => e.stopPropagation()}>
                        <h3>공유하기</h3>
                        <UrlInput 
                            value={window.location.href} 
                            readOnly 
                        />
                        <CopyButton onClick={handleCopyUrl}>
                            URL 복사하기
                        </CopyButton>
                    </ShareModal>
                </>
            )}
        </Container>
    );
};

export default KitchenDetailPage;
