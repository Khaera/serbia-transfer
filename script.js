document.addEventListener('DOMContentLoaded', () => {
    const entryDateInput = document.getElementById('entryDate');
    const calcResult = document.getElementById('calcResult');
    const deadlineDateEl = document.getElementById('deadlineDate');
    const daysLeftEl = document.getElementById('daysLeft');
    const calcMessage = document.getElementById('calcMessage');

    // Установим сегодняшнюю дату по умолчанию в инпут
    const todayStr = new Date().toISOString().split('T')[0];
    entryDateInput.value = todayStr;
    calculateDays(todayStr);

    entryDateInput.addEventListener('change', (e) => {
        calculateDays(e.target.value);
    });

    function calculateDays(dateString) {
        if (!dateString) return;

        const entryDate = new Date(dateString);
        
        // Крайний срок — ровно 30 дней после въезда
        const deadlineDate = new Date(entryDate);
        deadlineDate.setDate(entryDate.getDate() + 30);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);

        // Разница в полных днях
        const diffTime = deadlineDate - today;
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

        // Твои проверки с сообщениями
        if (diffDays > 5) {
            calcMessage.textContent = 'Всё под контролем, время до выезда есть.';
            calcMessage.style.color = '#2563eb';
            calcMessage.style.backgroundColor = '#eff6ff';
        } 
        else if (diffDays > 1 && diffDays <= 5) {
            calcMessage.textContent = 'Внимание! Скоро пора планировать визаран!';
            calcMessage.style.color = '#d97706';
            calcMessage.style.backgroundColor = '#fef3c7';
        }
        else if (diffDays === 1) {
            calcMessage.textContent = 'Завтра последний день! Срочно на визаран!';
            calcMessage.style.color = 'rgb(250, 21, 21)';
            calcMessage.style.backgroundColor = '#fee2e2';
        }
        else if (diffDays === 0) {
            calcMessage.textContent = 'Выехать нужно СЕГОДНЯ!';
            calcMessage.style.color = 'rgb(250, 21, 21)';
            calcMessage.style.backgroundColor = '#fee2e2';
        }
        else {
            calcMessage.textContent = 'Срок пребывания по штампу превышен! Срочно нужен выезд.';
            calcMessage.style.color = '#f87171';
            calcMessage.style.backgroundColor = '#fee2e2';
        }

        calcResult.classList.remove('hidden');
    }
});