/* global kakao, daum */
import { useState, useEffect } from "react";
import useKakaoLoader from "../../../hooks/useKakaoLoader";
import useDaumPostcodeLoader from "../../../hooks/useDaumPostcodeLoader";
import styled from "styled-components";

const Container = styled.div`
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
`;

const FieldGroup = styled.div`
    margin-bottom: 60px;
`;

const RequiredLabel = styled.label`
    font-size: 14px;
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
    color: #d9534f;
    &::after {
        content: " *";
    }
`;

const Label = styled.label`
    font-size: 14px;
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid ${({ isInvalid }) => (isInvalid ? "red" : "#ccc")};
    border-radius: 6px;
    width: 100%;
    margin-bottom: 16px;
    transition: border-color 0.2s ease;
    &:focus {
        outline: none;
        border-color: #ffbc39;
    }
`;

const FileInput = styled.input`
    display: block;
    margin-bottom: 16px;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    resize: vertical;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
    &:focus {
        outline: none;
        border-color: #ffbc39;
    }
`;

const ToggleButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
`;

const ToggleButton = styled.button`
    padding: 8px 20px;
    border: 1px solid #ccc;
    background-color: ${({ active, value }) => 
        active ? (value === 'COOKING' ? '#4CAF50' : '#ffbc39') : 'white'};
    color: ${({ active }) => (active ? "white" : "#333")};
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        border-color: #999;
    }
`;

const Section = styled.div`
    margin-bottom: 50px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    border-bottom: 2px solid #f0ad4e;
    padding-bottom: 6px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    th,
    td {
        text-align: center;
        padding: 6px 12px;
    }
    th {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
`;

const BankRow = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    input,
    select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        height: 40px;
        transition: border-color 0.2s ease;
        &:focus {
            outline: none;
            border-color: #ffbc39;
        }
    }
    select {
        min-width: 100px;
        max-width: 200px;
    }
`;

const Select = styled.select`
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    transition: border-color 0.2s ease;
    &:focus {
        outline: none;
        border-color: #ffbc39;
    }
`;

const NextButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    float: right;
`;

const SearchAddressButton = styled.button`
    background-color: #444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: px;
    font-weight: 500;
    cursor: pointer;
    width: 100px;
    height: 37px;

    &:hover {
        background-color: #666;
    }
`;

const ImagePreviewWrapper = styled.div`
    display: flex;
    gap: 16px;
    margin: 16px 0px;
    flex-wrap: wrap;
`;

const ImageBox = styled.div`
    position: relative;
    border: ${(props) =>
        props.selected ? "3px solid #ffbc39" : "1px solid #ccc"};
    border-radius: 8px;
    padding: 4px;
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(255, 0, 0, 0.8);
    }
`;

const PreviewImage = styled.img`
    width: 120px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
`;

const PreviewText = styled.div`
    text-align: center;
    font-size: 12px;
    margin-top: 4px;
`;

const AddressRow = styled.div`
    display: flex;
    gap: 10px;
    align-items: top;
    margin-bottom: 16px;
`;

const PriceTable = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
`;

const PriceRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
`;

const DayLabel = styled.label`
    width: 50px;
    font-weight: 500;
`;

const PriceInput = styled.input`
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 120px;
    background-color: ${(props) => (props.disabled ? "#f1f1f1" : "white")};
    transition: border-color 0.2s ease;
    &:focus {
        outline: none;
        border-color: #ffbc39;
    }

    // 스피너 제거
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ErrorMessage = styled.span`
    color: #d9534f;
    font-size: 12px;
    margin-left: 8px;
    font-weight: 500;
`;

const SectionTitleWithError = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 6px;
    border-bottom: 2px solid #f0ad4e;
`;

const Title = styled.h3`
    font-size: 16px;
    font-weight: bold;
`;

const CustomCheckbox = styled.input`
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${props => props.checked ? '#ffbc39' : '#ccc'};
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;

    &:checked {
        background-color: #ffbc39;
        &::after {
            content: '✓';
            position: absolute;
            color: white;
            font-size: 14px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
`;

const PriceErrorMessage = styled.span`
    color: #d9534f;
    font-size: 12px;
    position: absolute;
    right: -200px;
    white-space: nowrap;
`;

const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    const phoneRegex = /^\d{3}-?\d{3,4}-?\d{4}$/;
    return phoneRegex.test(phoneNumber);
};

const StepPrice = ({
    formData,
    setFormData,
    nextStep,
    category,
    setCategory,
}) => {
    const kakaoLoaded = useKakaoLoader();
    const daumLoaded = useDaumPostcodeLoader();

    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [representativeImage, setRepresentativeImage] = useState("");
    const [activeDays, setActiveDays] = useState(
        formData.activeDays || ["월", "화", "수", "목", "금", "토", "일"]
    );
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [touched, setTouched] = useState({});

    const toggleDay = (day) => {
        setActiveDays((prev) => {
            const isNowActive = !prev.includes(day);
            const newDays = isNowActive
                ? [...prev, day]
                : prev.filter((d) => d !== day);

            setFormData((prevData) => ({
                ...prevData,
                defaultPrice: {
                    ...prevData.defaultPrice,
                    [day]: {
                        ...prevData.defaultPrice[day],
                        enabled: isNowActive,
                        price: isNowActive
                            ? prevData.defaultPrice?.[day]?.price || ""
                            : "",
                    },
                },
            }));

            return newDays;
        });
    };

    const triggerTimePicker = (e) => {
        e.target.showPicker?.();
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            category,
        }));
    }, [category]);

    // 초기 이미지 설정 (등록 또는 수정 진입 시)
    useEffect(() => {
        if (formData.kitchenImages?.length > 0) {
            setImageFiles(formData.kitchenImages);
        }
    }, [formData.kitchenImages]);

    // 이미지 URL 변환 및 대표 이미지 설정
    useEffect(() => {
        const urls = imageFiles.map((file) =>
            file instanceof File ? URL.createObjectURL(file) : file
        );
        setImageUrls(urls);

        setRepresentativeImage((prev) =>
            urls.includes(prev) ? prev : urls[0] || ""
        );

        setFormData((prev) => ({
            ...prev,
            kitchenImages: imageFiles,
        }));
    }, [imageFiles]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            category,
        }));
    }, [category]);

    useEffect(() => {
        const updatedPrice = {};
        ["월", "화", "수", "목", "금", "토", "일"].forEach((day) => {
            updatedPrice[day] = {
                price: activeDays.includes(day)
                    ? formData.defaultPrice?.[day]?.price ?? ""
                    : "",

                enabled: activeDays.includes(day),
            };
        });

        updatedPrice["공휴일"] = {
            price: formData.defaultPrice?.["공휴일"]?.price ?? "",
            enabled: true,
        };

        setFormData((prev) => ({
            ...prev,
            defaultPrice: updatedPrice,
            activeDays,
        }));
    }, [activeDays]);

    const handlePriceChange = (day, value) => {
        // 숫자만 입력 가능하도록
        if (value === '' || /^\d*$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                defaultPrice: {
                    ...prev.defaultPrice,
                    [day]: {
                        ...prev.defaultPrice[day],
                        price: value,
                    },
                },
            }));
        }
    };

    const handleBlur = (field, value) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        let error = '';
        if (field === 'phoneNumber' && !validatePhoneNumber(value)) {
            error = '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)';
        } else if (field === 'maxClientNumber' && Number(value) < Number(formData.baseClientNumber)) {
            error = '최대 인원은 기준 인원보다 커야 합니다';
        } else if (field === 'closeTime' && value <= formData.openTime) {
            error = '마감 시간은 오픈 시간보다 늦어야 합니다';
        } else if (!validateNumber(value, field)) {
            switch (field) {
                case 'size':
                    error = '0보다 큰 숫자를 입력해주세요';
                    break;
                case 'baseClientNumber':
                case 'maxClientNumber':
                    error = '0 이상의 정수를 입력해주세요';
                    break;
                case 'accountNumber':
                    error = '숫자와 \'-\'만 입력 가능합니다';
                    break;
                default:
                    if (field.startsWith('price_')) {
                        error = '0 이상의 정수를 입력해주세요';
                    }
            }
        }
        
        setValidationErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const validateNumber = (value, field) => {
        if (!value) return false;
        const num = Number(value);
        switch (field) {
            case 'size':
                return !isNaN(num) && num > 0;
            case 'baseClientNumber':
            case 'maxClientNumber':
                return Number.isInteger(num) && num >= 0;
            case 'accountNumber':
                return /^[0-9-]*$/.test(value);
            default:
                if (field.startsWith('price_')) {
                    return Number.isInteger(num) && num >= 0;
                }
                return true;
        }
    };

    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);
        let hasError = false;
        let errorMessage = '';

        // 용량 체크
        const oversizedFile = fileArray.find(file => file.size > 5 * 1024 * 1024);
        if (oversizedFile) {
            errorMessage = '5MB 이하의 이미지만 등록 가능합니다';
            hasError = true;
        }

        // 개수 체크
        if (fileArray.length < 3) {
            errorMessage = '주방 이미지를 3개 이상 첨부해주세요';
            hasError = true;
        }

        setValidationErrors(prev => ({
            ...prev,
            kitchenImages: hasError ? errorMessage : ''
        }));

        if (!hasError) {
            setImageFiles(fileArray);
        }
    };

    const handleRemoveImage = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const categoryOptions = [
        { label: "쿠킹", value: "COOKING" },
        { label: "베이킹", value: "BAKING" },
    ];

    const getCoordsFromAddress = async (address) => {
        if (!kakaoLoaded || !window.kakao || !window.kakao.maps) return;

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const { y, x } = result[0];
                setFormData((prev) => ({
                    ...prev,
                    location: address,
                    latitude: y,
                    longitude: x,
                }));
            }
        });
    };

    const handleAddressSearch = () => {
        if (!daumLoaded || !window.daum?.Postcode) {
            alert("주소 검색 기능이 아직 로드되지 않았습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                setFormData((prev) => ({
                    ...prev,
                    location: fullAddress,
                }));

                if (kakaoLoaded && window.kakao?.maps?.services) {
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.addressSearch(
                        fullAddress,
                        function (result, status) {
                            if (status === kakao.maps.services.Status.OK) {
                                const { y, x } = result[0];
                                setFormData((prev) => ({
                                    ...prev,
                                    latitude: y,
                                    longitude: x,
                                }));
                            }
                        }
                    );
                }
            },
        }).open();
    };

    const validateRequiredFields = () => {
        const newErrors = {};
        let firstInvalidField = null;

        // 기본 필수 입력 검사
        if (!formData.kitchenName) {
            newErrors.kitchenName = '주방명을 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'kitchenName';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = '전화번호를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'phoneNumber';
        }
        if (!formData.description) {
            newErrors.description = '공간 소개글을 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'description';
        }
        if (!formData.location) {
            newErrors.location = '주소를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'location';
        }
        if (!formData.detailAddress) {
            newErrors.detailAddress = '상세 주소를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'detailAddress';
        }
        if (!formData.category) {
            newErrors.category = '분류를 선택해주세요';
            if (!firstInvalidField) firstInvalidField = 'category';
        }

        // 숫자 필드 검증
        if (!formData.size || !validateNumber(formData.size, 'size')) {
            newErrors.size = '0보다 큰 숫자를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'size';
        }
        if (!formData.baseClientNumber || !validateNumber(formData.baseClientNumber, 'baseClientNumber')) {
            newErrors.baseClientNumber = '0 이상의 정수를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'baseClientNumber';
        }
        if (!formData.maxClientNumber || !validateNumber(formData.maxClientNumber, 'maxClientNumber')) {
            newErrors.maxClientNumber = '0 이상의 정수를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'maxClientNumber';
        }
        if (Number(formData.maxClientNumber) < Number(formData.baseClientNumber)) {
            newErrors.maxClientNumber = '최대 인원이 기준 인원보다 작습니다';
            if (!firstInvalidField) firstInvalidField = 'maxClientNumber';
        }

        // 시간 검증
        if (formData.closeTime <= formData.openTime) {
            newErrors.closeTime = '마감 시간은 오픈 시간보다 늦어야 합니다';
            if (!firstInvalidField) firstInvalidField = 'closeTime';
        }

        // 이미지 검증
        if (!formData.kitchenImages || formData.kitchenImages.length === 0) {
            newErrors.kitchenImages = '이미지를 등록해주세요';
            if (!firstInvalidField) firstInvalidField = 'kitchenImages';
        } else if (formData.kitchenImages.length < 3) {
            newErrors.kitchenImages = '주방 이미지를 3개 이상 첨부해주세요';
            if (!firstInvalidField) firstInvalidField = 'kitchenImages';
        }

        // 계좌번호 검증
        if (formData.account?.accountNumber && !/^[0-9-]*$/.test(formData.account.accountNumber)) {
            newErrors.accountInfo = '잘못된 계좌번호 형식입니다';
            if (!firstInvalidField) firstInvalidField = 'accountNumber';
        }

        // 금액 설정 검증
        const hasInvalidPrice = Object.entries(formData.defaultPrice || {}).some(([day, data]) => {
            if (day === '공휴일') return false;
            if (!data.enabled) return false;
            
            // 활성화된 요일의 경우
            const price = data.price;
            // 빈 값이거나 숫자가 아닌 경우
            if (!price || price === '') {
                return true;
            }
            // 숫자로 변환
            const numPrice = Number(price);
            // 정수가 아니거나 0 미만인 경우
            return !Number.isInteger(numPrice) || numPrice < 0;
        });

        if (hasInvalidPrice) {
            newErrors.defaultPrice = '0 이상의 정수를 입력해주세요';
            if (!firstInvalidField) firstInvalidField = 'defaultPrice';
        }

        setValidationErrors(newErrors);

        if (firstInvalidField) {
            alert('항목을 모두 입력하세요');
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (validateRequiredFields()) {
            nextStep();
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        // 분류 선택 시 해당 오류 메시지 제거
        setValidationErrors(prev => ({
            ...prev,
            category: ''
        }));
    };

    return (
        <Container>
            <FieldGroup>
                <Label>주방명 {validationErrors.kitchenName && <ErrorMessage>{validationErrors.kitchenName}</ErrorMessage>}</Label>
                <Input
                    id="kitchenName"
                    placeholder="예: OO 쿠킹스튜디오"
                    value={formData.kitchenName || ""}
                    $isInvalid={!!validationErrors.kitchenName}
                    onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                    onBlur={(e) => handleBlur('kitchenName', e.target.value)}
                />
                <Label>전화번호 {validationErrors.phoneNumber && <ErrorMessage>{validationErrors.phoneNumber}</ErrorMessage>}</Label>
                <Input
                    placeholder="010-0000-0000"
                    value={formData.phoneNumber || ""}
                    $isInvalid={!!validationErrors.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    onBlur={(e) => handleBlur('phoneNumber', e.target.value)}
                />
                <Label>분류 {validationErrors.category && <ErrorMessage>{validationErrors.category}</ErrorMessage>}</Label>
                <ToggleButtons>
                    {categoryOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            active={category === option.value}
                            value={option.value}
                            onClick={() => handleCategoryChange(option.value)}
                        >
                            {option.label}
                        </ToggleButton>
                    ))}
                </ToggleButtons>

                <Label>이미지 등록 {validationErrors.kitchenImages && <ErrorMessage>{validationErrors.kitchenImages}</ErrorMessage>}</Label>
                <FileInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                />
                {imageUrls.length > 0 && (
                    <ImagePreviewWrapper>
                        {imageUrls.map((url, index) => (
                            <ImageBox
                                key={index}
                                selected={imageUrls[0] === url}
                                onClick={() => {
                                    setRepresentativeImage(url);
                                    setImageFiles((prev) => {
                                        const clicked = prev[index];
                                        return [
                                            clicked,
                                            ...prev.filter(
                                                (_, i) => i !== index
                                            ),
                                        ];
                                    });
                                }}
                            >
                                <PreviewImage
                                    src={url}
                                    alt={`uploaded-${index}`}
                                />
                                <PreviewText>
                                    {representativeImage === url
                                        ? "대표 이미지"
                                        : "클릭하여 대표 설정"}
                                </PreviewText>
                                <DeleteButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(index);
                                    }}
                                >
                                    ×
                                </DeleteButton>
                            </ImageBox>
                        ))}
                    </ImagePreviewWrapper>
                )}
                <Label>공간 소개글 {validationErrors.description && <ErrorMessage>{validationErrors.description}</ErrorMessage>}</Label>
                <TextArea
                    placeholder="공간에 대한 소개를 작성해주세요."
                    value={formData.description || ""}
                    $isInvalid={!!validationErrors.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onBlur={(e) => handleBlur('description', e.target.value)}
                />
            </FieldGroup>

            <Section>
                <SectionTitle>공간 정보</SectionTitle>
                <Label>주소지 {validationErrors.location && <ErrorMessage>{validationErrors.location}</ErrorMessage>}</Label>
                <AddressRow>
                    <Input
                        type="text"
                        value={formData.location || ""}
                        readOnly
                        $isInvalid={!!validationErrors.location}
                        onClick={handleAddressSearch}
                        style={{ cursor: 'pointer' }}
                    />
                    <SearchAddressButton onClick={handleAddressSearch}>
                        주소 검색
                    </SearchAddressButton>
                </AddressRow>
                <Label>상세 주소 {validationErrors.detailAddress && <ErrorMessage>{validationErrors.detailAddress}</ErrorMessage>}</Label>
                <Input
                    type="text"
                    value={formData.detailAddress || ""}
                    $isInvalid={!!validationErrors.detailAddress}
                    onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                    onBlur={(e) => handleBlur('detailAddress', e.target.value)}
                />
                {/* 위도/경도는 숨기거나 readonly로 표시 */}
                <Label>위도</Label>
                <Input type="text" value={formData.latitude || ""} readOnly />
                <Label>경도</Label>
                <Input type="text" value={formData.longitude || ""} readOnly />
                <Label>면적(m3) {validationErrors.size && <ErrorMessage>{validationErrors.size}</ErrorMessage>}</Label>
                <Input
                    value={formData.size || ""}
                    $isInvalid={!!validationErrors.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    onBlur={(e) => handleBlur('size', e.target.value)}
                />
                <Label>기준 인원 {validationErrors.baseClientNumber && <ErrorMessage>{validationErrors.baseClientNumber}</ErrorMessage>}</Label>
                <Input
                    value={formData.baseClientNumber || ""}
                    $isInvalid={!!validationErrors.baseClientNumber}
                    onChange={(e) => setFormData({ ...formData, baseClientNumber: e.target.value })}
                    onBlur={(e) => handleBlur('baseClientNumber', e.target.value)}
                />
                <Label>최대 인원 {validationErrors.maxClientNumber && <ErrorMessage>{validationErrors.maxClientNumber}</ErrorMessage>}</Label>
                <Input
                    value={formData.maxClientNumber || ""}
                    $isInvalid={!!validationErrors.maxClientNumber}
                    onChange={(e) => setFormData({ ...formData, maxClientNumber: e.target.value })}
                    onBlur={(e) => handleBlur('maxClientNumber', e.target.value)}
                />
                <Label>오픈 시간 {validationErrors.openTime && <ErrorMessage>{validationErrors.openTime}</ErrorMessage>}</Label>
                <Input
                    type="time"
                    value={formData.openTime || ""}
                    $isInvalid={!!validationErrors.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    onFocus={triggerTimePicker}
                    onBlur={(e) => handleBlur('openTime', e.target.value)}
                />
                <Label>마감 시간 {validationErrors.closeTime && <ErrorMessage>{validationErrors.closeTime}</ErrorMessage>}</Label>
                <Input
                    type="time"
                    value={formData.closeTime || ""}
                    $isInvalid={!!validationErrors.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    onFocus={triggerTimePicker}
                    onBlur={(e) => handleBlur('closeTime', e.target.value)}
                />
                <Label>최소 예약시간 {validationErrors.minReservationTime && <ErrorMessage>{validationErrors.minReservationTime}</ErrorMessage>}</Label>
                <Select
                    value={formData.minReservationTime || ""}
                    $isInvalid={!!validationErrors.minReservationTime}
                    onChange={(e) => setFormData({ ...formData, minReservationTime: e.target.value })}
                    onBlur={(e) => handleBlur('minReservationTime', e.target.value)}
                >
                    {[1, 2, 3, 4, 5].map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}시간
                        </option>
                    ))}
                </Select>
            </Section>

            <Section>
                <SectionTitleWithError>
                    <Title>금액 설정</Title>
                    {validationErrors.defaultPrice && <ErrorMessage>{validationErrors.defaultPrice}</ErrorMessage>}
                </SectionTitleWithError>
                <Label>영업을 하지 않는 요일은 체크박스를 해제하시고, 요일별로 {formData.minReservationTime}시간 기준 금액을 써주세요.</Label>
                <PriceTable>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <PriceRow key={day}>
                            <CustomCheckbox
                                type="checkbox"
                                checked={formData.defaultPrice?.[day]?.enabled || false}
                                onChange={() => toggleDay(day)}
                            />
                            <DayLabel>{day}</DayLabel>
                            <PriceInput
                                type="number"
                                value={formData.defaultPrice?.[day]?.price || ""}
                                onChange={(e) => handlePriceChange(day, e.target.value)}
                                onBlur={(e) => handleBlur(`price_${day}`, e.target.value)}
                                disabled={!formData.defaultPrice?.[day]?.enabled}
                                $isInvalid={!!validationErrors[`price_${day}`]}
                            />
                            <span>원</span>
                        </PriceRow>
                    ))}
                </PriceTable>

                <Label>공휴일 금액</Label>
                <PriceInput
                    type="number"
                    value={formData.defaultPrice?.["공휴일"]?.price || ""}
                    onChange={(e) =>
                        handlePriceChange("공휴일", e.target.value)
                    }
                    placeholder="공휴일 요금"
                />
            </Section>

            <Section>
                <SectionTitleWithError>
                    <Title>계좌정보</Title>
                    {validationErrors.accountInfo && <ErrorMessage>{validationErrors.accountInfo}</ErrorMessage>}
                </SectionTitleWithError>
                <BankRow>
                    <Input
                        id="accountNumber"
                        placeholder="계좌번호"
                        value={formData.account?.accountNumber || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    accountNumber: e.target.value,
                                },
                            })
                        }
                        onBlur={(e) => handleBlur('accountNumber', e.target.value)}
                        $isInvalid={!!validationErrors.accountInfo}
                    />
                    <Input
                        placeholder="예금주명"
                        value={formData.account?.accountHolderName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    accountHolderName: e.target.value,
                                },
                            })
                        }
                    />
                    <Select
                        value={formData.account?.bankName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                account: {
                                    ...formData.account,
                                    bankName: e.target.value,
                                },
                            })
                        }
                    >
                        <option value="">은행 선택</option>
                        <option value="신한은행">신한은행</option>
                        <option value="국민은행">국민은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="농협">농협</option>
                        <option value="IBK기업은행">IBK기업은행</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="케이뱅크">케이뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="SC제일은행">SC제일은행</option>
                        <option value="한국씨티은행">한국씨티은행</option>
                        <option value="대구은행">대구은행</option>
                        <option value="부산은행">부산은행</option>
                        <option value="경남은행">경남은행</option>
                        <option value="전북은행">전북은행</option>
                        <option value="광주은행">광주은행</option>
                        <option value="수협은행">수협은행</option>
                    </Select>
                </BankRow>
            </Section>

            <NextButton onClick={handleNext}>다음</NextButton>
        </Container>
    );
};

export default StepPrice;
