import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import { Reservations } from "../pages/mypage/MyPageIndex";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
        </Routes>
    );
};

export default AppRouter;
