document.addEventListener('DOMContentLoaded', async () => {
  // 쿼리 파싱 함수
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  const boardList = document.getElementById('subject-board');
  boardList.innerHTML = `<div style="color:#bbb;text-align:center;padding:12px 0;">게시글을 불러오는 중...</div>`;

  const subjectId = getQueryParam('subjectId');

  // 게시글 불러오는 함수
  async function loadPosts() {
    boardList.innerHTML = `<div style="color:#bbb;text-align:center;padding:12px 0;">게시글을 불러오는 중...</div>`;

    let posts = [];
    try {
      if (!subjectId || subjectId === 'all') {
        // 전체 게시글: 내가 등록한 모든 과목의 게시글 불러오기
        // 1. 내가 등록한 과목 조회
        const res = await fetch(
          'https://unidays-project.com/api/usersubjects',
          {
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error('내 과목 목록 불러오기 실패');
        const data = await res.json();
        const subjects = data.map((x) => x.subject);

        if (subjects.length === 0) {
          boardList.innerHTML = `<div style="color:#aaa;text-align:center;">등록된 과목이 없습니다.</div>`;
          return;
        }

        // 2. 각 과목별 게시글 다 불러오기
        const postPromises = subjects.map((subject) =>
          fetch(
            `https://unidays-project.com/api/notices/subject/${subject.id}`,
            {
              credentials: 'include',
            }
          )
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
        );
        const postsArr = await Promise.all(postPromises);
        posts = postsArr.flat();
      } else {
        // 특정 과목 게시글만
        const res = await fetch(
          `https://unidays-project.com/api/notices/subject/${subjectId}`,
          {
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error('게시글 목록 불러오기 실패');
        posts = await res.json();
      }
    } catch (e) {
      boardList.innerHTML = `<div style="color:red;text-align:center;">${e.message}</div>`;
      return;
    }

    if (!posts || posts.length === 0) {
      boardList.innerHTML = `<div style="color:#aaa;text-align:center;">등록된 게시물이 없습니다.</div>`;
      return;
    }

    // 최신순 정렬(내림차순)
    posts.sort((a, b) => (b.date > a.date ? 1 : -1));

    // 게시글 렌더링
    boardList.innerHTML = '';
    posts.forEach((post) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'board-item';
      postDiv.style.margin = '14px 0';
      postDiv.style.padding = '16px 20px';
      postDiv.style.background = '#f7f7fb';
      postDiv.style.borderRadius = '12px';
      postDiv.style.cursor = 'pointer';

      postDiv.onclick = () => {
        localStorage.setItem('latestSubjectPost', JSON.stringify(post));
        window.location.href = `homepg-written.html?id=${post.id}`;
      };

      postDiv.innerHTML = `
        <div class="board-title" style="font-weight:600;font-size:16px;">${
          post.title
        }</div>
        <div class="board-meta" style="font-size:13px;color:#888;margin:4px 0 2px 0;">
          ${(post.subject && post.subject.name) || ''} | ${post.date || ''}
        </div>
        <div class="board-content" style="font-size:14px;color:#444;">
          ${
            post.content
              ? post.content.slice(0, 38) +
                (post.content.length > 38 ? '...' : '')
              : ''
          }
        </div>
      `;
      boardList.appendChild(postDiv);
    });
  }

  // 페이지 진입 시 게시글 목록 로드
  loadPosts();

  // 탭/글쓰기 버튼(혹시 커스텀 필요하면 여기서 추가)
  // ... 네가 원래 쓰던 부분 건드리지 않음
});
