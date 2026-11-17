const STAY_DURATION_DAYS = 30;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const entryDateInput = document.getElementById('entryDate');
const calcResult = document.getElementById('calcResult');
const deadlineDateEl = document.getElementById('deadlineDate');
const daysLeftEl = document.getElementById('daysLeft');
const calcMessage = document.getElementById('calcMessage');
const entryDateHint = document.getElementById('entryDateHint');

const clearDateButton = document.getElementById('clearDate');

const savedEntryDate = localStorage.getItem('entryDate');

// Восстанавливаем сохранённую дату или подставляем сегодняшнюю
const todayStr = formatDateForInput(new Date());

entryDateInput.max = todayStr;

if (savedEntryDate) {
    entryDateInput.value = savedEntryDate;
} else {
    entryDateInput.value = todayStr;
}

if (entryDateInput.value === '' || entryDateInput.validity.rangeOverflow) {
    localStorage.removeItem('entryDate');
    entryDateInput.value = todayStr;
}

calculateDays(entryDateInput.value);
updateClearButtonState();

clearDateButton.addEventListener('click', () => {
    entryDateInput.value = '';
    calcResult.classList.add('hidden');
    entryDateHint.textContent = 'Укажите дату въезда в Сербию';
    localStorage.removeItem('entryDate');
    updateClearButtonState();
});

entryDateInput.addEventListener('input', updateClearButtonState);

entryDateInput.addEventListener('keyup', updateClearButtonState);

entryDateInput.addEventListener('focus', () => {
    entryDateInput.max = formatDateForInput(new Date());
});

entryDateInput.addEventListener('change', () => {
    const todayStr = formatDateForInput(new Date());

    entryDateHint.textContent = '';
    if (!entryDateInput.value) {
        localStorage.removeItem('entryDate');
        entryDateHint.textContent = 'Необходимо указать дату въезда в Сербию.';
    } else if (entryDateInput.validity.rangeOverflow) {
        entryDateInput.value = todayStr;
        entryDateHint.textContent = 'Дата въезда не может быть в будущем. Установлена сегодняшняя дата.';
    } else {
        localStorage.setItem('entryDate', entryDateInput.value);
    }

    calculateDays(entryDateInput.value);
    updateClearButtonState();
});

function updateClearButtonState() {
    clearDateButton.disabled = entryDateInput.value === '' && !entryDateInput.validity.badInput;
}

function parseEntryDate(dateString) {
    const dateParts = dateString.split('-');
    const entryYear = Number(dateParts[0]);
    const entryMonth = Number(dateParts[1]);
    const entryDay = Number(dateParts[2]);

    const entryDate = new Date(entryYear, entryMonth - 1, entryDay);
    return entryDate;
}

//день вьезда считается уже первым днем, поэтому из константы вычитаем 1
function getDeadlineDate(entryDate) {
    const deadlineDate = new Date(entryDate);
    deadlineDate.setDate(entryDate.getDate() + STAY_DURATION_DAYS - 1);
    return deadlineDate;
}

//возвращает метку полуночи UTC в миллисекундах
function getCalendarTimestamp(date) {
    return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )
};

// Форматируем дату дедлайна для красоты
function renderDeadlineDate(deadlineDate) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDeadline = deadlineDate.toLocaleDateString('ru-RU', options);

    deadlineDateEl.textContent = formattedDeadline;
}

function renderDaysLeft(diffDays) {
    if (diffDays > 0) {
        daysLeftEl.textContent = `${diffDays} дн.`;
    } else if (diffDays === 0) {
        daysLeftEl.textContent = 'Сегодня крайний срок!';
    } else {
        daysLeftEl.textContent = 'Срок истёк!';
    }
}
// Удаление старых классов и вся цепочка выбора сообщения
function renderStatusMessage(diffDays) {
    calcMessage.classList.remove('calc-msg-info',
        'calc-msg-warning',
        'calc-msg-danger'
    );

    if (diffDays > 5) {
        calcMessage.textContent = 'Всё под контролем, время до выезда есть.';
        calcMessage.classList.add('calc-msg-info');
    }
    else if (diffDays > 1) {
        calcMessage.textContent = 'Внимание! Скоро пора планировать визаран!';
        calcMessage.classList.add('calc-msg-warning');
    }
    else if (diffDays === 1) {
        calcMessage.textContent = 'Завтра последний день! Срочно на визаран!';
        calcMessage.classList.add('calc-msg-danger');
    }
    else if (diffDays === 0) {
        calcMessage.textContent = 'Выехать нужно СЕГОДНЯ!';
        calcMessage.classList.add('calc-msg-danger');
    }
    else {
        calcMessage.textContent = 'Срок пребывания по штампу превышен! Срочно нужен выезд.';
        calcMessage.classList.add('calc-msg-danger');
    }
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculateDays(dateString) {
    if (!dateString) {
        calcResult.classList.add('hidden');
        return;
    }

    const entryDate = parseEntryDate(dateString);

    // Рассчитываем дату выезда
    const deadlineDate = getDeadlineDate(entryDate);

    // Получаем сегодняшнюю дату
    const today = new Date();

    // Подготавливаем обе даты для сравнения
    const todayTimestamp = getCalendarTimestamp(today);

    const deadlineTimestamp = getCalendarTimestamp(deadlineDate);

    // Разница в полных днях
    const diffTime = deadlineTimestamp - todayTimestamp;
    const diffDays = Math.round(diffTime / MILLISECONDS_PER_DAY);

    renderDeadlineDate(deadlineDate);
    renderDaysLeft(diffDays);
    renderStatusMessage(diffDays);

    calcResult.classList.remove('hidden');
}
