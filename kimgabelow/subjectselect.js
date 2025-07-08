document.addEventListener('DOMContentLoaded', async () => {
  const listElem = document.getElementById('subject-list');
  let postListElem = document.getElementById('post-list');
  if (!postListElem) {
    postListElem = document.createElement('div');
    postListElem.id = 'post-list';
    postListElem.style.marginTop = '20px';
    listElem.parentNode.appendChild(postListElem);
  }

  listElem.innerHTML = '';
  postListElem.innerHTML = '';

  // "전체" 탭 고정 버튼
  const allBtn = document.createElement('div');
  allBtn.className = 'subject-item';
  allBtn.textContent = '전체';
  allBtn.onclick = () => {
    // 전체 게시판 → subjectboard.html?subjectId=all 로 이동
    window.location.href = 'subjectboard.html?subjectId=all';
  };
  listElem.appendChild(allBtn);

  // 내가 등록한 과목 리스트 백엔드에서 GET
  let subjects = [];
  try {
    const res = await fetch('https://unidays-project.com/api/usersubjects', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('과목 목록 불러오기 실패');
    const data = await res.json();
    subjects = data.map((x) => x.subject);

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
          // 과목별 게시판 → subjectboard.html?subjectId=xx로 이동
          window.location.href = `subjectboard.html?subjectId=${subject.id}`;
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
