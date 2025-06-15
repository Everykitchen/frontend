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

const CenterMarker = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: #FF7926;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #FF7926;
    z-index: 1;
    pointer-events: none;
`;

const KitchenMap = () => {
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showOnlyLiked, setShowOnlyLiked] = useState(false);
    const [sortOption, setSortOption] = useState("distance");
    const [selectedKitchen, setSelectedKitchen] = useState(null);

    const mapRef = useRef(null);
    const markerMap = useRef({});
    const observerRef = useRef(null);
    const debounceTimer = useRef(null);
    const overlayRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const centerCircleRef = useRef(null);

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

    const fetchNearbyKitchens = async (lat, lng, map) => {
        try {
            // 기존 마커 모두 제거
            Object.values(markerMap.current).forEach(marker => {
                if (marker && marker.getMap()) {
                    marker.setMap(null);
                }
            });
            markerMap.current = {};

            const res = await api.get(`/api/kitchens`, {
                params: { lat, lng }
            });
            
            // 새로운 마커 추가
            res.data.forEach((kitchen) => {
                addKitchenMarker(kitchen, map);
            });

            // 3km 반경 원 업데이트
            updateCenterCircle(lat, lng, map);
        } catch (err) {
            console.error("반경 내 주방 조회 실패", err);
        }
    };

    const updateCenterCircle = (lat, lng, map) => {
        if (centerCircleRef.current) {
            centerCircleRef.current.setMap(null);
        }

        // 3km 반경 원 생성 (카카오맵은 미터 단위 사용)
        const circle = new window.kakao.maps.Circle({
            center: new window.kakao.maps.LatLng(lat, lng),
            radius: 3000,
            strokeWeight: 1,
            strokeColor: '#FF7926',
            strokeOpacity: 0.5,
            strokeStyle: 'dashed',
            fillColor: '#FF7926',
            fillOpacity: 0.05  // 투명도 증가
        });

        circle.setMap(map);
        centerCircleRef.current = circle;
    };

    const clearOverlay = () => {
            if (overlayRef.current) {
                const { overlay, root, container } = overlayRef.current;
                overlay.setMap(null);
                root.unmount();
                container.remove();
                overlayRef.current = null;
            setSelectedKitchen(null);
        }
    };

    const addKitchenMarker = (kitchen, map) => {
        const pos = new window.kakao.maps.LatLng(kitchen.latitude, kitchen.longitude);
        
        const marker = new window.kakao.maps.Marker({
            map,
            position: pos
        });

        markerMap.current[kitchen.id || kitchen.kitchenId] = marker;

        window.kakao.maps.event.addListener(marker, "click", () => {
            clearOverlay();

            const container = document.createElement("div");
            const root = createRoot(container);
            root.render(
                <KitchenInfo
                    kitchen={kitchen}
                    onClose={clearOverlay}
                    onDetailClick={() => {
                        window.location.href = `/kitchen/${kitchen.id || kitchen.kitchenId}`;
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
            setSelectedKitchen(kitchen);
        });
    };

    const initMap = (lat, lng) => {
        const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 4,
        });
        setMapInstance(map);

        // 초기 주방 목록 로드
        fetchNearbyKitchens(lat, lng, map);

        // 지도 이동 시작할 때 오버레이 제거
        window.kakao.maps.event.addListener(map, "dragstart", clearOverlay);
        
        // 지도 이동 시 주방 목록 업데이트 (드래그 종료 시)
        window.kakao.maps.event.addListener(map, "dragend", () => {
                const center = map.getCenter();
                fetchNearbyKitchens(center.getLat(), center.getLng(), map);
        });

        // 지도 줌 레벨 변경 시 반경 원 업데이트 및 오버레이 제거
        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
            clearOverlay();
            const center = map.getCenter();
            updateCenterCircle(center.getLat(), center.getLng(), map);
        });

        // 지도 클릭 시 오버레이 제거
        window.kakao.maps.event.addListener(map, "click", clearOverlay);
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
            () => initMap(37.32, 127.13)
        );
    }, [loaded]);

    useEffect(() => {
        if (loaded) fetchStores(page);
    }, [page, loaded]);

    const getSortedList = (list) => {
        let filtered = [...list];

        if (showOnlyLiked) {
            filtered = filtered.filter((k) => k.liked);
        }

        switch (sortOption) {
            case "rating":
                filtered.sort((a, b) => (b.avgStar || 0) - (a.avgStar || 0));
                break;
            case "review":
                filtered.sort(
                    (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
                );
                break;
            case "distance":
            default:
                break;
        }

        return filtered;
    };

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

    const handleKitchenClick = (kitchen) => {
        if (!mapInstance) return;

        clearOverlay();

        // 위도/경도로 지도 이동
        const position = new window.kakao.maps.LatLng(
            kitchen.latitude,
            kitchen.longitude
        );
        mapInstance.panTo(position);
        mapInstance.setLevel(3);

        // 해당 위치를 기준으로 주변 주방 다시 불러오기
        fetchNearbyKitchens(kitchen.latitude, kitchen.longitude, mapInstance);

        // 해당 위치의 마커가 있다면 클릭 이벤트 발생
        const marker = markerMap.current[kitchen.kitchenId];
        if (marker) {
            window.kakao.maps.event.trigger(marker, 'click');
        }
    };

    return (
        <Layout>
            <MapWrapper>
                {!loaded ? (
                    <LoadingText>지도를 불러오는 중입니다...</LoadingText>
                ) : (
                    <>
                        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
                        {userPosition && mapInstance && (
                            <LocationButton
                                onClick={() => {
                                    const pos = new window.kakao.maps.LatLng(
                                            userPosition.lat,
                                            userPosition.lng
                                    );
                                    mapInstance.panTo(pos);
                                    fetchNearbyKitchens(userPosition.lat, userPosition.lng, mapInstance);
                                }}
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

                {getSortedList(storeList).map((kitchen, i, arr) => {
                    const isLast = i === arr.length - 1;
                    return (
                        <div key={kitchen.kitchenId} ref={isLast ? lastCardRef : null}>
                            <KitchenCard
                                kitchen={kitchen}
                                isactive={selectedKitchen?.kitchenId === kitchen.kitchenId}
                                onClick={() => handleKitchenClick(kitchen)}
                                onLikeToggle={() => handleLikeToggle(kitchen.kitchenId)}
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
