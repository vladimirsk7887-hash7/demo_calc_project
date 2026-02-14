// Состояние калькулятора
let currentStep = 1;
let formData = {
    roomType: '',
    sashCount: '',
    windowHeight: '',
    windowWidth: '',
    sashType: '',
    leftSashType: '',
    rightSashType: '',
    thirdSashType: '',
    accessories: [],
    leftAccessories: [],
    rightAccessories: [],
    thirdAccessories: [],
    components: [],
    features: [],
    delivery: '',
    lift: '',
    installation: '',
    phone: '',
    agreement: false,
    calcCode: ''
};

// Карта прогресса для каждого шага
const progressMap = {
    1: 0,    // Тип помещения
    2: 12,   // Количество створок
    3: 25,   // Размеры
    4: 37,   // Тип створки/левая створка
    5: 37,   // Правая створка (для 2 створок) / средняя (для 3)
    6: 37,   // Третья створка (только для 3)
    7: 50,   // Комплектующие
    8: 62,   // Прокачка окна
    9: 75,   // Сводка
    10: 87,  // Доп. услуги
    11: 100  // Финал
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateProgress();
});

function initializeEventListeners() {
    // Слушатели для типа створки (одна створка)
    const sashTypeRadios = document.querySelectorAll('input[name="sashType"]');
    sashTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const accessories = document.getElementById('singleAccessories');
            if (this.value === 'turn' || this.value === 'turn-tilt') {
                accessories.style.display = 'block';
            } else {
                accessories.style.display = 'none';
            }
        });
    });

    // Слушатели для левой створки
    const leftSashRadios = document.querySelectorAll('input[name="leftSashType"]');
    leftSashRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const accessories = document.getElementById('leftAccessories');
            if (this.value === 'turn' || this.value === 'turn-tilt') {
                accessories.style.display = 'block';
            } else {
                accessories.style.display = 'none';
            }
        });
    });

    // Слушатели для правой створки
    const rightSashRadios = document.querySelectorAll('input[name="rightSashType"]');
    rightSashRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const accessories = document.getElementById('rightAccessories');
            if (this.value === 'turn' || this.value === 'turn-tilt') {
                accessories.style.display = 'block';
            } else {
                accessories.style.display = 'none';
            }
        });
    });

    // Слушатели для третьей створки
    const thirdSashRadios = document.querySelectorAll('input[name="thirdSashType"]');
    thirdSashRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const accessories = document.getElementById('thirdAccessories');
            if (this.value === 'turn' || this.value === 'turn-tilt') {
                accessories.style.display = 'block';
            } else {
                accessories.style.display = 'none';
            }
        });
    });

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (!value.startsWith('7') && value.length > 0) {
            value = '7' + value;
        }

        let formattedValue = '+7';

        if (value.length > 1) {
            formattedValue += ' (' + value.substring(1, 4);
        }
        if (value.length >= 5) {
            formattedValue += ') ' + value.substring(4, 7);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
            formattedValue += '-' + value.substring(9, 11);
        }

        e.target.value = formattedValue;

        validateFinalForm();
    });

    // Чекбокс согласия
    const agreementCheckbox = document.getElementById('agreement');
    agreementCheckbox.addEventListener('change', validateFinalForm);
}

function updateProgress() {
    const progress = progressMap[currentStep] || 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressBar.style.width = progress + '%';
    progressText.textContent = progress + '%';
}

function showStep(stepNumber) {
    // Скрыть все шаги
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Определить какой шаг показать
    let stepId = 'step' + stepNumber;

    // Специальная логика для шагов с створками
    if (stepNumber === 4) {
        const sashCount = formData.sashCount;
        if (sashCount === '1') {
            stepId = 'step4-single';
        } else if (sashCount === '2' || sashCount === '3') {
            stepId = 'step4-left';
        }
    } else if (stepNumber === 5) {
        const sashCount = formData.sashCount;
        if (sashCount === '2') {
            stepId = 'step5-right';
            document.getElementById('rightSashTitle').textContent = 'Выберите правую створку';
        } else if (sashCount === '3') {
            stepId = 'step5-right';
            document.getElementById('rightSashTitle').textContent = 'Выберите среднюю створку';
        }
    } else if (stepNumber === 6) {
        const sashCount = formData.sashCount;
        if (sashCount === '3') {
            stepId = 'step6-third';
        }
    }

    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Заполнить данные для специальных шагов
    if (stepNumber === 9) {
        displaySummary();
    } else if (stepNumber === 11) {
        displayFinalSummary();
    }

    updateProgress();
}

function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            const roomType = document.querySelector('input[name="roomType"]:checked');
            if (!roomType) {
                alert('Пожалуйста, выберите тип помещения');
                return false;
            }
            formData.roomType = roomType.value;
            return true;

        case 2:
            const sashCount = document.querySelector('input[name="sashCount"]:checked');
            if (!sashCount) {
                alert('Пожалуйста, выберите количество створок');
                return false;
            }
            formData.sashCount = sashCount.value;
            return true;

        case 3:
            const height = document.getElementById('windowHeight').value;
            const width = document.getElementById('windowWidth').value;
            if (!height || !width) {
                alert('Пожалуйста, укажите размеры окна');
                return false;
            }
            if (height < 400 || height > 3000 || width < 400 || width > 3000) {
                alert('Размеры должны быть в пределах 400-3000 мм');
                return false;
            }
            formData.windowHeight = height;
            formData.windowWidth = width;
            return true;

        case 4:
            if (formData.sashCount === '1') {
                const sashType = document.querySelector('input[name="sashType"]:checked');
                if (!sashType) {
                    alert('Пожалуйста, выберите тип створки');
                    return false;
                }
                formData.sashType = sashType.value;

                // Собрать аксессуары
                const accessories = [];
                document.querySelectorAll('input[name="accessories"]:checked').forEach(checkbox => {
                    accessories.push(checkbox.value);
                });
                formData.accessories = accessories;
            } else {
                const leftSashType = document.querySelector('input[name="leftSashType"]:checked');
                if (!leftSashType) {
                    alert('Пожалуйста, выберите тип левой створки');
                    return false;
                }
                formData.leftSashType = leftSashType.value;

                // Собрать аксессуары левой створки
                const leftAccessories = [];
                document.querySelectorAll('input[name="leftAccessories"]:checked').forEach(checkbox => {
                    leftAccessories.push(checkbox.value);
                });
                formData.leftAccessories = leftAccessories;
            }
            return true;

        case 5:
            const rightSashType = document.querySelector('input[name="rightSashType"]:checked');
            if (!rightSashType) {
                alert('Пожалуйста, выберите тип створки');
                return false;
            }
            formData.rightSashType = rightSashType.value;

            // Собрать аксессуары правой створки
            const rightAccessories = [];
            document.querySelectorAll('input[name="rightAccessories"]:checked').forEach(checkbox => {
                rightAccessories.push(checkbox.value);
            });
            formData.rightAccessories = rightAccessories;
            return true;

        case 6:
            if (formData.sashCount === '3') {
                const thirdSashType = document.querySelector('input[name="thirdSashType"]:checked');
                if (!thirdSashType) {
                    alert('Пожалуйста, выберите тип третьей створки');
                    return false;
                }
                formData.thirdSashType = thirdSashType.value;

                // Собрать аксессуары третьей створки
                const thirdAccessories = [];
                document.querySelectorAll('input[name="thirdAccessories"]:checked').forEach(checkbox => {
                    thirdAccessories.push(checkbox.value);
                });
                formData.thirdAccessories = thirdAccessories;
            }
            return true;

        case 7:
            // Собрать комплектующие
            const components = [];
            document.querySelectorAll('input[name="components"]:checked').forEach(checkbox => {
                components.push(checkbox.value);
            });
            formData.components = components;
            return true;

        case 8:
            // Собрать функции
            const features = [];
            document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
                features.push(checkbox.value);
            });
            formData.features = features;
            return true;

        case 9:
            // Сводка отображается автоматически в showStep()
            return true;

        case 10:
            const delivery = document.querySelector('input[name="delivery"]:checked');
            const lift = document.querySelector('input[name="lift"]:checked');
            const installation = document.querySelector('input[name="installation"]:checked');

            if (!delivery || !lift || !installation) {
                alert('Пожалуйста, выберите все дополнительные услуги');
                return false;
            }

            formData.delivery = delivery.value;
            formData.lift = lift.value;
            formData.installation = installation.value;
            return true;

        case 11:
            // Финальная сводка отображается автоматически в showStep()
            return true;

        default:
            return true;
    }
}

function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    // Определить следующий шаг
    let nextStepNumber = currentStep + 1;

    // Пропустить шаги в зависимости от количества створок
    if (currentStep === 4 && formData.sashCount === '1') {
        nextStepNumber = 7; // Пропустить шаги 5 и 6
    } else if (currentStep === 5 && formData.sashCount === '2') {
        nextStepNumber = 7; // Пропустить шаг 6
    } else if (currentStep === 6) {
        nextStepNumber = 7;
    }

    // Корректировка для сводки
    if (currentStep === 7) {
        nextStepNumber = 8;
    } else if (currentStep === 8) {
        nextStepNumber = 9;
    } else if (currentStep === 9) {
        nextStepNumber = 10;
    } else if (currentStep === 10) {
        nextStepNumber = 11;
    }

    currentStep = nextStepNumber;
    showStep(currentStep);
}

function prevStep() {
    // Определить предыдущий шаг
    let prevStepNumber = currentStep - 1;

    // Обратная логика для створок
    if (currentStep === 7) {
        if (formData.sashCount === '1') {
            prevStepNumber = 4;
        } else if (formData.sashCount === '2') {
            prevStepNumber = 5;
        } else if (formData.sashCount === '3') {
            prevStepNumber = 6;
        }
    }

    currentStep = prevStepNumber;
    showStep(currentStep);
}

function displaySummary() {
    const summaryContent = document.getElementById('summaryContent');
    let html = '<div>';

    // Размеры
    html += `<p><strong>Размеры:</strong> ${formData.windowHeight} x ${formData.windowWidth} мм</p>`;

    // Створки
    if (formData.sashCount === '1') {
        html += `<p><strong>Тип створки:</strong> ${getSashTypeName(formData.sashType)}</p>`;
        if (formData.accessories.length > 0) {
            html += `<p><strong>Аксессуары:</strong> ${formData.accessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
    } else if (formData.sashCount === '2') {
        html += `<p><strong>Левая створка:</strong> ${getSashTypeName(formData.leftSashType)}</p>`;
        if (formData.leftAccessories.length > 0) {
            html += `<p><strong>Аксессуары левой:</strong> ${formData.leftAccessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
        html += `<p><strong>Правая створка:</strong> ${getSashTypeName(formData.rightSashType)}</p>`;
        if (formData.rightAccessories.length > 0) {
            html += `<p><strong>Аксессуары правой:</strong> ${formData.rightAccessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
    } else if (formData.sashCount === '3') {
        html += `<p><strong>Левая створка:</strong> ${getSashTypeName(formData.leftSashType)}</p>`;
        if (formData.leftAccessories.length > 0) {
            html += `<p><strong>Аксессуары левой:</strong> ${formData.leftAccessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
        html += `<p><strong>Средняя створка:</strong> ${getSashTypeName(formData.rightSashType)}</p>`;
        if (formData.rightAccessories.length > 0) {
            html += `<p><strong>Аксессуары средней:</strong> ${formData.rightAccessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
        html += `<p><strong>Правая створка:</strong> ${getSashTypeName(formData.thirdSashType)}</p>`;
        if (formData.thirdAccessories.length > 0) {
            html += `<p><strong>Аксессуары правой:</strong> ${formData.thirdAccessories.map(a => getAccessoryName(a)).join(', ')}</p>`;
        }
    }

    // Комплектующие
    if (formData.components.length > 0) {
        html += `<p><strong>Комплектующие:</strong> ${formData.components.map(c => getComponentName(c)).join(', ')}</p>`;
    }

    // Дополнительные параметры
    if (formData.features.length > 0) {
        html += `<p><strong>Дополнительные параметры:</strong> ${formData.features.map(f => getFeatureName(f)).join(', ')}</p>`;
    }

    html += '</div>';
    summaryContent.innerHTML = html;
}

function displayFinalSummary() {
    // Размеры
    const finalSize = document.getElementById('finalSize');
    finalSize.textContent = `${formData.windowHeight} x ${formData.windowWidth} мм`;

    // Опции
    const finalOptions = document.getElementById('finalOptions');
    let optionsHtml = '<ul style="list-style: none; padding: 0; margin: 0;">';

    // Тип помещения
    optionsHtml += `<li style="margin-bottom: 8px;"><strong>Помещение:</strong> ${getRoomTypeName(formData.roomType)}</li>`;

    // Створки
    optionsHtml += `<li style="margin-bottom: 8px;"><strong>Створок:</strong> ${formData.sashCount}</li>`;

    if (formData.sashCount === '1') {
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Тип створки:</strong> ${getSashTypeName(formData.sashType)}</li>`;
        if (formData.accessories.length > 0) {
            optionsHtml += `<li style="margin-bottom: 8px;">Аксессуары: ${formData.accessories.map(a => getAccessoryName(a)).join(', ')}</li>`;
        }
    } else if (formData.sashCount === '2') {
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Левая створка:</strong> ${getSashTypeName(formData.leftSashType)}</li>`;
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Правая створка:</strong> ${getSashTypeName(formData.rightSashType)}</li>`;
    } else if (formData.sashCount === '3') {
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Левая створка:</strong> ${getSashTypeName(formData.leftSashType)}</li>`;
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Средняя створка:</strong> ${getSashTypeName(formData.rightSashType)}</li>`;
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Правая створка:</strong> ${getSashTypeName(formData.thirdSashType)}</li>`;
    }

    // Комплектующие
    if (formData.components.length > 0) {
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Комплектующие:</strong> ${formData.components.map(c => getComponentName(c)).join(', ')}</li>`;
    }

    // Параметры
    if (formData.features.length > 0) {
        optionsHtml += `<li style="margin-bottom: 8px;"><strong>Параметры:</strong> ${formData.features.map(f => getFeatureName(f)).join(', ')}</li>`;
    }

    // Услуги
    optionsHtml += `<li style="margin-bottom: 8px;"><strong>Доставка:</strong> ${getDeliveryName(formData.delivery)}</li>`;
    optionsHtml += `<li style="margin-bottom: 8px;"><strong>Подъём:</strong> ${getLiftName(formData.lift)}</li>`;
    optionsHtml += `<li style="margin-bottom: 8px;"><strong>Монтаж:</strong> ${getInstallationName(formData.installation)}</li>`;

    optionsHtml += '</ul>';
    finalOptions.innerHTML = optionsHtml;

    // Генерация кода (только один раз)
    if (!formData.calcCode) {
        formData.calcCode = generateCalcCode();
    }
    const calcCode = document.getElementById('calcCode');
    calcCode.textContent = formData.calcCode;
}

function generateCalcCode() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `WIN-${timestamp}-${random}`;
}

function getSashTypeName(type) {
    const names = {
        'fixed': 'Глухая',
        'turn': 'Поворотная',
        'turn-tilt': 'Поворотно-откидная'
    };
    return names[type] || type;
}

function getAccessoryName(accessory) {
    const names = {
        'mosquito': 'Москитная сетка',
        'childlock': 'Детский замок'
    };
    return names[accessory] || accessory;
}

function getComponentName(component) {
    const names = {
        'sill': 'Подоконник',
        'slopes': 'Откосы',
        'drip': 'Отливы'
    };
    return names[component] || component;
}

function getFeatureName(feature) {
    const names = {
        'soundproof': 'Шумоизоляция',
        'energy': 'Теплосбережение',
        'sun': 'Солнцезащита',
        'microvent': 'Микропроветривание',
        'security': 'Противовзломность',
        'light': 'Светопропускание',
        'thermo': 'Термопакет',
        'lamination': 'Ламинация'
    };
    return names[feature] || feature;
}

function getDeliveryName(delivery) {
    const names = {
        'mkad': 'В пределах МКАД',
        'moscow': 'Московская область',
        'pickup': 'Самовывоз'
    };
    return names[delivery] || delivery;
}

function getLiftName(lift) {
    const names = {
        'cargo': 'Грузовой лифт',
        'passenger': 'Пассажирский лифт',
        'notneed': 'Подъём не требуется',
        'nolift': 'Лифта нет'
    };
    return names[lift] || lift;
}

function getInstallationName(installation) {
    const names = {
        'with': 'С монтажом',
        'without': 'Без монтажа'
    };
    return names[installation] || installation;
}

function getRoomTypeName(type) {
    const names = {
        'apartment': 'Квартира',
        'house': 'Частный дом',
        'office': 'Офис'
    };
    return names[type] || type;
}

function validateFinalForm() {
    const phone = document.getElementById('phone').value;
    const agreement = document.getElementById('agreement').checked;
    const calculateBtn = document.getElementById('calculateBtn');

    // Проверка телефона (должен быть полностью заполнен)
    const phoneDigits = phone.replace(/\D/g, '');
    const isPhoneValid = phoneDigits.length === 11;

    if (isPhoneValid && agreement) {
        calculateBtn.disabled = false;
    } else {
        calculateBtn.disabled = true;
    }
}

function editWindow() {
    // Вернуться к началу редактирования окна
    currentStep = 3;
    showStep(currentStep);
}

async function submitForm() {
    formData.phone = document.getElementById('phone').value;
    formData.agreement = document.getElementById('agreement').checked;

    // Подготовка сообщения для Telegram
    const message = formatTelegramMessage();

    // Отправка в Telegram
    await sendToTelegram(message);

    // Показать модальное окно
    showSuccessModal();
}

function formatTelegramMessage() {
    let message = '🪟 НОВАЯ ЗАЯВКА НА РАСЧЁТ ОКНА\n\n';

    message += `📋 Код расчёта: ${formData.calcCode}\n\n`;

    message += `🏠 Тип помещения: ${getRoomTypeName(formData.roomType)}\n`;
    message += `📐 Размеры: ${formData.windowHeight} x ${formData.windowWidth} мм\n`;
    message += `🪟 Количество створок: ${formData.sashCount}\n\n`;

    // Створки
    if (formData.sashCount === '1') {
        message += `Тип створки: ${getSashTypeName(formData.sashType)}\n`;
        if (formData.accessories.length > 0) {
            message += `Аксессуары: ${formData.accessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
    } else if (formData.sashCount === '2') {
        message += `Левая створка: ${getSashTypeName(formData.leftSashType)}\n`;
        if (formData.leftAccessories.length > 0) {
            message += `Аксессуары: ${formData.leftAccessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
        message += `Правая створка: ${getSashTypeName(formData.rightSashType)}\n`;
        if (formData.rightAccessories.length > 0) {
            message += `Аксессуары: ${formData.rightAccessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
    } else if (formData.sashCount === '3') {
        message += `Левая створка: ${getSashTypeName(formData.leftSashType)}\n`;
        if (formData.leftAccessories.length > 0) {
            message += `Аксессуары: ${formData.leftAccessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
        message += `Средняя створка: ${getSashTypeName(formData.rightSashType)}\n`;
        if (formData.rightAccessories.length > 0) {
            message += `Аксессуары: ${formData.rightAccessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
        message += `Правая створка: ${getSashTypeName(formData.thirdSashType)}\n`;
        if (formData.thirdAccessories.length > 0) {
            message += `Аксессуары: ${formData.thirdAccessories.map(a => getAccessoryName(a)).join(', ')}\n`;
        }
    }

    message += '\n';

    // Комплектующие
    if (formData.components.length > 0) {
        message += `🔧 Комплектующие: ${formData.components.map(c => getComponentName(c)).join(', ')}\n`;
    }

    // Дополнительные параметры
    if (formData.features.length > 0) {
        message += `⚡ Параметры: ${formData.features.map(f => getFeatureName(f)).join(', ')}\n`;
    }

    message += '\n';

    // Услуги
    message += `🚚 Доставка: ${getDeliveryName(formData.delivery)}\n`;
    message += `🏗️ Подъём: ${getLiftName(formData.lift)}\n`;
    message += `🔨 Монтаж: ${getInstallationName(formData.installation)}\n\n`;

    // Контакты
    message += `📞 Телефон: ${formData.phone}\n`;

    return message;
}

async function sendToTelegram(message) {
    // ВАЖНО: Замените эти значения на свои!
    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error('Ошибка отправки в Telegram:', data);
        }
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');

    // Опционально: перезагрузить страницу или сбросить форму
    location.reload();
}
