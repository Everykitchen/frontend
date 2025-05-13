import React, { useEffect } from 'react';
import ChattingRoomComponent from '../../components/ChattingRoomComponent';
import { useLocation } from 'react-router-dom';

const UserChattingRoom = () => {
    const location = useLocation();

    // location.state에서 필요한 정보 로깅 (디버깅용)
    useEffect(() => {
        if (location.state) {
            console.log('User ChatRoom location state:', location.state);
        }
    }, [location.state]);

    return <ChattingRoomComponent isHost={false} />;
};

export default UserChattingRoom; 