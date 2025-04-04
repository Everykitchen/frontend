import AppRouter from "./routes/AppRouter";
import NavBar from "./components/NavBar";
import styled from "styled-components";

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
    return (
        <AppContainer>
            <FixedNavBar>
                <NavBar />
            </FixedNavBar>
            <Content>
                <AppRouter />
            </Content>
        </AppContainer>
    );
}

export default App;
