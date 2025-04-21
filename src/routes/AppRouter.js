import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import MyPage from "../pages/user-mypage/MyPage";
import {
    Reservations,
    ReservationDetail,
    Reviews,
} from "../pages/user-mypage/MyPageIndex";
import HostMyPage from "../pages/host-mypage/HostMyPage";

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
            <Route path="/mypage/reviews" element={<Reviews />} />
            <Route path="/host-mypage" element={<HostMyPage />} />
        </Routes>
    );
};

export default AppRouter;
