import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";
import SignupChoicePage from "../pages/signup/SignupChoicePage";
import UserSignupPage from "../pages/signup/UserSignupPage";
import HostSignupPage from "../pages/signup/HostSignupPage";

import HostReservations from "../pages/host-mypage/hostReservations";
import HostReservationDetail from "../pages/host-mypage/HostReservationDetail";
import HostSales from "../pages/host-mypage/HostSales";

import {
    MyPage,
    Reservations,
    ReservationDetail,
    Reviews,
} from "../pages/user-mypage/MyPageIndex";

import {
    HostMyPage,
    KitchenManage,
} from "../pages/host-mypage/HostMyPageIndex";
import KitchenForm from "../pages/host-mypage/kitchen/KitchenForm";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupChoicePage />} />
            <Route path="/signup/user" element={<UserSignupPage />} />
            <Route path="/signup/host" element={<HostSignupPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
            <Route
                path="/mypage/reservations/:id"
                element={<ReservationDetail />}
            />
            <Route path="/mypage/reviews" element={<Reviews />} />
            <Route path="/host-mypage" element={<HostMyPage />} />
            <Route
                path="/host-mypage/kitchen-management"
                element={<KitchenManage />}
            />
            <Route path="/host-mypage/kitchen-form" element={<KitchenForm />} />
            <Route path="/kitchen-detail" element={<KitchenDetailPage />} />
            <Route
                path="/host-mypage/reservations"
                element={<HostReservations />}
            />
            <Route
                path="/host-mypage/reservations/:id"
                element={<HostReservationDetail />}
            />
            <Route path="/host-mypage/sales" element={<HostSales />} />
        </Routes>
    );
};

export default AppRouter;
