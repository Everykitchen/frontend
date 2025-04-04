import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<MyPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
