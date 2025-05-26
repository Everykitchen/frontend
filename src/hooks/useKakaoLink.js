import { useEffect } from "react";

const useKakaoLink = () => {
    useEffect(() => {
        if (!window.Kakao) {
            const script = document.createElement("script");
            script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
            script.async = true;
            script.onload = () => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init("9a180073dedb85e17edee965cd30a89f"); // 실제 키로 교체
                }
            };
            document.head.appendChild(script);
        } else {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init("9a180073dedb85e17edee965cd30a89f"); // 실제 키로 교체
            }
        }
    }, []);
};

export default useKakaoLink;
