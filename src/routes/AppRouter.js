import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";
import SignupChoicePage from "../pages/signup/SignupChoicePage";
import UserSignupPage from "../pages/signup/UserSignupPage";
import HostSignupPage from "../pages/signup/HostSignupPage";
<<<<<<< HEAD
=======
import HostReservations from "../pages/host-mypage/hostReservations";
import HostReservationDetail from "../pages/host-mypage/HostReservationDetail";
import HostSales from "../pages/host-mypage/HostSales";

import MyPage from "../pages/user-mypage/MyPage";
>>>>>>> cccb81b8d150376e1d0c139364eef5fbc9eed5a0
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
<<<<<<< HEAD
            <Route
                path="/host-mypage/kitchen-management"
                element={<KitchenManage />}
            />
            <Route path="/host-mypage/kitchen-form" element={<KitchenForm />} />
            <Route path="/kitchen-detail" element={<KitchenDetailPage />} />
=======
            <Route path="/host-mypage/reservations" element={<HostReservations />} />
            <Route path="/host-mypage/reservations/:id" element={<HostReservationDetail />} />
            <Route path="/host-mypage/sales" element={<HostSales />} />
>>>>>>> cccb81b8d150376e1d0c139364eef5fbc9eed5a0
        </Routes>
    );
};

export default AppRouter;
