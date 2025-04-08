import { createGlobalStyle } from "styled-components";
import reset from "styled-reset"; // 브라우저 기본 스타일 초기화 

const GlobalStyle = createGlobalStyle`
    ${reset}

    /* Noto Sans KR import */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

    * {
        box-sizing: border-box;
        font-family: 'Noto Sans KR', sans-serif;
    }

    body {
        margin: 0;
        padding: 0;
        background-color: #fff;
        color: #222;
        font-size: 16px;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        font-family: inherit;
        cursor: pointer;
        border: none;
        background: none;
    }

    input, textarea {
        font-family: inherit;
    }
`;

export default GlobalStyle;
