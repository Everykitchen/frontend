import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import styled from "styled-components";
import GlobalStyle from "./components/GlobalStyle";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { SearchProvider } from "./contexts/SearchContext";

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const FixedNavBar = styled.div`
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
`;

function App() {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const role = decoded.role; // "USER" 또는 "HOST"
                if (role) {
                    localStorage.setItem("role", role);
                }
            } catch (error) {
                console.error("JWT 디코딩 실패:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("refreshToken");
            }
        }
    }, []);

    return (
        <SearchProvider>
            <AppContainer>
                <GlobalStyle />
                <FixedNavBar>
                    <NavBar />
                </FixedNavBar>
                <Content id="main-content">
                    <AppRouter />
                </Content>
            </AppContainer>
        </SearchProvider>
    );
}

export default App;
