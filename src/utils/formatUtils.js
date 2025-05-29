// 전화번호 포맷팅 함수
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return { p1: '', p2: '', p3: '' };
    
    // 기존 번호에서 숫자만 추출
    const numbers = phoneNumber.replace(/[^0-9]/g, '');
    
    // 11자리 미만이면 그대로 반환
    if (numbers.length < 11) {
        return {
            p1: numbers.substring(0, 3),
            p2: numbers.substring(3, 7),
            p3: numbers.substring(7, 11)
        };
    }
    
    // 11자리 이상이면 3-4-4 형식으로 분리
    return {
        p1: numbers.substring(0, 3),
        p2: numbers.substring(3, 7),
        p3: numbers.substring(7, 11)
    };
};

// 전화번호 유효성 검사 함수
export const validatePhoneNumber = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) {
        return { isValid: false, message: "전화번호를 모두 입력해주세요." };
    }
    
    if (p1.length !== 3 || p2.length !== 4 || p3.length !== 4) {
        return { isValid: false, message: "전화번호는 3자리-4자리-4자리 형식이어야 합니다." };
    }
    
    if (!/^\d+$/.test(p1) || !/^\d+$/.test(p2) || !/^\d+$/.test(p3)) {
        return { isValid: false, message: "전화번호는 숫자만 입력 가능합니다." };
    }
    
    if (p1 !== '010') {
        return { isValid: false, message: "010으로 시작하는 번호만 입력 가능합니다." };
    }
    
    return { isValid: true, message: "" };
};

// 생년월일 포맷팅 함수
export const formatBirthday = (birthday) => {
    if (!birthday) return { year: '', month: '', day: '' };
    
    // 기존 날짜에서 숫자만 추출
    const numbers = birthday.replace(/[^0-9]/g, '');
    
    return {
        year: numbers.substring(0, 4),
        month: numbers.substring(4, 6),
        day: numbers.substring(6, 8)
    };
};

// 생년월일 유효성 검사 함수
export const validateBirthday = (year, month, day) => {
    if (!year || !month || !day) {
        return { isValid: false, message: "생년월일을 모두 입력해주세요." };
    }
    
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
        return { isValid: false, message: "생년월일은 YYYY-MM-DD 형식이어야 합니다." };
    }
    
    if (!/^\d+$/.test(year) || !/^\d+$/.test(month) || !/^\d+$/.test(day)) {
        return { isValid: false, message: "생년월일은 숫자만 입력 가능합니다." };
    }
    
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);
    
    if (y < 1900 || y > new Date().getFullYear()) {
        return { isValid: false, message: "올바른 연도를 입력해주세요." };
    }
    
    if (m < 1 || m > 12) {
        return { isValid: false, message: "올바른 월을 입력해주세요." };
    }
    
    const lastDay = new Date(y, m, 0).getDate();
    if (d < 1 || d > lastDay) {
        return { isValid: false, message: "올바른 일을 입력해주세요." };
    }
    
    return { isValid: true, message: "" };
}; 