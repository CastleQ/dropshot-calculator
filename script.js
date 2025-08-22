// HTML 문서가 모두 로드되면 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    // [개선] UI 요소들을 하나의 객체로 묶어 관리하여 가독성을 높입니다.
    const uiElements = {
        contractTypeRadios: document.querySelectorAll('input[name="contract-type"]'),
        clientTypeSelect: document.getElementById('client-type'),
        producerTypeSelect: document.getElementById('producer-type'),
        contractAmountInput: document.getElementById('contract-amount'),
        finalAmountDiv: document.getElementById('final-amount'),
        intermediaryDiv: document.getElementById('intermediary'),
    };

    /*
     * [수정] 새로운 계산 규칙을 추가했습니다.
     * 키(key)는 '계약형태-고객사유형-제작사유형' 형식으로 구성됩니다.
     * 값(value)은 계약대금(amount)을 인자로 받는 함수입니다.
     */
    const calculationRules = {
        '2party-corporate-corporate': (amount) => amount * 0.9,
        '2party-corporate-freelancer': (amount) => amount * 0.9, // 신규 추가
        '3party-corporate-corporate': (amount) => amount * 0.9,
        '3party-corporate-freelancer': (amount) => (amount / 1.1) * 0.9 * 0.967,
        '3party-tax-exempt-corporate': (amount) => amount * 0.89,
        '3party-tax-exempt-freelancer': (amount) => (amount * 0.89) * 0.967, // 신규 추가
        // '추가 예정'인 케이스는 여기에 정의하지 않습니다.
    };

    /**
     * [개선] UI 상태를 업데이트하는 함수를 분리하여 단일 책임을 갖도록 합니다.
     */
    function updateUIState(contractType) {
        if (contractType === '2party') {
            uiElements.intermediaryDiv.classList.add('disabled');
            uiElements.intermediaryDiv.textContent = '해당 없음';
        } else {
            uiElements.intermediaryDiv.classList.remove('disabled');
            uiElements.intermediaryDiv.textContent = '드롭샷매치';
        }
    }

    /**
     * [개선] 최종 계산 결과를 화면에 표시하는 함수를 분리했습니다.
     */
    function displayResult(result) {
        if (typeof result === 'number') {
            uiElements.finalAmountDiv.textContent = `${Math.floor(result).toLocaleString()} 원`;
        } else {
            uiElements.finalAmountDiv.textContent = result;
        }
    }

    /**
     * 메인 계산 함수
     */
    function calculate() {
        // 1. 사용자 입력 값 가져오기
        const contractType = document.querySelector('input[name="contract-type"]:checked').value;
        const clientType = uiElements.clientTypeSelect.value;
        const producerType = uiElements.producerTypeSelect.value;
        const contractAmount = parseFloat(uiElements.contractAmountInput.value) || 0;

        // 2. UI 상태 업데이트 (예: 중개사 필드 활성화/비활성화)
        updateUIState(contractType);

        // 3. [개선] 규칙 객체를 사용하여 계산 로직을 찾습니다.
        const ruleKey = `${contractType}-${clientType}-${producerType}`;
        const rule = calculationRules[ruleKey];

        // 4. 계산 실행 및 결과 표시
        if (rule) {
            const finalAmount = rule(contractAmount);
            displayResult(finalAmount);
        } else {
            // 정의된 규칙이 없는 경우 '추가 예정'으로 처리
            displayResult('추가 예정');
        }
    }

    /**
     * [개선] 이벤트 리스너를 등록하는 부분을 함수로 묶어 관리합니다.
     */
    function setupEventListeners() {
        const elementsToListen = [
            ...uiElements.contractTypeRadios,
            uiElements.clientTypeSelect,
            uiElements.producerTypeSelect,
            uiElements.contractAmountInput
        ];
        
        elementsToListen.forEach(element => {
            const eventType = element.type === 'number' ? 'input' : 'change';
            element.addEventListener(eventType, calculate);
        });
    }

    // 초기화 함수: 스크립트 시작 시 필요한 모든 작업을 실행합니다.
    function init() {
        setupEventListeners();
        calculate(); // 페이지 로드 시 첫 계산 실행
    }

    // 스크립트 실행 시작
    init();
});
