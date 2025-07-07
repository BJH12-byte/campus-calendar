function getSvgIcon(type) {
  if (type === '시험' || type === 'EXAM') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 11 11" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.14176 5.35678L7 0.5L4.85824 5.35678L0 7.49873L4.85824 9.64068L7 14.5L9.14176 9.64068L14 7.49873L9.14176 5.35678Z" fill="#574AD3"/>
    </svg>`;
  } else if (type === '과제' || type === 'TASK') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 11 11" fill="none">
      <circle cx="5.5" cy="5.5" r="5.5" fill="#574AD3"/>
    </svg>`;
  } else if (type === '기타' || type === 'ETC') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 11 11" fill="none">
      <circle cx="5.5" cy="5.5" r="5.5" fill="#574AD3"/>
    </svg>`;
  }
  return '';
}

// ===== schedules 전역화 & fetch 한 번만 =====
window.onload = () => {
  fetch('https://unidays-project.com/api/schedules', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((schedules) => {
      window.allSchedules = schedules;
      const today = new Date().toISOString().slice(0, 10);
      const todays = schedules.filter((s) => {
        let d = s.date;
        if (d.length > 10) d = d.slice(0, 10);
        d = d.replace(/\//g, '-');
        return d === today;
      });
      const container = document.getElementById('todayTasksContainer'); // tolist로 바꿔도 됨
      if (todays.length > 0) {
        container.innerHTML = todays
          .map(
            (s) =>
              `<div class="today-task-card">
             <span>${s.title ? '(' + s.title + ') ' : ''}${
                s.subject?.name || ''
              } ${s.type}</span>
           </div>`
          )
          .join('');
      } else {
        container.innerHTML =
          '<div class="today-task-card">오늘 일정 없음</div>';
      }
      renderTodayTasks(schedules);
      renderUpcomingSchedules(schedules);
      flatpickr('#calendar', {
        defaultDate: new Date(),
        inline: true,
        monthSelectorType: 'static',
        onDayCreate: function (_, __, fp, dayElem) {
          const date = fp.formatDate(dayElem.dateObj, 'Y-m-d');
          const daySchedules = (window.allSchedules || []).filter((s) => {
            let d = s.date;
            if (d.length > 10) d = d.slice(0, 10);
            d = d.replace(/\//g, '-');
            return d === date;
          });
          if (daySchedules.length > 0) {
            dayElem.style.position = 'relative';
            const oldIcon = dayElem.querySelector('.icon-dot');
            if (oldIcon) oldIcon.remove();

            // 시험 > 과제 > 기타
            const examList = daySchedules.filter(
              (s) => s.type === 'EXAM' || s.type === '시험'
            );
            const taskList = daySchedules.filter(
              (s) => s.type === 'TASK' || s.type === '과제'
            );
            const etcList = daySchedules.filter(
              (s) => s.type === 'ETC' || s.type === '기타'
            );
            const icons = []
              .concat(
                examList.slice(0, 3),
                taskList.slice(0, 3 - examList.length),
                etcList.slice(0, 3 - examList.length - taskList.length)
              )
              .slice(0, 3);
            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-dot';
            iconContainer.style.position = 'absolute';
            iconContainer.style.bottom = '-2px';
            iconContainer.style.left = '50%';
            iconContainer.style.transform = 'translateX(-50%)';
            iconContainer.style.display = 'flex';
            iconContainer.style.gap = '0.5px';
            iconContainer.style.pointerEvents = 'none';
            for (let i = 0; i < 3; i++) {
              const span = document.createElement('span');
              span.innerHTML = icons[i] ? getSvgIcon(icons[i].type) : '';
              iconContainer.appendChild(span);
            }
            dayElem.appendChild(iconContainer);
          }
          dayElem.addEventListener('click', () =>
            openPanelWithSchedules(date, schedules)
          );
        },
      });
    });

  fetch('https://unidays-project.com/api/user/me', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((user) => {
      if (user && user.name) {
        document.getElementById('userName').innerText = user.name + '님';
      }
    });
};

// 🔥 여기가 중요! 오늘 날짜의 schedule-item들로 today-task-card 복붙!
function renderTodayTasks(schedules) {
  const today = new Date().toISOString().slice(0, 10);
  const daily = schedules.filter((s) => {
    let d = s.date;
    if (d.length > 10) d = d.slice(0, 10);
    d = d.replace(/\//g, '-');
    return d === today;
  });

  const container = document.getElementById('todayTasksContainer');
  // 오늘 schedule이 하나라도 있으면 전부 복붙!
  if (daily.length > 0) {
    // schedule-item 형태가 아니라 today-task-card로만 복붙!
    container.innerHTML = daily
      .map(
        (s) =>
          `<div class='today-task-card'>
             <span>${s.title ? '(' + s.title + ') ' : ''}${
            s.subject?.name || ''
          } ${s.type}</span>
           </div>`
      )
      .join('');
  } else {
    container.innerHTML = "<div class='today-task-card'>오늘 일정 없음</div>";
  }
}

function renderUpcomingSchedules(schedules) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d1Alerts = schedules.filter((s) => {
    const target = new Date(s.date);
    target.setHours(0, 0, 0, 0);
    const diff = (target - today) / (1000 * 60 * 60 * 24);
    return diff === 1;
  });

  if (d1Alerts.length > 0) {
    const alertHTML = `
        <div class="alert-banner">
          📢 내일 마감!<br />
          <div style="font-weight:normal;">
            ${d1Alerts
              .map((s) => `- ${s.subject?.name || ''} ${s.type} (D-1)`)
              .join('<br />')}
          </div>
          <button onclick="this.parentElement.remove()">×</button>
        </div>
      `;
    document.getElementById('alertContainer').innerHTML = alertHTML;
  } else {
    document.getElementById('alertContainer').innerHTML = '';
  }
}

// 일정 상세 패널 열기 (fetch 중복 제거, 이미 받은 schedules 활용)
function openPanelWithSchedules(date, schedulesArg) {
  const schedules = schedulesArg || window.allSchedules || [];
  const daily = schedules.filter((s) => {
    let d = s.date;
    if (d.length > 10) d = d.slice(0, 10);
    d = d.replace(/\//g, '-');
    return d === date;
  });
  document.getElementById(
    'scheduleDate'
  ).textContent = `${date} 일정 (${daily.length})`;
  const listEl = document.getElementById('scheduleList');
  listEl.innerHTML = '';
  daily.forEach((s, idx) => {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    const iconHtml = getSvgIcon(s.type);
    item.innerHTML = `
      <div class="schedule-item-icon">${iconHtml}</div>
      <span>${s.title ? '(' + s.title + ') ' : ''}${s.subject?.name || ''} ${
      s.type
    }</span>
      <div class="schedule-item-buttons"></div>`;
    listEl.appendChild(item);
    item.addEventListener('click', () => {
      window.location.href = `add-task.html?edit=${s.id}`;
    });
  });
  const newEl = document.createElement('div');
  newEl.style =
    'width:100%;text-align:center;font-weight:bold;color:#6b7280;padding:1rem 0;cursor:pointer;';
  newEl.textContent = '+ 새 일정 만들기';
  newEl.onclick = () => (window.location.href = `add-task.html?date=${date}`);
  listEl.appendChild(newEl);
  document.getElementById('schedulePanel').classList.add('active');
}

// 아래부터는 기타 기능 (모달, 팀메뉴 등)

function showAlertModal(message, callback) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('alertModal').style.display = 'flex';
  document.getElementById('alertModal').dataset.callback = callback ? '1' : '';
}

function closeAlertModal() {
  document.getElementById('alertModal').style.display = 'none';
  if (document.getElementById('alertModal').dataset.callback === '1') {
    location.reload();
  }
}

function closePanel() {
  document.getElementById('schedulePanel').classList.remove('active');
}

// 팀 메뉴, 모달, 기타 핸들러
document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName') || '000';
  document.getElementById('userName').textContent = `${userName}님`;
  const dragHandle = document.getElementById('dragHandle');
  if (dragHandle) dragHandle.addEventListener('click', closePanel);
  const notificationTab = document.getElementById('notificationTab');
  if (notificationTab) {
    notificationTab.addEventListener('click', () => {
      window.location.href = '../notification/notification.html';
    });
  }
});

// 팀 드롭다운
document.querySelector('.team-btn').addEventListener('click', () => {
  const menu = document.getElementById('teamMenu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.add('show'), 10);
  } else {
    menu.classList.remove('show');
    setTimeout(() => menu.classList.add('hidden'), 300);
  }
});
function handleTeamSelect() {
  window.location.href = 'team-list.html';
}
function handleTeamCreate() {
  window.location.href = 'create-team.html';
}

// 일정 삭제
function deleteSchedule(scheduleId) {
  fetch(`https://unidays-project.com/api/schedules/${scheduleId}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((res) => {
    if (res.ok) location.reload();
    else showAlertModal('삭제 실패', null);
  });
}

// 일정 수정(미사용/예비)
function editSchedule(date, index) {
  window.location.href = `add-task.html?edit=${date}&index=${index}`;
}
