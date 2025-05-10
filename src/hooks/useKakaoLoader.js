import { useEffect, useState } from "react";

const useKakaoLoader = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9a180073dedb85e17edee965cd30a89f&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setLoaded(true);
            });
        };
        document.head.appendChild(script);
    }, []);

    return loaded;
};

export default useKakaoLoader;
