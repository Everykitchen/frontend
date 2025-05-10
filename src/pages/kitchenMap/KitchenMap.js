import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import api from "../../api/axiosInstance";
import useKakaoLoader from "../../hooks/useKakaoLoader";
import KitchenCard from "./KitchenCard";

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
    height: 100%;
`;

const MapWrapper = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
`;

const LoadingText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
    font-size: 18px;
    color: #888;
`;

const LocationButton = styled.button`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    background-color: #ffffff;
    border: 1px solid #bbb;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f1f1f1;
    }
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Select = styled.select`
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 6px;
`;

const KitchenMap = () => {
    const [showOnlyLiked, setShowOnlyLiked] = useState(false);
    const [sortOption, setSortOption] = useState("distance");
    const mapRef = useRef(null);
    const markerMap = useRef({});
    const cardRefs = useRef({});
    const debounceTimer = useRef(null);

    const [nearbyKitchens, setNearbyKitchens] = useState([]);
    const [selectedKitchen, setSelectedKitchen] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [showLocationButton, setShowLocationButton] = useState(true);

    const loaded = useKakaoLoader();

    useEffect(() => {
        if (!loaded) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserPosition({ lat, lng });
                initMap(lat, lng);
            },
            () => initMap(37.9, 126.96)
        );
    }, [loaded]);

    const initMap = async (lat, lng) => {
        const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 5,
        });
        setMapInstance(map);

        drawUserCircle(map, lat, lng);
        await fetchNearbyKitchens(lat, lng, map);

        window.kakao.maps.event.addListener(map, "idle", () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                const center = map.getCenter();
                fetchNearbyKitchens(center.getLat(), center.getLng(), map);
                setShowLocationButton(true);
            }, 500);
        });
    };

    const drawUserCircle = (map, lat, lng) => {
        const position = new window.kakao.maps.LatLng(lat, lng);

        new window.kakao.maps.Marker({
            map,
            position,
            title: "현재 위치",
        });

        new window.kakao.maps.Circle({
            center: position,
            radius: 3000,
            strokeWeight: 1,
            strokeColor: "#007bff",
            strokeOpacity: 0.7,
            fillColor: "#cce5ff",
            fillOpacity: 0.3,
            map,
        });
    };

    const fetchNearbyKitchens = async (lat, lng, map) => {
        try {
            const res = await api.get(
                `/api/common/kitchen?lat=${lat}&long=${lng}`
            );
            const kitchenList = Array.isArray(res.data)
                ? res.data
                : res.data.content || [];
            const sortedList = [...kitchenList];

            if (userPosition) {
                sortedList.sort((a, b) => {
                    const dist = (lat1, lng1, lat2, lng2) => {
                        const toRad = (val) => (val * Math.PI) / 180;
                        const R = 6371;
                        const dLat = toRad(lat2 - lat1);
                        const dLng = toRad(lng2 - lng1);
                        const aVal =
                            Math.sin(dLat / 2) ** 2 +
                            Math.cos(toRad(lat1)) *
                                Math.cos(toRad(lat2)) *
                                Math.sin(dLng / 2) ** 2;
                        const c =
                            2 *
                            Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
                        return R * c;
                    };
                    const da = dist(
                        userPosition.lat,
                        userPosition.lng,
                        a.latitude,
                        a.longitude
                    );
                    const db = dist(
                        userPosition.lat,
                        userPosition.lng,
                        b.latitude,
                        b.longitude
                    );
                    return da - db;
                });
            }

            if (sortOption === "rating") {
                sortedList.sort((a, b) => b.review - a.review);
            } else if (sortOption === "review") {
                sortedList.sort((a, b) => b.reviewCount - a.reviewCount);
            }

            const filteredList = showOnlyLiked
                ? sortedList.filter((k) => k.isLiked === "yes")
                : sortedList;

            setNearbyKitchens(filteredList);

            Object.values(markerMap.current).forEach((marker) =>
                marker.setMap(null)
            );
            markerMap.current = {};

            kitchenList.forEach((kitchen) => {
                const coords = new window.kakao.maps.LatLng(
                    kitchen.latitude,
                    kitchen.longitude
                );

                const marker = new window.kakao.maps.Marker({
                    map,
                    position: coords,
                });

                markerMap.current[kitchen.kitchenId] = marker;

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:14px;">${kitchen.kitchenName}</div>`,
                });

                window.kakao.maps.event.addListener(marker, "mouseover", () =>
                    infowindow.open(map, marker)
                );
                window.kakao.maps.event.addListener(marker, "mouseout", () =>
                    infowindow.close()
                );
                window.kakao.maps.event.addListener(marker, "click", () => {
                    setSelectedKitchen(kitchen);
                    const el = cardRefs.current[kitchen.kitchenId];
                    if (el)
                        el.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                });
            });
        } catch (err) {
            console.error("주방 재검색 실패:", err);
        }
    };

    const moveToCurrentLocation = () => {
        if (!mapInstance || !userPosition) return;
        const { lat, lng } = userPosition;
        mapInstance.setCenter(new window.kakao.maps.LatLng(lat, lng));
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
                        {showLocationButton && (
                            <LocationButton onClick={moveToCurrentLocation}>
                                현재 위치로
                            </LocationButton>
                        )}
                    </>
                )}
            </MapWrapper>

            <Sidebar>
                <Controls>
                    <div>
                        <label
                            style={{ fontWeight: "bold", marginRight: "8px" }}
                        >
                            정렬:
                        </label>
                        <Select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="distance">거리순</option>
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
                {nearbyKitchens.map((kitchen) => (
                    <div
                        key={kitchen.kitchenId}
                        ref={(el) => (cardRefs.current[kitchen.kitchenId] = el)}
                    >
                        <KitchenCard
                            kitchen={kitchen}
                            isActive={
                                selectedKitchen?.kitchenId === kitchen.kitchenId
                            }
                            onClick={() => {
                                setSelectedKitchen(kitchen);
                                const marker =
                                    markerMap.current[kitchen.kitchenId];
                                if (marker && mapInstance) {
                                    mapInstance.setCenter(marker.getPosition());
                                }
                            }}
                        />
                    </div>
                ))}
            </Sidebar>
        </Layout>
    );
};

export default KitchenMap;
