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
  allBtn.onclick = async () => {
    // 게시글 영역 초기화
    postListElem.innerHTML =
      '<div style="color:#bbb;text-align:center;padding:12px 0;">전체 게시글 불러오는 중...</div>';

    // 내가 등록한 과목들 GET
    let subjects = [];
    try {
      const res = await fetch('https://unidays-project.com/api/usersubjects', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('과목 목록 불러오기 실패');
      const data = await res.json();
      subjects = data.map((x) => x.subject);
    } catch (e) {
      postListElem.innerHTML = `<div style="color:red;text-align:center;">과목 목록 불러오기 실패</div>`;
      return;
    }
    if (subjects.length === 0) {
      postListElem.innerHTML = `<div style="color:#aaa;text-align:center;">등록된 과목이 없습니다.</div>`;
      return;
    }

    // 과목별 게시글 fetch → 병렬로 돌린다
    const fetchPromises = subjects.map((subj) =>
      fetch(`https://unidays-project.com/api/notices/subject/${subj.id}`, {
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => [])
    );

    const allPostsArr = await Promise.all(fetchPromises);
    // 다 합쳐서 단일 리스트로
    const allPosts = allPostsArr.flat();

    if (allPosts.length === 0) {
      postListElem.innerHTML = `<div style="color:#bbb;text-align:center;">등록된 게시물이 없습니다.</div>`;
      return;
    }

    // 최신순 정렬(선택사항)
    allPosts.sort((a, b) => (b.date > a.date ? 1 : -1));

    // 게시글 렌더링
    postListElem.innerHTML = '';
    allPosts.forEach((post) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-card';
      postDiv.style.margin = '12px 0';
      postDiv.style.padding = '14px 18px';
      postDiv.style.background = '#f7f7fb';
      postDiv.style.borderRadius = '10px';
      postDiv.style.cursor = 'pointer';
      postDiv.onclick = () => {
        // 상세 페이지로 이동
        localStorage.setItem('latestSubjectPost', JSON.stringify(post));
        window.location.href = `homepg-written.html?id=${post.id}`;
      };

      // 게시글 정보 표시
      postDiv.innerHTML = `
        <div style="font-weight:600;font-size:16px;">${post.title}</div>
        <div style="font-size:13px;color:#888;margin:4px 0 2px 0;">${
          post.subject ? post.subject.name : ''
        } | ${post.date || ''}</div>
        <div style="font-size:14px;color:#444;">${
          post.content
            ? post.content.slice(0, 38) +
              (post.content.length > 38 ? '...' : '')
            : ''
        }</div>
      `;
      postListElem.appendChild(postDiv);
    });
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
          // 과목별 게시판 이동
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
