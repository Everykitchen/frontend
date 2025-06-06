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
`;

const ToggleButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
`;

const ToggleButton = styled.button`
    padding: 8px 20px;
    border: 1px solid #ccc;
    background-color: ${({ active }) => (active ? "#ffbc39" : "white")};
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

    // 스피너 제거
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

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
    };

    const handleImageUpload = (files) => {
        const fileArray = Array.from(files).filter(
            (file) => file instanceof File
        );
        setImageFiles(fileArray);
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
        if (!formData.kitchenName) newErrors.kitchenName = true;
        if (!formData.phoneNumber) newErrors.phoneNumber = true;
        if (!formData.description) newErrors.description = true;
        if (!formData.location) newErrors.location = true;
        if (!formData.detailAddress) newErrors.detailAddress = true;
        if (!formData.size) newErrors.size = true;
        if (!formData.baseClientNumber) newErrors.baseClientNumber = true;
        if (!formData.maxClientNumber) newErrors.maxClientNumber = true;
        if (!formData.category) newErrors.category = true;
        if (!formData.kitchenImages || formData.kitchenImages.length === 0)
            newErrors.kitchenImages = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateRequiredFields()) {
            alert("항목을 모두 입력해주세요.");
            return;
        }
        nextStep();
    };

    return (
        <Container>
            <FieldGroup>
                <Label>주방명</Label>
                <Input
                    placeholder="예: OO 쿠킹스튜디오"
                    value={formData.kitchenName || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.kitchenName
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            kitchenName: e.target.value,
                        })
                    }
                />
                <Label>전화번호</Label>
                <Input
                    placeholder="010-0000-0000"
                    value={formData.phoneNumber || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.phoneNumber
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                        })
                    }
                />
                <Label>분류</Label>
                <ToggleButtons>
                    {categoryOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            active={category === option.value}
                            onClick={() => setCategory(option.value)}
                        >
                            {option.label}
                        </ToggleButton>
                    ))}
                </ToggleButtons>

                <Label>이미지 등록</Label>
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
                <Label>공간 소개글</Label>
                <TextArea
                    placeholder="공간에 대한 소개를 작성해주세요."
                    value={formData.description || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.description
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />
            </FieldGroup>

            <Section>
                <SectionTitle>공간 정보</SectionTitle>
                <Label>주소지</Label>
                <AddressRow>
                    <Input
                        type="text"
                        value={formData.location || ""}
                        readOnly
                        $isInvalid={
                            Object.keys(errors).length > 0 && errors.location
                        }
                    />
                    <SearchAddressButton onClick={handleAddressSearch}>
                        주소 검색
                    </SearchAddressButton>
                </AddressRow>
                <Label>상세 주소</Label>
                <Input
                    type="text"
                    value={formData.detailAddress || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.detailAddress
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            detailAddress: e.target.value,
                        })
                    }
                />
                {/* 위도/경도는 숨기거나 readonly로 표시 */}
                <Label>위도</Label>
                <Input type="text" value={formData.latitude || ""} readOnly />
                <Label>경도</Label>
                <Input type="text" value={formData.longitude || ""} readOnly />
                <Label>면적(m3)</Label>
                <Input
                    value={formData.size || ""}
                    $isInvalid={Object.keys(errors).length > 0 && errors.size}
                    onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                    }
                />
                <Label>기준 인원</Label>
                <Input
                    value={formData.baseClientNumber || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 &&
                        errors.baseClientNumber
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            baseClientNumber: e.target.value,
                        })
                    }
                />
                <Label>최대 인원</Label>
                <Input
                    value={formData.maxClientNumber || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.maxClientNumber
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            maxClientNumber: e.target.value,
                        })
                    }
                />
                <Label>오픈 시간</Label>
                <Input
                    type="time"
                    value={formData.openTime || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.openTime
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            openTime: e.target.value,
                        })
                    }
                    onFocus={triggerTimePicker}
                />
                <Label>마감 시간</Label>
                <Input
                    type="time"
                    value={formData.closeTime || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 && errors.closeTime
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            closeTime: e.target.value,
                        })
                    }
                    onFocus={triggerTimePicker}
                />
                <Label>최소 예약시간</Label>
                <Select
                    value={formData.minReservationTime || ""}
                    $isInvalid={
                        Object.keys(errors).length > 0 &&
                        errors.minReservationTime
                    }
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            minReservationTime: e.target.value,
                        })
                    }
                >
                    {[1, 2, 3, 4, 5].map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}시간
                        </option>
                    ))}
                </Select>
            </Section>

            <Section>
                <SectionTitle>금액 설정</SectionTitle>
                <Label>요일별 1시간 기준 금액</Label>
                <PriceTable>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <PriceRow key={day}>
                            <input
                                type="checkbox"
                                checked={
                                    formData.defaultPrice?.[day]?.enabled ||
                                    false
                                }
                                onChange={() => toggleDay(day)}
                            />
                            <DayLabel>{day}</DayLabel>
                            <PriceInput
                                type="number"
                                value={
                                    formData.defaultPrice?.[day]?.price || ""
                                }
                                onChange={(e) =>
                                    handlePriceChange(day, e.target.value)
                                }
                                disabled={
                                    !formData.defaultPrice?.[day]?.enabled
                                }
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
                <SectionTitle>계좌정보</SectionTitle>
                <BankRow>
                    <Input
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
