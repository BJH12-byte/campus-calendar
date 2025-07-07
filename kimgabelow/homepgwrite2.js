document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('.title-input');
  const contentInput = document.querySelector('.content-input');
  const completeBtn = document.querySelector('.complete-button');
  const charCounter = document.querySelector('.char-counter');
  const dateDisplay = document.querySelector('.date-display'); // 날짜 div

  // 글자 수 카운터 업데이트
  contentInput.addEventListener('input', () => {
    const length = contentInput.textContent.trim().length;
    charCounter.textContent = `${length}/1000`;
  });

  completeBtn.addEventListener('click', () => {
    const title = titleInput.textContent.trim();
    const content = contentInput.textContent.trim();

    if (!title) {
      showCustomPopup(
        window.popupMessages?.titleRequired || '제목을 입력하세요.'
      );
      return;
    }
    if (!content) {
      showCustomPopup(
        window.popupMessages?.contentRequired || '내용을 입력하세요.'
      );
      return;
    }

    showYesNoPopup(
      window.popupMessages?.writePageConfirm || '일정확인 제대로 하셨나요?',
      () => {
        // ✅ 날짜 변환: YYYY.MM.DD -> YYYY-MM-DD (html의 date-display 이용)
        let dateText = dateDisplay ? dateDisplay.textContent.trim() : '';
        let date = '';
        if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateText)) {
          date = dateText.replace(/\./g, '-');
        } else {
          // 혹시라도 형식이 다르면 오늘 날짜로 대체
          const now = new Date();
          date = now.toISOString().slice(0, 10);
        }

        // ✅ 업로드된 이미지 또는 파일 URL 가져오기 (fileUrl, imageUrl은 서버 연동 없으면 null)
        let fileUrl = null;
        let imageUrl = null;

        const uploadedImage = localStorage.getItem('uploadedImage') || '';
        if (uploadedImage) {
          // 실제로 서버 업로드 연동 필요하면 이 부분 구현
          imageUrl = uploadedImage; // 일단 미사용
        }

        const payload = {
          title: title,
          content: content,
          date: date,
          fileUrl: fileUrl,
          imageUrl: imageUrl,
          type: 'SCHOOL',
        };

        // ✅ 글쓰기 → 백엔드 전송 (POST /api/notices)
        fetch('/api/notices', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error('공지 등록 실패');
            return res.json();
          })
          .then((data) => {
            // 성공 시 상세 페이지 이동
            window.location.href = `homepg-written.html?id=${data.id}`;
          })
          .catch((error) => {
            showCustomPopup('공지 등록 중 오류 발생: ' + error.message);
          });

        // uploadedImage 제거(이미지 업로드 기능과 연동 필요)
        localStorage.removeItem('uploadedImage');
      },
      () => {
        console.log('재확인 버튼 눌림 - 다시 확인!');
      }
    );
  });

  // 첨부 기능(로컬에 이미지 저장만, 서버 업로드는 별도 구현 필요)
  const cameraInput = document.getElementById('camera-input');
  const fileInput = document.getElementById('file-input');

  cameraInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('uploadedImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('uploadedImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  document.querySelectorAll('.attach-btn')[0].addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('photo-option-popup').style.display = 'block';
  });

  document.getElementById('option-gallery').addEventListener('click', () => {
    document.getElementById('photo-option-popup').style.display = 'none';
    document.getElementById('file-input').click();
  });

  document.getElementById('option-camera').addEventListener('click', () => {
    document.getElementById('photo-option-popup').style.display = 'none';
    document.getElementById('camera-input').click();
  });

  document.addEventListener('click', () => {
    document.getElementById('photo-option-popup').style.display = 'none';
  });
});
