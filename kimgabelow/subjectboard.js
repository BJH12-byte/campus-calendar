document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'school-schedule') {
        window.location.href = 'homepage2.html'; // 학교 일정 버튼: 홈페이지로 이동
      } else {
        indicator.style.left = '50%'; // 과목 별로: indicator 유지
      }
    });
  });

  // 게시글 클릭 시 글 상세 페이지로 이동
  const boardItems = document.querySelectorAll('.board-item');
  boardItems.forEach((item) => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.board-title')?.innerText || '';
      const subject = item.querySelector('.board-subject')?.innerText || '';
      const date = item.querySelector('.board-date')?.innerText || '';
      const image = item.querySelector('img')?.src || '';

      const postData = { title, subject, date, content: '', image };

      // ✅ 클릭한 게시물 데이터를 latestPost로 저장
      localStorage.setItem('latestPost', JSON.stringify(postData));

      // ✅ 상세 페이지로 이동
      window.location.href = 'subject-written.html';
    });
  });

  // ✅ 글쓰기 버튼 클릭 시 subject-choose.html로 이동
  const writeBtn = document.querySelector('.write-button button');
  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      window.location.href = 'subject-choose.html'; // ✅ 수정됨: 글쓰기 -> 과목 선택으로 이동
    });
  }
});
