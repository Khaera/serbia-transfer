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

    function calculateDays(dateString) {
        if (!dateString) {
            calcResult.classList.add('hidden');
            return;
        }

        const dateParts = dateString.split('-');
        const entryYear = Number(dateParts[0]);
        const entryMonth = Number(dateParts[1]);
        const entryDay = Number(dateParts[2]);

        const entryDate = new Date(entryYear, entryMonth - 1, entryDay);
        
        // Рассчитываем дату выезда
        const deadlineDate = new Date(entryDate);
        deadlineDate.setDate(entryDate.getDate() + 30);

        // Получаем сегодняшнюю дату
        const today = new Date();

        // Подготавливаем обе даты для сравнения
        const todayTimestamp = Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const deadlineTimestamp = Date.UTC(
            deadlineDate.getFullYear(),
            deadlineDate.getMonth(),
            deadlineDate.getDate()
        );

        // Разница в полных днях
        const diffTime = deadlineTimestamp - todayTimestamp;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

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
