import { useState, useEffect } from "react";

const useDaumPostcodeLoader = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (window.daum && window.daum.Postcode) {
            setLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => {
            setLoaded(true);
        };
        document.head.appendChild(script);
    }, []);

    return loaded;
};

export default useDaumPostcodeLoader;
