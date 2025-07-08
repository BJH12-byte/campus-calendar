document.addEventListener('DOMContentLoaded', () => {
  const calendarMonth = document.getElementById('calendar-month');
  const calendarDays = document.getElementById('calendar-days');

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const monthName = today.toLocaleString('en-US', { month: 'long' });

  calendarMonth.textContent = `${year} ${monthName}`;

  // 요일 헤더 생성
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weekdays.forEach((day) => {
    const label = document.createElement('div');
    label.className = 'day-label';
    label.textContent = day;
    calendarDays.appendChild(label);
  });

  // 1일이 무슨 요일인지 계산
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let selected = null;

  // 공백 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    const empty = document.createElement('div');
    calendarDays.appendChild(empty);
  }

  // 날짜 생성
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayElem = document.createElement('div');
    dayElem.classList.add('day');
    dayElem.textContent = day;

    // 오늘 표시
    if (day === today.getDate()) {
      dayElem.classList.add('today');
    }

    dayElem.addEventListener('click', () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date < now) {
        alert('오늘 이전 날짜는 선택할 수 없습니다.');
        return;
      }

      if (selected) selected.classList.remove('selected');
      dayElem.classList.add('selected');
      selected = dayElem;
    });

    // ✅ 두 번 클릭 감지로 homepgwrite2.html로 이동 + uploadedImage 초기화
    let lastClickTime = 0;
    dayElem.addEventListener('click', () => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < 3000) {
        // 300ms 내 두 번 클릭으로 인식
        localStorage.removeItem('uploadedImage'); // 이전 이미지 삭제
        window.location.href = 'homepgwrite2.html';
      }
      lastClickTime = currentTime;
    });

    calendarDays.appendChild(dayElem);
  }
});
