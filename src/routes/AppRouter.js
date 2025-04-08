import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mypage/reservations" element={<MyPage />} />
        </Routes>
    );
};

export default AppRouter;
