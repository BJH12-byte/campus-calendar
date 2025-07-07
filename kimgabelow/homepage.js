document.addEventListener('DOMContentLoaded', () => {
  // ✅ 학교 공지 리스트 fetch해서 렌더링
  fetch('https://unidays-project.com/api/notices/school', {
    method: 'GET',
    credentials: 'include', // 인증이 필요한 경우, 필요 없으면 빼도 됨
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('학교 공지 목록을 불러오는 데 실패했습니다.');
      }
      return response.json();
    })
    .then((posts) => {
      const board = document.getElementById('school-schedule-board');
      if (board) {
        board.innerHTML = ''; // 기존 내용 초기화
        posts
          .slice()
          .reverse()
          .forEach((post, index) => {
            const item = document.createElement('div');
            item.className = 'board-item';
            item.onclick = () => {
              // 상세 페이지 이동 시 해당 post id 사용
              localStorage.setItem('latestSchoolPost', JSON.stringify(post));
              window.location.href = `homepg-written.html?id=${post.id}`;
            };

            const content = document.createElement('div');
            content.className = 'board-content';

            const title = document.createElement('div');
            title.className = 'board-title';
            title.innerText = post.title;
            content.appendChild(title);

            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';

            // imageUrl이 있으면 이미지, 아니면 파일 pdf, 아니면 기본값
            if (post.imageUrl) {
              const img = document.createElement('img');
              img.src = post.imageUrl;
              img.alt = '썸네일';
              thumbnail.appendChild(img);
            } else if (
              post.fileUrl &&
              (post.fileUrl.endsWith('.pdf') || post.fileUrl.endsWith('.PDF'))
            ) {
              thumbnail.innerHTML = `<span style="font-size:12px;color:#bbb;">PDF</span>`;
            } else {
              thumbnail.innerText = 'No Image';
            }

            item.appendChild(content);
            item.appendChild(thumbnail);
            board.appendChild(item);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      const board = document.getElementById('school-schedule-board');
      if (board) {
        board.innerHTML =
          '<div style="padding:30px;text-align:center;color:#aaa;">학교 공지 불러오기 실패</div>';
      }
    });

  // ✅ 탭 클릭 이벤트 처리
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'school-schedule') {
        document.getElementById('school-schedule-board').style.display =
          'block';
      } else if (tab.dataset.tab === 'subject-board') {
        window.location.href = 'subjectselect.html';
      }
    });
  });
});
