import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import { Reservations, ReservationDetail } from "../pages/mypage/MyPageIndex";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
            <Route
                path="/mypage/reservations/:id"
                element={<ReservationDetail />}
            />
        </Routes>
    );
};

export default AppRouter;
