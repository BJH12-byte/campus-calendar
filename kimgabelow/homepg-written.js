document.addEventListener('DOMContentLoaded', () => {
  // 게시글 id를 URL에서 받음
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    alert('잘못된 접근입니다. 게시글 ID가 없습니다.');
    window.location.href = 'subjectboard.html';
    return;
  }

  // header-top 로드
  fetch('header-top.html')
    .then((res) => res.text())
    .then((html) => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      headerPlaceholder.innerHTML = html;
      return fetch('header-home.html');
    })
    .then((res) => res.text())
    .then((controlsHtml) => {
      const container = document.createElement('div');
      container.innerHTML = controlsHtml;
      document.getElementById('header-placeholder').appendChild(container);

      // 저장(스크랩) 버튼
      const saveBtn = container.querySelector('.save-button');
      const moreBtn = container.querySelector('.more-button');
      const morePopup = container.querySelector('#more-option-popup');

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          // 현재 상세 데이터를 localStorage로 스크랩
          const post = {
            title: document.getElementById('post-title').innerText,
            content: document.getElementById('post-body').innerText,
            date: document.getElementById('post-date').innerText,
            subject: document.getElementById('post-subject').innerText,
            image: document.getElementById('post-image').src,
          };
          localStorage.setItem('myProfilePost', JSON.stringify(post));
          alert('게시글이 내 프로필에 저장되었습니다!');
        });
      }

      if (moreBtn) {
        moreBtn.addEventListener('click', () => {
          morePopup.style.display =
            morePopup.style.display === 'block' ? 'none' : 'block';
        });
      }

      const optionEdit = container.querySelector('#option-edit');
      const optionDelete = container.querySelector('#option-delete');

      let originalTitle = '';
      let originalBody = '';

      if (optionEdit) {
        optionEdit.addEventListener('click', () => {
          const titleEl = document.getElementById('post-title');
          const bodyEl = document.getElementById('post-body');

          originalTitle = titleEl.innerText;
          originalBody = bodyEl.innerText;

          titleEl.setAttribute('contenteditable', 'true');
          bodyEl.setAttribute('contenteditable', 'true');

          document.getElementById('edit-popup').style.display = 'block';
          morePopup.style.display = 'none';

          alert(
            '수정 모드로 전환했습니다. 수정 후 저장/취소 버튼을 사용하세요.'
          );
        });
      }

      if (optionDelete) {
        optionDelete.addEventListener('click', () => {
          if (!confirm('정말 삭제하시겠습니까?')) return;
          // 실제 API로 삭제 요청(백엔드와 약속된 방식이어야 함)
          fetch(`https://unidays-project.com/api/notices/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
          })
            .then((res) => {
              if (!res.ok) throw new Error('삭제 실패');
              alert('게시글이 삭제되었습니다.');
              location.href = 'subjectboard.html';
            })
            .catch((e) => {
              alert('삭제 중 오류: ' + e.message);
            });
        });
      }

      // 수정팝업 저장/취소(여기는 실제 DB 수정과 연동하려면 추가 API 필요)
      document.getElementById('save-edit').addEventListener('click', () => {
        const titleEl = document.getElementById('post-title');
        const bodyEl = document.getElementById('post-body');
        const updatedTitle = titleEl.innerText;
        const updatedBody = bodyEl.innerText;

        // 실제 API로 수정 요청 필요(백엔드와 약속된 방식이어야 함)
        fetch(`https://unidays-project.com/api/notices/${postId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: updatedTitle, content: updatedBody }),
        })
          .then((res) => {
            if (!res.ok) throw new Error('수정 실패');
            alert('게시글이 수정되었습니다.');
            // 수정모드 종료
            titleEl.setAttribute('contenteditable', 'false');
            bodyEl.setAttribute('contenteditable', 'false');
            document.getElementById('edit-popup').style.display = 'none';
          })
          .catch((e) => {
            alert('수정 중 오류: ' + e.message);
          });
      });

      document.getElementById('cancel-edit').addEventListener('click', () => {
        const titleEl = document.getElementById('post-title');
        const bodyEl = document.getElementById('post-body');

        titleEl.innerText = originalTitle;
        bodyEl.innerText = originalBody;

        titleEl.setAttribute('contenteditable', 'false');
        bodyEl.setAttribute('contenteditable', 'false');
        document.getElementById('edit-popup').style.display = 'none';

        alert('수정을 취소했습니다.');
      });
    })
    .catch((err) => console.error('header-controls 로드 실패:', err));

  // footer-nav 로드
  fetch('footer-nav.html')
    .then((res) => res.text())
    .then((html) => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch((err) => console.error('footer-nav 로드 실패:', err));

  // ✅ 2. 서버에서 상세 게시글 API로 불러옴!
  fetch(`https://unidays-project.com/api/notices/${postId}`, {
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) throw new Error('게시글 상세 불러오기 실패');
      return res.json();
    })
    .then((post) => {
      // 제목, 본문, 날짜, 과목명 뿌리기
      document.getElementById('post-title').innerText = post.title;
      document.getElementById('post-body').innerText = post.content;
      document.getElementById('post-date').innerText =
        post.date?.split('T')[0] || post.date;

      // 과목명 분기
      if (post.subject && post.subject.name) {
        document.getElementById('post-subject').innerText = post.subject.name;
      } else {
        document.getElementById('post-subject').innerText =
          post.subjectName || '과목 없음';
      }

      // 이미지 뿌리기 (서버 주소 붙이기)
      const imageContainer = document.querySelector('.image-container');
      const postImage = document.getElementById('post-image');
      if (post.imageUrl) {
        // 만약 imageUrl이 상대경로면 절대경로로 만들어야 함
        let url = post.imageUrl.startsWith('/')
          ? 'https://unidays-project.com' + post.imageUrl
          : post.imageUrl;
        postImage.src = url;
        imageContainer.style.display = 'block';
      } else if (post.image) {
        postImage.src = post.image;
        imageContainer.style.display = 'block';
      } else {
        imageContainer.style.display = 'none';
      }
    })
    .catch((e) => {
      document.getElementById('post-title').innerText = '오류 발생';
      document.getElementById('post-body').innerText = e.message;
    });
});
