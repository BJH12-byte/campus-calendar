document.addEventListener('DOMContentLoaded', () => {
  // 1. URL 파라미터에서 id(게시글 id)만 읽어온다
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    document.getElementById('post-body').innerText =
      '글 정보를 찾을 수 없습니다.';
    return;
  }

  // 2. 게시글 정보 API로 불러오기
  fetch(`https://unidays-project.com/api/notices/${postId}`, {
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) throw new Error('게시글 불러오기 실패');
      return res.json();
    })
    .then((post) => {
      // 제목, 본문, 날짜, 과목, 이미지 전부 api 데이터에서 직접 사용
      document.getElementById('post-title').innerText =
        post.title || '제목 없음';
      document.getElementById('post-body').innerText =
        post.content || '내용 없음';
      document.getElementById('post-date').innerText =
        (post.date && post.date.replace(/-/g, '.')) || 'YYYY.MM.DD';
      document.getElementById('post-subject').innerText =
        (post.subject && post.subject.name) || '과목명 없음';

      // 이미지(있으면 표시)
      if (post.imageUrl) {
        document.getElementById('post-image').src = post.imageUrl;
        document.getElementById('post-image').style.display = 'block';
      } else {
        document.getElementById('post-image').style.display = 'none';
      }

      // 저장 버튼
      document.querySelector('.save-button').onclick = () => {
        // 원하는대로 로컬저장/서버저장 등 변경 가능
        alert('게시글이 내 프로필에 저장되었습니다!');
      };

      // 수정/삭제 팝업
      const moreBtn = document.querySelector('.more-button');
      const morePopup = document.getElementById('more-option-popup');
      moreBtn.onclick = (e) => {
        e.stopPropagation();
        morePopup.style.display =
          morePopup.style.display === 'block' ? 'none' : 'block';
      };
      document.addEventListener('click', (e) => {
        if (
          morePopup.style.display === 'block' &&
          !morePopup.contains(e.target) &&
          !moreBtn.contains(e.target)
        ) {
          morePopup.style.display = 'none';
        }
      });

      // 수정 버튼 (subject-write.html로 이동, id파라미터 전달)
      document.getElementById('option-edit').onclick = () => {
        location.href = `subject-write.html?id=${postId}`;
      };
      // 삭제 버튼 (API 기반)
      document.getElementById('option-delete').onclick = () => {
        if (!confirm('정말 삭제할까요?')) return;
        fetch(`https://unidays-project.com/api/notices/${postId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error('삭제 실패');
            alert('게시글이 삭제되었습니다.');
            location.href = 'subjectboard.html';
          })
          .catch((err) => alert('삭제 중 오류: ' + err.message));
      };
    })
    .catch((e) => {
      document.getElementById('post-body').innerText =
        '글 정보를 불러오는 데 실패했습니다.';
    });
});
