import React, { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import api from "../../api/axiosInstance";
import useKakaoLoader from "../../hooks/useKakaoLoader";
import KitchenCard from "./KitchenCard";
import KitchenInfo from "./KitchenInfo";
import defaultKitchenImage from "../../assets/jpg/kitchen1.jpg";

const Layout = styled.div`
    display: flex;
    height: 100%;
`;

const Sidebar = styled.div`
    width: 400px;
    padding: 16px;
    overflow-y: auto;
    background: #f9f9f9;
    border-left: 1px solid #ddd;
`;

const MapWrapper = styled.div`
    flex: 1;
    position: relative;
`;

const LoadingText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: #888;
`;

const LoadingIndicator = styled.div`
    text-align: center;
    padding: 16px;
    color: #666;
`;

const LocationButton = styled.button`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    &:hover {
        background: #f1f1f1;
    }
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const Select = styled.select`
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const KitchenMap = () => {
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showOnlyLiked, setShowOnlyLiked] = useState(false);
    const [sortOption, setSortOption] = useState("distance");

    const mapRef = useRef(null);
    const markerMap = useRef({});
    const observerRef = useRef(null);
    const debounceTimer = useRef(null);
    const overlayRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [userPosition, setUserPosition] = useState(null);

    const loaded = useKakaoLoader();

    const lastCardRef = useCallback(
        (node) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new window.IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    const fetchStores = async (pageNum = 0) => {
        setLoading(true);
        try {
            const res = await api.get("/api/common/kitchen", {
                params: { page: pageNum, size: 6 },
            });
            const list = Array.isArray(res.data)
                ? res.data
                : res.data.content || [];
            const transformed = list.map((k) => ({
                kitchenId: k.kitchenId ?? k.id,
                kitchenName: k.kitchenName,
                latitude: k.latitude,
                longitude: k.longitude,
                imageUrl: k.imageUrl || defaultKitchenImage,
                location: formatLocation(k.location),
                minPrice: k.minPrice,
                avgStar: k.avgStar,
                reviewCount: k.reviewCount,
                liked: k.liked ?? false,
                category: k.category,
            }));
            setStoreList((prev) =>
                pageNum === 0 ? transformed : [...prev, ...transformed]
            );
            setHasMore(list.length > 0 && !res.data.last);
        } catch (err) {
            console.error("주방 목록 불러오기 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const formatLocation = (loc) => {
        if (!loc) return "";
        const parts = loc.split(" ");
        return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : loc;
    };

    const addKitchenMarker = (k, map) => {
        const pos = new window.kakao.maps.LatLng(k.latitude, k.longitude);
        const marker = new window.kakao.maps.Marker({
            map,
            position: pos,
        });
        markerMap.current[k.kitchenId] = marker;

        window.kakao.maps.event.addListener(marker, "click", () => {
            if (overlayRef.current) {
                const { overlay, root, container } = overlayRef.current;
                overlay.setMap(null);
                root.unmount();
                container.remove();
                overlayRef.current = null;
            }
            const container = document.createElement("div");
            const root = createRoot(container);
            root.render(
                <KitchenInfo
                    kitchen={{
                        kitchenName: k.kitchenName,
                        imageUrl: k.imageUrl || defaultKitchenImage,
                        location: formatLocation(k.location),
                        avgStar: k.avgStar,
                        reviewCount: k.reviewCount,
                        category: k.category,
                        minPrice: k.minPrice,
                    }}
                    onClose={() => {
                        if (overlayRef.current) {
                            const { overlay, root, container } =
                                overlayRef.current;
                            overlay.setMap(null);
                            root.unmount();
                            container.remove();
                            overlayRef.current = null;
                        }
                    }}
                />
            );
            const overlay = new window.kakao.maps.CustomOverlay({
                position: pos,
                content: container,
                xAnchor: 0.5,
                yAnchor: 1.2,
                clickable: true,
            });
            overlay.setMap(map);
            overlayRef.current = { overlay, root, container };

            map.panTo(pos);
        });
    };

    const fetchNearbyKitchens = async (lat, lng, map) => {
        try {
            const res = await api.get(
                `/api/common/kitchen?lat=${lat}&long=${lng}`
            );
            const list = Array.isArray(res.data)
                ? res.data
                : res.data.content || [];
            Object.values(markerMap.current).forEach((m) => m.setMap(null));
            markerMap.current = {};
            list.forEach((k) => addKitchenMarker(k, map));
        } catch (err) {
            console.error("반경 내 주방 조회 실패", err);
        }
    };

    const initMap = (lat, lng) => {
        const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 5,
        });
        setMapInstance(map);

        fetchNearbyKitchens(lat, lng, map);

        window.kakao.maps.event.addListener(map, "idle", () => {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                const center = map.getCenter();
                fetchNearbyKitchens(center.getLat(), center.getLng(), map);
            }, 500);
        });
    };

    useEffect(() => {
        if (!loaded) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUserPosition({
                    lat: coords.latitude,
                    lng: coords.longitude,
                });
                initMap(coords.latitude, coords.longitude);
            },
            () => initMap(37.9, 126.96)
        );
    }, [loaded]);

    useEffect(() => {
        if (loaded) fetchStores(page);
    }, [page, loaded]);

    const handleLikeToggle = async (id) => {
        try {
            await api.post(`/api/user/kitchen/${id}/likes`);
            setStoreList((prev) =>
                prev.map((s) =>
                    s.kitchenId === id ? { ...s, liked: !s.liked } : s
                )
            );
        } catch {
            alert("찜 처리 실패");
        }
    };

    return (
        <Layout>
            <MapWrapper>
                {!loaded ? (
                    <LoadingText>지도를 불러오는 중입니다...</LoadingText>
                ) : (
                    <>
                        <div
                            ref={mapRef}
                            style={{ width: "100%", height: "100%" }}
                        />
                        {userPosition && mapInstance && (
                            <LocationButton
                                onClick={() =>
                                    mapInstance.panTo(
                                        new window.kakao.maps.LatLng(
                                            userPosition.lat,
                                            userPosition.lng
                                        )
                                    )
                                }
                            >
                                현재 위치로
                            </LocationButton>
                        )}
                    </>
                )}
            </MapWrapper>

            <Sidebar>
                <Controls>
                    <div>
                        <label style={{ fontWeight: "bold", marginRight: 8 }}>
                            정렬:
                        </label>
                        <Select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="distance">기본</option>
                            <option value="rating">평점순</option>
                            <option value="review">리뷰 많은 순</option>
                        </Select>
                    </div>
                    <CheckboxLabel>
                        <input
                            type="checkbox"
                            checked={showOnlyLiked}
                            onChange={(e) => setShowOnlyLiked(e.target.checked)}
                        />
                        찜한 주방만 보기
                    </CheckboxLabel>
                </Controls>

                {storeList.map((k, i) => {
                    const isLast = storeList.length === i + 1;
                    return (
                        <div
                            key={k.kitchenId}
                            ref={isLast ? lastCardRef : null}
                        >
                            <KitchenCard
                                kitchen={k}
                                isactive={false}
                                onClick={() => {
                                    const marker =
                                        markerMap.current[k.kitchenId];
                                    if (marker && mapInstance) {
                                        mapInstance.panTo(marker.getPosition());
                                    }
                                }}
                                onLikeToggle={() =>
                                    handleLikeToggle(k.kitchenId)
                                }
                            />
                        </div>
                    );
                })}

                {loading && <LoadingIndicator>로딩 중...</LoadingIndicator>}
                {!hasMore && storeList.length > 0 && (
                    <LoadingIndicator>더 이상 주방이 없습니다</LoadingIndicator>
                )}
            </Sidebar>
        </Layout>
    );
};

export default KitchenMap;
