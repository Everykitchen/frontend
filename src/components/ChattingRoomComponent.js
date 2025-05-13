import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  margin-right: 16px;
  
  &:hover {
    color: #333;
  }
`;

const KitchenName = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : props.isSystem ? 'center' : 'flex-start'};
  margin-bottom: 16px;
  max-width: ${props => props.isSystem ? '100%' : '80%'};
  align-self: ${props => props.isOwn ? 'flex-end' : props.isSystem ? 'center' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background-color: ${props => {
    if (props.isSystem) return '#f0f0f0';
    return props.isOwn ? '#FFBC39' : 'white';
  }};
  color: ${props => {
    if (props.isSystem) return '#666';
    return props.isOwn ? 'white' : '#333';
  }};
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: ${props => props.isSystem ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
  margin-bottom: 4px;
  word-break: break-word;
  font-style: ${props => props.isSystem ? 'italic' : 'normal'};
  font-size: ${props => props.isSystem ? '13px' : '14px'};
  opacity: ${props => props.isSystem ? 0.8 : 1};
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #FFBC39;
  }
`;

const SendButton = styled.button`
  background-color: #FFBC39;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #FFB020;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  
  p {
    margin-top: 16px;
    font-size: 16px;
  }
`;

const ErrorBanner = styled.div`
  background-color: #ff8686;
  color: white;
  padding: 12px 16px;
  text-align: center;
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const DebugButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DebugButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ChattingRoomComponent = ({ isHost }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [kitchenId, setKitchenId] = useState(null);
  const [chattingRoomId, setChattingRoomId] = useState(null);
  const [kitchenName, setKitchenName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const chatContainerRef = useRef(null);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 먼저 localStorage에서 직접 userId 가져오기
    const userId = localStorage.getItem('userId');
    if (userId && !isNaN(parseInt(userId))) {
      console.log('localStorage에서 가져온 userId:', userId);
      setCurrentUserId(parseInt(userId));
    }
    
    // 토큰 검증 및 정보 추출 로직은 항상 실행
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('토큰 디코딩 결과:', JSON.stringify(decoded, null, 2));
        
        // 토큰의 만료시간 확인
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.error('토큰이 만료되었습니다.', {
            expTime: new Date(decoded.exp * 1000).toISOString(),
            currentTime: new Date(currentTime * 1000).toISOString(),
            diffMinutes: Math.floor((decoded.exp - currentTime) / 60)
          });
          // 토큰 만료 처리 로직 (필요시 추가)
        }
        
        // 토큰에서 이메일(sub) 추출
        const userEmail = decoded.sub;
        
        if (userEmail) {
          console.log('토큰에서 추출한 이메일:', userEmail);
          
          // 이메일을 localStorage에 저장
          localStorage.setItem('userEmail', userEmail);
          
          // 이미 매핑된 이메일-userId가 있는지 확인
          const emailUserIdMap = localStorage.getItem('emailUserIdMap');
          if (emailUserIdMap) {
            try {
              const mappings = JSON.parse(emailUserIdMap);
              if (mappings[userEmail] && !isNaN(parseInt(mappings[userEmail]))) {
                const mappedUserId = parseInt(mappings[userEmail]);
                console.log('매핑에서 찾은 userId:', mappedUserId);
                
                // 이미 userId를 설정하지 않았을 때만 설정
                if (!userId || isNaN(parseInt(userId))) {
                  setCurrentUserId(mappedUserId);
                  localStorage.setItem('userId', mappedUserId.toString());
                }
              }
            } catch (e) {
              console.error('이메일-userId 매핑 파싱 실패:', e);
            }
          }
          
          // 토큰 내부에 userId 필드가 있는지 확인 (custom claim)
          if (decoded.userId && !isNaN(parseInt(decoded.userId))) {
            const tokenUserId = parseInt(decoded.userId);
            console.log('토큰에서 직접 userId 필드 찾음:', tokenUserId);
            
            if (!userId || isNaN(parseInt(userId))) {
              setCurrentUserId(tokenUserId);
              localStorage.setItem('userId', tokenUserId.toString());
            }
            
            // 이메일-userId 매핑 업데이트
            try {
              const existingMap = localStorage.getItem('emailUserIdMap');
              const mappings = existingMap ? JSON.parse(existingMap) : {};
              mappings[userEmail] = tokenUserId;
              localStorage.setItem('emailUserIdMap', JSON.stringify(mappings));
            } catch (e) {
              console.error('이메일-userId 매핑 저장 실패:', e);
            }
          }
        } else {
          console.error('토큰에서 이메일(sub)를 찾을 수 없습니다');
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
    } else {
      console.error('토큰이 없습니다');
    }
  }, []);

  // 초기 설정: URL 파라미터나 location state에서 필요한 ID들을 가져옴
  useEffect(() => {
    const initializeChat = async () => {
      // 기본적인 상태 설정
      let state = { ...location.state };
      
      console.log(`${isHost ? 'Host' : 'User'} ChatRoom location state:`, state);
      
      // location.state가 없으면 초기화
      if (!state) {
        state = {};
      }
      
      // kitchenId 설정
      if (state.kitchenId) {
        console.log('state에서 kitchenId 설정:', state.kitchenId);
        setKitchenId(state.kitchenId);
      } else {
        // URL 쿼리 파라미터에서 kitchenId 찾기 시도
        const urlParams = new URLSearchParams(window.location.search);
        const urlKitchenId = urlParams.get('kitchenId');
        
        if (urlKitchenId && !isNaN(parseInt(urlKitchenId))) {
          const parsedKitchenId = parseInt(urlKitchenId);
          console.log('URL에서 kitchenId 찾음:', parsedKitchenId);
          setKitchenId(parsedKitchenId);
          // state도 업데이트
          state.kitchenId = parsedKitchenId;
        } else {
          // id가 숫자이고 direct가 아닌 경우, chattingRoomId를 설정하고 나중에 API 응답에서 kitchenId 얻을 수 있음
          if (id && id !== 'direct' && !isNaN(parseInt(id))) {
            console.log('id를 chattingRoomId로 설정:', id);
            setChattingRoomId(parseInt(id));
          }
        }
      }
      
      // 직접 URL 접근 시 필요한 정보 가져오기
      if (id === 'direct') {
        // state에 reservationId가 있으면 URL에서 가져올 필요 없음
        let reservationId = state.reservationId;
        
        // state에 reservationId가 없을 경우 URL에서 가져오기 시도
        if (!reservationId) {
          const urlParams = new URLSearchParams(window.location.search);
          reservationId = urlParams.get('reservationId');
          
          if (reservationId) {
            console.log('URL 쿼리 파라미터에서 reservationId 찾음:', reservationId);
            state.reservationId = parseInt(reservationId);
          } else {
            console.log('URL에서 reservationId를 찾을 수 없습니다');
          }
        }
        
        // reservationId를 이용해 예약 정보 가져오기
        if (reservationId) {
          try {
            const reservationUrl = isHost 
              ? `/api/host/reservation/${reservationId}`
              : `/api/user/reservation/${reservationId}`;
            
            console.log('예약 정보 조회 URL:', reservationUrl);
            const reservationResponse = await api.get(reservationUrl);
            const reservationData = reservationResponse.data;
            
            console.log('예약 정보 응답:', reservationData);
            
            // 필수 정보 업데이트
            if (reservationData.kitchenId) {
              state.kitchenId = reservationData.kitchenId;
              setKitchenId(reservationData.kitchenId);
              
              if (reservationData.kitchenName) {
                state.kitchenName = reservationData.kitchenName;
              }
              
              // 상태 업데이트
              navigate(`/${isHost ? 'host-mypage' : 'mypage'}/chats/direct`, {
                replace: true,
                state: state
              });
              
              return; // 리다이렉트 후 초기화 중단
            } else {
              console.error('예약 정보에 kitchenId가 없습니다:', reservationData);
            }
          } catch (err) {
            console.error('예약 정보 조회 중 오류:', err);
          }
        }
      } else if (id && !isNaN(parseInt(id))) {
        // ID가 숫자인 경우 채팅방 ID로 설정
        setChattingRoomId(parseInt(id));
      }
    };
    
    initializeChat();
  }, [id, location.state, navigate, isHost]);

  // kitchenId 또는 chattingRoomId가 있을 때 채팅 내역 로드 또는 채팅방 생성
  useEffect(() => {
    // 이미 로딩 중이면 중복 요청 방지
    if (loading) {
      console.log('이미 로딩 중이므로 채팅 로드를 건너뜁니다');
      return;
    }
    
    // kitchenId와 chattingRoomId 둘 다 없으면 로드 불가
    if (!kitchenId && !chattingRoomId) {
      console.log('kitchenId와 chattingRoomId가 둘 다 없어 채팅 로드를 건너뜁니다:', { kitchenId, chattingRoomId });
      return;
    }
    
    const fetchChatHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // API를 통해 채팅방 생성 또는 조회
        let url;
        let params = new URLSearchParams();
        
        if (isHost) {
          // 호스트 채팅 API 엔드포인트
          url = `/api/host/kitchen/${kitchenId || 0}/chat`;
          
          // 채팅방 ID가 있고 'direct'가 아닌 경우 chattingRoomId를 파라미터로 전송
          if (chattingRoomId && id !== 'direct') {
            params.append('chattingRoomId', chattingRoomId);
          }
          
          // reservationId가 있으면 추가
          if (location.state?.reservationId) {
            params.append('reservationId', location.state.reservationId);
          } else if (!chattingRoomId) {
            // chattingRoomId가 없고 reservationId도 없는 경우에만 에러
            console.error('HOST 채팅방 생성에 필요한 reservationId가 없습니다');
            setError('예약 정보가 없어 채팅방을 생성할 수 없습니다.');
            setLoading(false);
            return;
          }
        } else {
          // 사용자 채팅 API 엔드포인트
          url = `/api/user/kitchen/${kitchenId || 0}/chat`;
          
          // 채팅방 ID가 있고 'direct'가 아닌 경우 chattingRoomId를 파라미터로 전송
          if (chattingRoomId && id !== 'direct') {
            params.append('chattingRoomId', chattingRoomId);
          }
        }
        
        // URL에 쿼리 파라미터 추가
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
        
        console.log('API 요청 정보:', {
          url,
          kitchenId,
          isHost,
          chattingRoomId,
          params: Object.fromEntries(params.entries())
        });
        
        console.log('채팅방 API 요청 URL:', url);
        
        // API 요청 헤더에 Authorization 토큰 확인
        const token = localStorage.getItem('token');
        console.log('Authorization 토큰 확인:', token ? '토큰 있음' : '토큰 없음');
        
        const response = await api.get(url);
        console.log('API 응답:', response.data);
        
        // 응답에서 필요한 정보 설정
        setKitchenName(response.data.kitchenName || location.state?.kitchenName || '');
        setMessages(response.data.chattingHistory || []);
        
        // 채팅방 ID 설정
        if (response.data.chattingRoomId) {
          const newChattingRoomId = response.data.chattingRoomId;
          setChattingRoomId(newChattingRoomId);
          
          console.log('채팅방 생성/조회 성공:', {
            chattingRoomId: newChattingRoomId,
            kitchenId,
            responseData: response.data
          });
          
          // API 응답에서 사용자 ID 추출 및 캐싱
          if (response.data.hostId && response.data.clientId) {
            const hostId = response.data.hostId;
            const clientId = response.data.clientId;
            
            // 현재 이메일 가져오기
            const userEmail = localStorage.getItem('userEmail');
            
            // 현재 사용자 ID 찾기 (isHost 여부에 따라)
            const myUserId = isHost ? hostId : clientId;
            
            // 이메일-userId 매핑 저장
            if (userEmail && myUserId) {
              try {
                // 기존 매핑 가져오기
                const existingMapStr = localStorage.getItem('emailUserIdMap') || '{}';
                const emailUserIdMap = JSON.parse(existingMapStr);
                
                // 새 매핑 추가
                emailUserIdMap[userEmail] = myUserId;
                
                // 매핑 저장
                localStorage.setItem('emailUserIdMap', JSON.stringify(emailUserIdMap));
                
                // userId 직접 저장
                localStorage.setItem('userId', myUserId.toString());
                
                // 현재 상태 업데이트
                setCurrentUserId(myUserId);
                
                console.log('API 응답에서 userId 캐싱됨:', myUserId);
              } catch (e) {
                console.error('이메일-userId 매핑 저장 실패:', e);
              }
            }
          }
          
          // 'direct' 접근인 경우 URL을 실제 채팅방 ID로 업데이트 (브라우저 히스토리 대체)
          // 단, 이미 같은 ID가 URL에 있는 경우에는 변경하지 않음
          if (id === 'direct' && !window.location.pathname.includes(`/chats/${newChattingRoomId}`)) {
            const path = isHost 
              ? `/host-mypage/chats/${newChattingRoomId}`
              : `/mypage/chats/${newChattingRoomId}`;
            
            console.log('URL 업데이트:', {
              previousPath: window.location.pathname,
              newPath: path
            });
            
            // URL 변경 시 상태 업데이트
            navigate(path, { 
              replace: true,
              state: {
                kitchenId,
                chattingRoomId: newChattingRoomId,
                kitchenName: response.data.kitchenName || location.state?.kitchenName
              }
            });
            
            // URL 변경 후 함수 종료 (useEffect에 의해 다시 호출됨)
            return;
          }
          
          // API 응답에 hostId와 clientId가 없는 경우 처리
          if (!response.data.hostId || !response.data.clientId) {
            console.log('API 응답에 hostId 또는 clientId가 없습니다. 채팅방 ID로만 메시지를 전송합니다.');
            
            // 시스템 메시지 추가 (선택 사항)
            setMessages(prev => [
              ...prev,
              {
                messageId: Date.now(),
                chat: "채팅방에 연결되었습니다. 메시지를 보내보세요.",
                role: "SYSTEM",
                sentAt: new Date().toISOString(),
                isSystem: true
              }
            ]);
          }
        } else {
          console.error('채팅방 ID를 받지 못했습니다. 응답:', response.data);
          setError('채팅방을 생성하지 못했습니다.');
          return;
        }
        
        // 상대방 ID 설정 (웹소켓 메시지용)
        if (response.data.hostId && response.data.clientId) {
          const hostId = response.data.hostId;
          const clientId = response.data.clientId;
          const newReceiverId = isHost ? clientId : hostId;
          console.log(`수신자 ID 설정: ${newReceiverId} (isHost: ${isHost}, hostId: ${hostId}, clientId: ${clientId})`);
          setReceiverId(newReceiverId);
        } else if (location.state && location.state.hostId && location.state.clientId) {
          // API 응답에 ID가 없는 경우 location.state에서 가져오기 시도
          const hostId = location.state.hostId;
          const clientId = location.state.clientId;
          const newReceiverId = isHost ? clientId : hostId;
          console.log(`location.state에서 수신자 ID 설정: ${newReceiverId}`);
          setReceiverId(newReceiverId);
        } else {
          console.log('호스트 ID 또는 클라이언트 ID를 받지 못했습니다. 채팅방 ID로만 메시지를 전송합니다.');
        }
        
        // 웹소켓 연결 (상대방 ID 설정 이후에 연결)
        // 이미 연결된 경우 중복 연결 방지
        if (response.data.chattingRoomId && (!socket || socket.readyState !== WebSocket.OPEN)) {
          console.log(`채팅방 ID: ${response.data.chattingRoomId}로 웹소켓 연결 시도`);
          connectWebSocket(response.data.chattingRoomId);
        } else if (socket && socket.readyState === WebSocket.OPEN) {
          console.log('이미 웹소켓이 연결되어 있습니다.');
        }
        
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        console.error('채팅 내역을 불러오는 데 실패했습니다:', err);
        const errMsg = err.response?.data?.message || err.message || '알 수 없는 오류';
        console.log('오류 메시지:', errMsg);
        console.log('오류 응답:', err.response?.data);
        setError('채팅 내역을 불러오지 못했습니다. 오류: ' + errMsg);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatHistory();
  }, [kitchenId, chattingRoomId, isHost, id, loading, location.state]);
  
  // 컴포넌트 언마운트 시 웹소켓 연결 정리
  useEffect(() => {
    return () => {
      if (socket) {
        console.log('컴포넌트 언마운트: 웹소켓 연결 종료');
        socket.close();
      }
    };
  }, [socket]);
  
  // 웹소켓 연결 함수
  const connectWebSocket = (roomId) => {
    if (!roomId) {
      console.error('웹소켓 연결 실패: roomId가 없습니다', { roomId });
      setError('채팅방 ID가 유효하지 않습니다.');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('웹소켓 연결 실패: 인증 토큰이 없습니다');
      setError('로그인이 필요합니다.');
      return;
    }

    // 토큰 정보 로깅
    try {
      const decoded = jwtDecode(token);
      console.log('WebSocket 연결에 사용되는 토큰 정보:', {
        subject: decoded.sub,
        expiration: new Date(decoded.exp * 1000).toISOString(),
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        remainingTime: Math.floor((decoded.exp - Date.now()/1000)/60) + '분'
      });
    } catch (e) {
      console.error('토큰 파싱 실패:', e);
    }

    // 이미 연결된 소켓이 있다면 닫기
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      console.log('기존 웹소켓 연결을 닫습니다.');
      socket.close();
    }
    
    // 환경에 맞는 웹소켓 URL 구성
    const wsHost = window.location.hostname === 'localhost' ? 
      'localhost:8080' : window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // URL에 필요한 파라미터 추가
    const wsParams = new URLSearchParams();
    wsParams.append('token', token);
    
    // userId가 있으면 추가
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    if (userEmail) {
      wsParams.append('email', userEmail);
      console.log('WebSocket 연결에 이메일 정보 추가:', userEmail);
    }
    
    if (userId) {
      wsParams.append('userId', userId);
      console.log('WebSocket 연결에 userId 정보 추가:', userId);
    }
    
    // 채팅방 ID 추가
    wsParams.append('roomId', roomId);
    
    const wsUrl = `${wsProtocol}//${wsHost}/ws/chat?${wsParams.toString()}`;
    
    console.log('웹소켓 연결 시도:', wsUrl);
    console.log('연결 파라미터:', { 
      roomId, 
      userId: currentUserId || userId, 
      email: userEmail,
      token: token ? `${token.substring(0, 10)}...` : 'none'
    });
    
    try {
      console.log(`WebSocket 상태코드 참고: CONNECTING=${WebSocket.CONNECTING}, OPEN=${WebSocket.OPEN}, CLOSING=${WebSocket.CLOSING}, CLOSED=${WebSocket.CLOSED}`);
      
      const newSocket = new WebSocket(wsUrl);
      
      newSocket.onopen = () => {
        console.log('웹소켓 연결 성공');
        console.log('웹소켓 연결 정보:', {
          roomId,
          currentUserId,
          receiverId,
          readyState: newSocket.readyState,
          timestamp: new Date().toISOString()
        });
        
        setSocket(newSocket);
        
        setMessages(prev => [
          ...prev,
          {
            messageId: Date.now(),
            chat: "채팅 서버에 연결되었습니다.",
            role: "SYSTEM",
            sentAt: new Date().toISOString(),
            isSystem: true
          }
        ]);
      };
      
      newSocket.onmessage = (event) => {
        try {
          console.log('웹소켓 원시 데이터 수신:', event.data);
          const data = JSON.parse(event.data);
          console.log('웹소켓 메시지 파싱 결과:', data);
          
          // 현재 사용자 ID 가져오기 (토큰이나 localStorage에서)
          let userId = currentUserId;
          if (!userId) {
            const localUserId = localStorage.getItem('userId');
            if (localUserId) {
              userId = parseInt(localUserId);
              setCurrentUserId(userId);
            }
          }
          
          // 채팅방 ID 일치 여부 확인
          console.log('메시지와 채팅방 일치 확인:', {
            messageRoomId: data.roomId,
            currentRoomId: roomId,
            parseIntRoomId: parseInt(roomId),
            isMatch: data.roomId === roomId || data.roomId === parseInt(roomId)
          });
          
          // 현재 채팅방에 해당하는 메시지만 표시
          if (data.roomId === roomId || data.roomId === parseInt(roomId)) {
            // 메시지 형식에 맞게 변환하여 추가
            const newMessage = {
              messageId: Date.now(), // 임시 ID
              chat: data.message,
              role: userId && data.senderId === userId ? (isHost ? 'HOST' : 'USER') : (isHost ? 'USER' : 'HOST'),
              sentAt: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, newMessage]);
            setTimeout(() => scrollToBottom(), 100);
          }
        } catch (error) {
          console.error('메시지 파싱 실패:', error, '원본 데이터:', event.data);
          
          // 텍스트가 아닌 데이터인 경우에 대한 처리
          if (typeof event.data !== 'string') {
            console.log('비텍스트 메시지 수신:', event.data);
          }
        }
      };
      
      newSocket.onerror = (error) => {
        console.error('웹소켓 오류:', error);
        console.error('웹소켓 연결 실패 - 상세 정보:', {
          url: wsUrl,
          readyState: newSocket.readyState,
          timestamp: new Date().toISOString()
        });
        
        // 브라우저 콘솔에 오류 정보를 더 자세히 표시
        console.table({
          '연결상태': newSocket.readyState,
          'URL': wsUrl,
          '시간': new Date().toISOString(),
          '채팅방ID': roomId,
          '사용자ID': currentUserId || userId,
          '이메일': userEmail || '없음'
        });
        
        setError('채팅 연결에 실패했습니다.');
      };
      
      newSocket.onclose = (event) => {
        console.log('웹소켓 연결 종료:', event);
        console.log('웹소켓 종료 상세:', {
          code: event.code,
          reason: event.reason || '이유 없음',
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        });
        
        // 오류 코드 설명
        const closeReasons = {
          1000: '정상 종료',
          1001: '엔드포인트 종료 (서버 종료)',
          1002: '프로토콜 오류',
          1003: '잘못된 데이터 형식',
          1005: '상태 코드 없음',
          1006: '비정상적 종료',
          1007: '메시지 타입 불일치',
          1008: '정책 위반',
          1009: '메시지 크기 초과',
          1010: '확장 프로그램 없음',
          1011: '예상치 못한 서버 오류',
          1012: '서비스 재시작',
          1013: '서버 과부하',
          1014: '게이트웨이 타임아웃',
          1015: 'TLS 핸드셰이크 실패'
        };
        
        const reasonDesc = closeReasons[event.code] || '알 수 없는 오류';
        console.log(`WebSocket 종료 코드 ${event.code}: ${reasonDesc}`);
        
        // 오류 코드에 따라 다른 메시지 표시
        if (event.code === 1000) {
          // 정상 종료
          setMessages(prev => [
            ...prev,
            {
              messageId: Date.now(),
              chat: "채팅 서버와의 연결이 종료되었습니다.",
              role: "SYSTEM",
              sentAt: new Date().toISOString(),
              isSystem: true
            }
          ]);
        } else if (event.code === 1006) {
          // 비정상 종료 (가장 흔한 오류)
          setError(`채팅 서버와의 연결이 비정상적으로 끊어졌습니다. 인증이나 서버 상태를 확인해주세요.`);
          
          // 자동 재연결 로직
          console.log('5초 후 연결 재시도...');
          setTimeout(() => {
            if (roomId) {
              console.log('웹소켓 재연결 시도...');
              connectWebSocket(roomId);
            }
          }, 5000);
          
          setMessages(prev => [
            ...prev,
            {
              messageId: Date.now(),
              chat: `채팅 연결 오류: 비정상 종료 (5초 후 재연결 시도)`,
              role: "SYSTEM",
              sentAt: new Date().toISOString(),
              isSystem: true
            }
          ]);
        } else {
          // 기타 오류
          setError(`채팅 서버와의 연결이 끊어졌습니다. 코드: ${event.code} (${reasonDesc})`);
          setMessages(prev => [
            ...prev,
            {
              messageId: Date.now(),
              chat: `채팅 연결 오류 (코드: ${event.code} - ${reasonDesc})`,
              role: "SYSTEM",
              sentAt: new Date().toISOString(),
              isSystem: true
            }
          ]);
        }
      };
      
      setSocket(newSocket);
    } catch (error) {
      console.error('웹소켓 객체 생성 오류:', error);
      setError(`웹소켓 연결 시도 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // 채팅방 ID 확인
    if (!chattingRoomId) {
      console.error('채팅 메시지를 보낼 수 없습니다: 채팅방 ID가 없습니다');
      setError('채팅방이 올바르게 로드되지 않았습니다.');
      return;
    }
    
    // 웹소켓 연결 확인
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('채팅 메시지를 보낼 수 없습니다: 웹소켓 연결 상태 불량', {
        socketExists: !!socket,
        readyState: socket ? socket.readyState : 'socket없음',
        OPEN: WebSocket.OPEN
      });
      
      // 웹소켓이 없거나 연결되지 않은 경우 다시 연결 시도
      console.log('웹소켓 연결이 없거나 열려있지 않아 재연결을 시도합니다');
      connectWebSocket(chattingRoomId);
      
      setError('채팅 서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    try {
      const message = {
        type: 'CHAT',
        roomId: chattingRoomId,
        senderId: currentUserId,
        message: inputMessage
      };
      
      // userId가 없는 경우 localStorage에서 확인
      if (!message.senderId) {
        const localUserId = localStorage.getItem('userId');
        if (localUserId && !isNaN(parseInt(localUserId))) {
          message.senderId = parseInt(localUserId);
        } else {
          console.error('메시지를 보낼 수 없습니다: 사용자 ID가 없습니다');
          setError('사용자 정보를 찾을 수 없습니다.');
          return;
        }
      }
      
      // 수신자 ID가 있으면 추가
      if (receiverId) {
        message.receiverId = receiverId;
      }
      
      console.log('메시지 전송 시도:', message);
      
      // 웹소켓으로 메시지 전송
      socket.send(JSON.stringify(message));
      
      // UI에 내 메시지 추가
      const newMessage = {
        messageId: Date.now(),
        chat: inputMessage,
        role: isHost ? 'HOST' : 'USER',
        sentAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // 입력창 초기화 및 스크롤 조정
      setTimeout(() => scrollToBottom(), 100);
      
      // 동시에 REST API로도 메시지 저장 (선택적, 백엔드 구현에 따라 필요 없을 수 있음)
      try {
        await api.post('/api/chat/message', {
          chattingRoomId: chattingRoomId,
          message: inputMessage
        });
        console.log('메시지가 API를 통해 저장되었습니다');
      } catch (apiError) {
        // REST API 저장 실패해도 웹소켓으로 전송되었으므로 심각한 오류는 아님
        console.warn('API를 통한 메시지 저장 실패:', apiError);
      }
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
      setError(`메시지를 보내는 데 실패했습니다: ${error.message}`);
      
      // 웹소켓 상태 확인
      if (socket) {
        console.log('메시지 전송 실패 후 웹소켓 상태:', {
          readyState: socket.readyState,
          CONNECTING: WebSocket.CONNECTING,
          OPEN: WebSocket.OPEN,
          CLOSING: WebSocket.CLOSING,
          CLOSED: WebSocket.CLOSED
        });
        
        // 연결이 끊어졌으면 재연결 시도
        if (socket.readyState !== WebSocket.OPEN) {
          console.log('웹소켓 연결이 끊어져 재연결을 시도합니다');
          connectWebSocket(chattingRoomId);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleBack = () => {
    navigate(isHost ? '/host-mypage/chats' : '/mypage/chats');
  };

  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  // 웹소켓 상태 디버깅 함수
  const debugConnectionStatus = () => {
    const status = {
      // 기본 연결 정보
      socketExists: !!socket,
      readyState: socket ? socket.readyState : 'socket 없음',
      readyStateDescription: socket ? 
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][socket.readyState] : 'socket 없음',
      
      // 중요 ID 정보
      chattingRoomId,
      currentUserId,
      receiverId,
      
      // 인증 정보
      hasToken: !!localStorage.getItem('token'),
      tokenLength: localStorage.getItem('token') ? localStorage.getItem('token').length : 0,
      
      // 환경 정보
      host: window.location.host,
      protocol: window.location.protocol,
      wsProtocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:',
      
      // 시간 정보
      timestamp: new Date().toISOString()
    };
    
    console.log('웹소켓 연결 상태 디버깅 정보:', status);
    console.table(status);
    
    // 개발 환경에서만 UI에 표시
    if (process.env.NODE_ENV === 'development') {
      setError(`디버깅 정보: ${status.readyStateDescription} (${status.readyState})`);
    }
    
    return status;
  };

  // 웹소켓 문제 해결 시도 함수
  const attemptConnectionFix = () => {
    console.log('웹소켓 연결 문제 해결 시도 시작...');
    
    // 현재 상태 확인
    const status = debugConnectionStatus();
    
    // 로컬스토리지 정보 확인
    console.log('로컬스토리지 키:', Object.keys(localStorage));
    
    // 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰이 없습니다 - 로그인 필요');
      return;
    }
    
    // 채팅방 ID 확인
    if (!chattingRoomId) {
      console.error('채팅방 ID가 없습니다 - 채팅방 정보를 가져올 수 없음');
      return;
    }
    
    // 기존 소켓 정리
    if (socket) {
      try {
        console.log('기존 웹소켓 닫기 시도...');
        socket.close();
        setSocket(null);
      } catch (e) {
        console.error('소켓 종료 오류:', e);
      }
    }
    
    // 3초 후 재연결 시도
    console.log('3초 후 웹소켓 재연결 시도...');
    setTimeout(() => {
      if (chattingRoomId) {
        connectWebSocket(chattingRoomId);
      }
    }, 3000);
  };

  // 컴포넌트 렌더링 이후에 WebSocket 연결 상태 확인
  useEffect(() => {
    // 초기 로딩이 완료되면
    if (!loading && chattingRoomId) {
      // 소켓이 없거나 닫혀있는 경우
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        console.log('초기 렌더링 후 웹소켓 연결 확인: 연결 필요');
        connectWebSocket(chattingRoomId);
      } else if (socket.readyState === WebSocket.OPEN) {
        console.log('초기 렌더링 후 웹소켓 연결 확인: 이미 연결됨');
      }
    }
  }, [loading, chattingRoomId]);

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={handleBack}>← 뒤로</BackButton>
          <KitchenName>로딩 중...</KitchenName>
        </Header>
        <ChatContainer>
          <EmptyState>
            <p>채팅 내역을 불러오고 있습니다...</p>
          </EmptyState>
        </ChatContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={handleBack}>← 뒤로</BackButton>
          <KitchenName>오류 발생</KitchenName>
        </Header>
        <ChatContainer>
          <ErrorBanner>
            {error}
            <DebugButtonsContainer>
              <DebugButton onClick={() => connectWebSocket(chattingRoomId)}>
                재연결 시도
              </DebugButton>
              <DebugButton onClick={debugConnectionStatus}>
                연결 상태 확인
              </DebugButton>
              <DebugButton onClick={attemptConnectionFix}>
                문제 해결
              </DebugButton>
            </DebugButtonsContainer>
          </ErrorBanner>
        </ChatContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          &lt; 뒤로
        </BackButton>
        <KitchenName>{kitchenName || '채팅'}</KitchenName>
      </Header>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebeb',
          color: '#d32f2f',
          padding: '12px 16px',
          textAlign: 'center',
          margin: '0 8px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={() => connectWebSocket(chattingRoomId)}
              style={{
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              재연결 시도
            </button>
            <button
              onClick={debugConnectionStatus}
              style={{
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              연결 상태 확인
            </button>
            <button
              onClick={attemptConnectionFix}
              style={{
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              문제 해결
            </button>
          </div>
        </div>
      )}
      
      <ChatContainer ref={chatContainerRef}>
        {messages.length === 0 ? (
          <EmptyState>
            <p>아직 채팅 내역이 없습니다. 첫 메시지를 보내보세요!</p>
          </EmptyState>
        ) : (
          messages.map((message, index) => {
            const isOwn = isHost ? message.role === 'HOST' : message.role === 'USER';
            return (
              <MessageGroup key={message.messageId || index} isOwn={isOwn} isSystem={message.role === 'SYSTEM'}>
                <MessageBubble isOwn={isOwn} isSystem={message.role === 'SYSTEM'}>
                  {message.chat}
                </MessageBubble>
                <MessageTime>{formatMessageDate(message.sentAt)}</MessageTime>
              </MessageGroup>
            );
          })
        )}
      </ChatContainer>
      
      <InputContainer>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton 
          onClick={handleSendMessage} 
          disabled={!inputMessage.trim() || !chattingRoomId || !socket || socket.readyState !== WebSocket.OPEN}
        >
          →
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChattingRoomComponent; 