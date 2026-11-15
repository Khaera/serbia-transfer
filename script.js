const STAY_DURATION_DAYS = 30;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const entryDateInput = document.getElementById('entryDate');
const calcResult = document.getElementById('calcResult');
const deadlineDateEl = document.getElementById('deadlineDate');
const daysLeftEl = document.getElementById('daysLeft');
const calcMessage = document.getElementById('calcMessage');

// Установим сегодняшнюю дату по умолчанию в инпут
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const todayStr = `${year}-${month}-${day}`;

entryDateInput.value = todayStr;
calculateDays(todayStr);

entryDateInput.addEventListener('change', (e) => {
    calculateDays(e.target.value);
});

function parseEntryDate(dateString) {
    const dateParts = dateString.split('-');
    const entryYear = Number(dateParts[0]);
    const entryMonth = Number(dateParts[1]);
    const entryDay = Number(dateParts[2]);

    const entryDate = new Date(entryYear, entryMonth - 1, entryDay);
    return entryDate;
}

function getDeadlineDate(entryDate) {
    const deadlineDate = new Date(entryDate);
    deadlineDate.setDate(entryDate.getDate() + STAY_DURATION_DAYS);
    return deadlineDate;
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

    //Создаем функцию которая возвращает метку полуночи UTC в миллисекундах
    function getCalendarTimestamp(date) {
        return Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        )
    };

    // Подготавливаем обе даты для сравнения
    const todayTimestamp = getCalendarTimestamp(today);

    const deadlineTimestamp = getCalendarTimestamp(deadlineDate);

    // Разница в полных днях
    const diffTime = deadlineTimestamp - todayTimestamp;
    const diffDays = Math.round(diffTime / MILLISECONDS_PER_DAY);

    // Форматируем дату дедлайна для красоты
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDeadline = deadlineDate.toLocaleDateString('ru-RU', options);

    deadlineDateEl.textContent = formattedDeadline;

    // Текст для оставшихся дней
    if (diffDays > 0) {
        daysLeftEl.textContent = `${diffDays} дн.`;
    } else if (diffDays === 0) {
        daysLeftEl.textContent = 'Сегодня крайний срок!';
    } else {
        daysLeftEl.textContent = 'Срок истёк!';
    }

    // Проверки остатка дней, выводящие текст снизу
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

    calcResult.classList.remove('hidden');
}
