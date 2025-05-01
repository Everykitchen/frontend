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
import ChatHistory from "../pages/host-mypage/ChatHistory";
import ChattingRoom from "../pages/host-mypage/ChattingRoom";
import MyPage from "../pages/user-mypage/MyPage";

import ProtectedRoute from "./ProtectedRoute";
import {
    MyPage,
    Reservations,
    ReservationDetail,
    Reviews,
} from "../pages/user-mypage/MyPageIndex";
import HostMyPage from "../pages/host-mypage/HostMyPage";
import UserChatHistory from "../pages/user-mypage/ChatHistory";
import UserChattingRoom from "../pages/user-mypage/ChattingRoom";

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

            <Route
                path="/mypage"
                element={
                    <ProtectedRoute allowedType="USER">
                        <MyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/reservations"
                element={
                    <ProtectedRoute allowedType="USER">
                        <Reservations />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/reservations/:id"
                element={
                    <ProtectedRoute allowedType="USER">
                        <ReservationDetail />
                    </ProtectedRoute>
                }
            />
            <Route path="/mypage/reviews" element={<Reviews />} />
            <Route path="/host-mypage" element={<HostMyPage />} />
            <Route path="/host-mypage/reservations" element={<HostReservations />} />
            <Route path="/host-mypage/reservations/:id" element={<HostReservationDetail />} />
            <Route path="/host-mypage/sales" element={<HostSales />} />
            <Route path="/host-mypage/chats" element={<ChatHistory />} />
            <Route path="/host-mypage/chats/:id" element={<ChattingRoom />} />
            <Route path="/mypage/chats" element={<UserChatHistory />} />
            <Route path="/mypage/chats/:id" element={<UserChattingRoom />} />
            <Route
                path="/mypage/reviews"
                element={
                    <ProtectedRoute allowedType="USER">
                        <Reviews />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/host-mypage"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <HostMyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/kitchen-management"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <KitchenManage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/kitchen-form"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <KitchenForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/reservations"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <HostReservations />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/reservations/:id"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <HostReservationDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/sales"
                element={
                    <ProtectedRoute allowedType="HOST">
                        <HostSales />
                    </ProtectedRoute>
                }
            />
            <Route path="/kitchen-detail" element={<KitchenDetailPage />} />
        </Routes>
    );
};

export default AppRouter;
