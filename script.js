// HTML 문서가 모두 로드되면 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    const uiElements = {
        contractTypeRadios: document.querySelectorAll('input[name="contract-type"]'),
        clientTypeSelect: document.getElementById('client-type'),
        producerTypeSelect: document.getElementById('producer-type'),
        contractAmountInput: document.getElementById('contract-amount'),
        finalAmountDiv: document.getElementById('final-amount'),
        intermediaryDiv: document.getElementById('intermediary'),
    };

    /*
     * [수정] 새로운 계산 규칙들을 추가 및 업데이트했습니다.
     */
    const calculationRules = {
        // 양자계약
        '2party-corporate-corporate': (amount) => amount * 0.9,
        '2party-corporate-freelancer': (amount) => amount * 0.9,
        
        // 삼자계약
        '3party-corporate-corporate': (amount) => amount * 0.9,
        '3party-corporate-freelancer': (amount) => (amount / 1.1) * 0.9 * 0.967,
        '3party-corporate-simplified': (amount) => (amount * 0.9) / 1.1,
        '3party-tax-exempt-corporate': (amount) => amount - (amount * 0.1 * 1.1),
        '3party-tax-exempt-freelancer': (amount) => (amount - (amount * 0.1 * 1.1)) * (1 - 0.033),
        
        // '추가 예정'인 케이스는 여기에 정의하지 않습니다.
    };

    function updateUIState(contractType) {
        if (contractType === '2party') {
            uiElements.intermediaryDiv.classList.add('disabled');
            uiElements.intermediaryDiv.textContent = '해당 없음';
        } else {
            uiElements.intermediaryDiv.classList.remove('disabled');
            uiElements.intermediaryDiv.textContent = '드롭샷매치';
        }
    }

    function displayResult(result) {
        if (typeof result === 'number') {
            uiElements.finalAmountDiv.textContent = `${Math.floor(result).toLocaleString()} 원`;
        } else {
            uiElements.finalAmountDiv.textContent = result;
        }
    }

    function calculate() {
        const contractType = document.querySelector('input[name="contract-type"]:checked').value;
        const clientType = uiElements.clientTypeSelect.value;
        const producerType = uiElements.producerTypeSelect.value;
        const contractAmount = parseFloat(uiElements.contractAmountInput.value) || 0;

        updateUIState(contractType);

        const ruleKey = `${contractType}-${clientType}-${producerType}`;
        const rule = calculationRules[ruleKey];

        if (rule) {
            const finalAmount = rule(contractAmount);
            displayResult(finalAmount);
        } else {
            displayResult('추가 예정');
        }
    }

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

    function init() {
        setupEventListeners();
        calculate();
    }

    init();
});
