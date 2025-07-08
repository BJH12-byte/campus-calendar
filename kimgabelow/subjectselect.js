document.addEventListener('DOMContentLoaded', async () => {
  const listElem = document.getElementById('subject-list');
  listElem.innerHTML = '';

  // 고정 버튼(전체, 학교 일정)
  [
    { name: '전체', url: 'boards/all.html' },
    { name: '학교 일정', url: 'homepage2.html' },
  ].forEach((item) => {
    const btn = document.createElement('div');
    btn.className = 'subject-item';
    btn.textContent = item.name;
    btn.onclick = () => (window.location.href = item.url);
    listElem.appendChild(btn);
  });

  // 내가 등록한 과목 리스트 백엔드에서 GET
  try {
    const res = await fetch('https://unidays-project.com/api/usersubjects', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('과목 목록 불러오기 실패');
    const data = await res.json();
    const subjects = data.map((x) => x.subject);

    if (subjects.length === 0) {
      const msg = document.createElement('div');
      msg.style.color = '#aaa';
      msg.style.textAlign = 'center';
      msg.style.marginTop = '32px';
      msg.textContent = '등록된 과목이 없습니다.';
      listElem.appendChild(msg);
    } else {
      subjects.forEach((subject) => {
        const btn = document.createElement('div');
        btn.className = 'subject-item';
        btn.textContent = subject.name;
        btn.onclick = () => {
          // 게시판 규칙: boards/subject-<과목ID>.html
          window.location.href = `boards/subject-${subject.id}.html`;
        };
        listElem.appendChild(btn);
      });
    }
  } catch (e) {
    const errMsg = document.createElement('div');
    errMsg.style.color = 'red';
    errMsg.style.textAlign = 'center';
    errMsg.style.marginTop = '32px';
    errMsg.textContent = '과목 목록을 불러오지 못했습니다.';
    listElem.appendChild(errMsg);
  }
});
