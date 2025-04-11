import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import { Reservations } from "../pages/mypage/index";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";
import SignupChoicePage from "../pages/signup/SignupChoicePage";
import UserSignupPage from "../pages/signup/UserSignupPage";
import HostSignupPage from "../pages/signup/HostSignupPage";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
            <Route path="/kitchen-detail" element={<KitchenDetailPage />} />
            <Route path="/signup" element={<SignupChoicePage />} />
            <Route path="/signup/user" element={<UserSignupPage />} />
            <Route path="/signup/host" element={<HostSignupPage />} />
        </Routes>
    );
};

export default AppRouter;
