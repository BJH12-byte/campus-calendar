document.addEventListener('DOMContentLoaded', () => {
  // header-top 로드
  fetch('header-top.html')
    .then((res) => res.text())
    .then((html) => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      headerPlaceholder.innerHTML = html;

      // header-controls 로드
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
          const latestPostStr = localStorage.getItem('latestSchoolPost');
          if (!latestPostStr) {
            alert('삭제할 게시글이 없습니다.');
            return;
          }

          const post = JSON.parse(latestPostStr);

          let posts = JSON.parse(localStorage.getItem('posts_school')) || [];
          posts = posts.filter(
            (p) => !(p.title === post.title && p.date === post.date)
          );

          localStorage.setItem('posts_school', JSON.stringify(posts));
          localStorage.removeItem('latestSchoolPost');

          alert('게시글이 삭제되었습니다.');
          location.href = 'homepage2.html';
        });
      }

      // 수정팝업 저장 버튼
      document.getElementById('save-edit').addEventListener('click', () => {
        const titleEl = document.getElementById('post-title');
        const bodyEl = document.getElementById('post-body');
        const updatedTitle = titleEl.innerText;
        const updatedBody = bodyEl.innerText;

        const latestPostStr = localStorage.getItem('latestSchoolPost');
        if (!latestPostStr) {
          alert('저장할 게시글이 없습니다.');
          return;
        }
        const latestPost = JSON.parse(latestPostStr);

        let posts = JSON.parse(localStorage.getItem('posts_school')) || [];
        const index = posts.findIndex(
          (p) => p.title === latestPost.title && p.date === latestPost.date
        );

        if (index !== -1) {
          posts[index].title = updatedTitle;
          posts[index].content = updatedBody;
          localStorage.setItem('posts_school', JSON.stringify(posts));
        }

        latestPost.title = updatedTitle;
        latestPost.content = updatedBody;
        localStorage.setItem('latestSchoolPost', JSON.stringify(latestPost));

        titleEl.setAttribute('contenteditable', 'false');
        bodyEl.setAttribute('contenteditable', 'false');
        document.getElementById('edit-popup').style.display = 'none';

        alert('게시글이 수정되었습니다.');
      });

      // 수정팝업 취소 버튼
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

  // ✅ 로컬스토리지에서 게시글 표시 + 이미지 표시 로직 수정
  const latestPostStr = localStorage.getItem('latestSchoolPost');
  if (latestPostStr) {
    const post = JSON.parse(latestPostStr);
    document.getElementById('post-title').innerText = post.title;
    document.getElementById('post-body').innerText = post.content;
    document.getElementById('post-date').innerText = post.date.split('T')[0];

    const imageContainer = document.querySelector('.image-container');
    const postImage = document.getElementById('post-image');

    if (post.image) {
      postImage.src = post.image;
      imageContainer.style.display = 'block'; // ✅ 이미지 있을 때 컨테이너 표시
    } else {
      imageContainer.style.display = 'none'; // ✅ 이미지 없으면 컨테이너 숨김
    }
  }
});
