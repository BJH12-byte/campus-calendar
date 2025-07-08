document.addEventListener('DOMContentLoaded', async () => {
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  const boardList = document.getElementById('subject-board');
  boardList.innerHTML = `<div style="color:#bbb;text-align:center;padding:12px 0;">게시글을 불러오는 중...</div>`;

  const subjectId = getQueryParam('subjectId');
  console.log('🚀 subjectId:', subjectId);

  async function loadPosts() {
    boardList.innerHTML = `<div style="color:#bbb;text-align:center;padding:12px 0;">게시글을 불러오는 중...</div>`;
    let posts = [];
    try {
      if (!subjectId || subjectId === 'all') {
        console.log('🔎 전체 게시글 모드 진입');
        const res = await fetch(
          'https://unidays-project.com/api/usersubjects',
          { credentials: 'include' }
        );
        console.log('✅ usersubjects fetch res.ok:', res.ok);
        if (!res.ok) throw new Error('내 과목 목록 불러오기 실패');
        const data = await res.json();
        console.log('📚 usersubjects data:', data);
        const subjects = data.map((x) => x.subject);

        if (subjects.length === 0) {
          boardList.innerHTML = `<div style="color:#aaa;text-align:center;">등록된 과목이 없습니다.</div>`;
          alert('과목 없음');
          return;
        }

        // 과목별 공지 불러오기
        const postPromises = subjects.map((subject) => {
          console.log('📢 불러오는 subject.id:', subject.id);
          return fetch(
            `https://unidays-project.com/api/notices/subject/${subject.id}`,
            { credentials: 'include' }
          )
            .then((r) => {
              console.log('⏩ 공지 fetch for subject', subject.id, 'ok?', r.ok);
              return r.ok ? r.json() : [];
            })
            .catch((err) => {
              console.error('❌ 공지 fetch 에러', err);
              return [];
            });
        });
        const postsArr = await Promise.all(postPromises);
        posts = postsArr.flat();
      } else {
        console.log('🔎 특정 과목 only. subjectId:', subjectId);
        const res = await fetch(
          `https://unidays-project.com/api/notices/subject/${subjectId}`,
          { credentials: 'include' }
        );
        console.log('✅ 특정 과목 fetch res.ok:', res.ok);
        if (!res.ok) throw new Error('게시글 목록 불러오기 실패');
        posts = await res.json();
      }
    } catch (e) {
      boardList.innerHTML = `<div style="color:red;text-align:center;">${e.message}</div>`;
      alert('🔥 예외 발생: ' + e.message);
      return;
    }

    console.log('🧾 최종 posts 배열:', posts);
    alert('posts 길이: ' + posts.length);

    if (!posts || posts.length === 0) {
      boardList.innerHTML = `<div style="color:#aaa;text-align:center;">등록된 게시물이 없습니다.</div>`;
      alert('게시물 없음 (posts.length == 0)');
      return;
    }

    // 최신순 정렬(내림차순)
    posts.sort((a, b) => (b.date < a.date ? 1 : -1));
    console.log('🗃️ 정렬 후 posts:', posts);

    boardList.innerHTML = '';
    posts.forEach((post, idx) => {
      alert(
        `렌더링: #${idx}\n제목: ${post.title}\nID: ${post.id}\n과목: ${
          (post.subject && post.subject.name) || '없음'
        }\n날짜: ${post.date}`
      );

      const postDiv = document.createElement('div');
      postDiv.className = 'board-item';
      postDiv.style.margin = '14px 0';
      postDiv.style.padding = '16px 20px';
      postDiv.style.background = '#f7f7fb';
      postDiv.style.borderRadius = '12px';
      postDiv.style.cursor = 'pointer';

      postDiv.onclick = () => {
        alert(`상세페이지 이동: post.id=${post.id}`);
        window.location.href = `homepg-written.html?id=${post.id}`;
      };

      postDiv.innerHTML = `
        <div class="board-title" style="font-weight:600;font-size:16px;">
          ${post.title || ''}
        </div>
        <div class="board-meta" style="font-size:13px;color:#888;margin:4px 0 2px 0;">
          ${(post.subject && post.subject.name) || ''} | ${post.date || ''}
        </div>
        <div class="board-content" style="font-size:14px;color:#444;">
          ${
            post.content
              ? post.content.length > 38
                ? post.content.slice(0, 38) + '...'
                : post.content
              : ''
          }
        </div>
      `;
      boardList.appendChild(postDiv);
      console.log('✅ board-item 생성됨:', postDiv);
    });

    // DOM에 board-item이 몇 개나 들어갔는지 확인
    setTimeout(() => {
      const allItems = document.querySelectorAll('.board-item');
      alert(`최종적으로 렌더링된 board-item 갯수: ${allItems.length}`);
      console.log('🌐 최종 board-item DOM 개수:', allItems.length);
    }, 500);
  }

  loadPosts();
});
