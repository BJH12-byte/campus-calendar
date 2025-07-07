window.selectedType = null;
window.selectedSubject = null;

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('edit');
let isEditMode = !!editId;

window.onload = () => {
  // 사용자명 표시
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.name) {
    document.getElementById('userName').innerText = user.name + '님';
  }

  // 과목 리스트 렌더
  const subjectListDiv = document.getElementById('subject-list');
  subjectListDiv.innerHTML = '';
  const etcItem = document.createElement('div');
  etcItem.className = 'list-item';
  etcItem.innerText = '없음(기타)';
  etcItem.onclick = function () {
    selectSubject(this, null);
  };
  subjectListDiv.appendChild(etcItem);

  fetch('https://unidays-project.com/api/usersubjects', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((subjects) => {
      subjects.forEach((entry) => {
        if (!entry.subject || !entry.subject.name) return;
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerText = entry.subject.name;
        item.setAttribute('data-id', entry.subject.id);
        item.onclick = function () {
          selectSubject(this, entry.subject);
        };
        subjectListDiv.appendChild(item);
      });

      // 수정 모드면 기존 정보 세팅
      if (isEditMode) {
        fetch(`https://unidays-project.com/api/schedules/${editId}`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            document.getElementById('schedule-title').value = data.title || '';
            document.getElementById('date-picker').value = data.date || '';
            window.selectedType =
              data.type === 'TASK'
                ? '과제'
                : data.type === 'EXAM'
                ? '시험'
                : '기타';
            window.selectedSubject = data.subject
              ? { id: data.subject.id, name: data.subject.name }
              : null;

            // UI 강조
            setTimeout(() => {
              document
                .querySelectorAll('#subject-list .list-item')
                .forEach((item) => {
                  if (
                    window.selectedSubject &&
                    item.textContent === window.selectedSubject.name
                  )
                    item.classList.add('selected');
                });
              document
                .querySelectorAll('#schedule-section .list-item')
                .forEach((item) => {
                  if (item.textContent === window.selectedType)
                    item.classList.add('selected');
                });
              document.getElementById('schedule-section').style.display =
                'block';
              document.getElementById('date-section').style.display = 'block';
              document.getElementById('deleteBtn').style.display = 'block';
              document.querySelector('.footer').textContent = '수정하기';
            }, 100);
          });
      }
    });

  // 날짜 기본값
  const dateParam = urlParams.get('date');
  document.getElementById('date-picker').value =
    dateParam || new Date().toISOString().slice(0, 10);

  // 등록/수정 버튼 텍스트
  if (isEditMode) {
    document.querySelector('.footer').textContent = '수정하기';
    document.getElementById('deleteBtn').style.display = 'block';
  }
};

function selectSubject(el, subjectObj = null) {
  document
    .querySelectorAll('#subject-list .list-item')
    .forEach((item) => item.classList.remove('selected'));
  el.classList.add('selected');
  window.selectedSubject = subjectObj;
  document.getElementById('schedule-section').style.display = 'block';
}

function selectType(el, type) {
  document
    .querySelectorAll('#schedule-section .list-item')
    .forEach((item) => item.classList.remove('selected'));
  el.classList.add('selected');
  window.selectedType = type;
  document.getElementById('date-section').style.display = 'block';
}

function showWarning(message) {
  const warningBox = document.getElementById('warningBox');
  warningBox.textContent = message;
  warningBox.style.display = 'block';
  setTimeout(() => {
    warningBox.style.display = 'none';
  }, 3000);
}

function registerSchedule() {
  const title = document.getElementById('schedule-title').value.trim();
  const date = document.getElementById('date-picker').value.trim();

  if (!window.selectedType || !date) {
    showWarning('일정, 날짜를 모두 선택하세요.');
    return;
  }
  const selectedDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate.getTime() < today.getTime()) {
    showWarning('지난 날짜에는 일정을 등록할 수 없습니다.');
    return;
  }

  const payload = {
    title: title,
    date: date,
    alertBeforeDays: 1,
    type:
      window.selectedType === '과제'
        ? 'TASK'
        : window.selectedType === '시험'
        ? 'EXAM'
        : 'ETC',
    subjectId: window.selectedSubject ? window.selectedSubject.id : null,
  };

  const method = isEditMode ? 'PUT' : 'POST';
  const url = isEditMode
    ? `https://unidays-project.com/api/schedules/${editId}`
    : 'https://unidays-project.com/api/schedules';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok)
        throw new Error(isEditMode ? '일정 수정 실패' : '일정 등록 실패');
      return res.json();
    })
    .then(() => {
      showAlertModal(
        isEditMode ? '일정이 수정되었습니다.' : '일정이 등록되었습니다.',
        () => (window.location.href = 'home.html')
      );
    })
    .catch((e) => {
      showWarning(
        isEditMode ? '일정 수정에 실패했습니다.' : '일정 등록에 실패했습니다.'
      );
      console.error(e);
    });
}

let alertCallback = null;
function showAlertModal(message, callback) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('alertModal').style.display = 'flex';
  alertCallback = typeof callback === 'function' ? callback : null;
}
function closeAlertModal() {
  document.getElementById('alertModal').style.display = 'none';
  if (alertCallback) {
    alertCallback();
    alertCallback = null;
  }
}

// 삭제 모달 오픈
function deleteSchedule() {
  document.getElementById('deleteModal').style.display = 'flex';
}

// 재확인: 모달만 닫기
document.getElementById('cancelDeleteBtn').onclick = () => {
  document.getElementById('deleteModal').style.display = 'none';
};

// 네: 백엔드 삭제
document.getElementById('confirmDeleteBtn').onclick = () => {
  fetch(`https://unidays-project.com/api/schedules/${editId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) throw new Error('일정 삭제 실패');
      return res.text();
    })
    .then(() => {
      document.getElementById('deleteModal').style.display = 'none';
      showAlertModal('일정이 삭제되었습니다.', () => {
        window.location.href = 'home.html';
      });
    })
    .catch((e) => {
      showWarning('일정 삭제에 실패했습니다.');
      console.error(e);
    });
};
