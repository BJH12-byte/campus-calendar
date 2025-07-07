document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('.title-input');
  const contentInput = document.querySelector('.content-input');
  const completeBtn = document.querySelector('.complete-button');
  const charCounter = document.querySelector('.char-counter');
  const dateDisplay = document.querySelector('.date-display'); // 날짜 div

  // 첨부파일 상태
  let attachedFile = null;
  let fileUrl = null;

  // 글자 수 카운터 업데이트
  contentInput.addEventListener('input', () => {
    const length = contentInput.textContent.trim().length;
    charCounter.textContent = `${length}/1000`;
  });

  // 파일 input 이벤트
  const cameraInput = document.getElementById('camera-input');
  const fileInput = document.getElementById('file-input');

  // 이미지/파일 첨부(카메라/갤러리)
  cameraInput.addEventListener('change', handleFileAttach);
  fileInput.addEventListener('change', handleFileAttach);

  function handleFileAttach(e) {
    if (e.target.files.length) {
      attachedFile = e.target.files[0];
    }
  }

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

  // “완료” 버튼 클릭
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
      async () => {
        // 날짜 변환: YYYY.MM.DD -> YYYY-MM-DD
        let dateText = dateDisplay ? dateDisplay.textContent.trim() : '';
        let date = '';
        if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateText)) {
          date = dateText.replace(/\./g, '-');
        } else {
          const now = new Date();
          date = now.toISOString().slice(0, 10);
        }

        // *** 파일/이미지 첨부시 서버 업로드 ***
        if (attachedFile) {
          try {
            const uploadForm = new FormData();
            uploadForm.append('file', attachedFile);
            const uploadRes = await fetch(
              'https://unidays-project.com/api/notices/upload',
              {
                method: 'POST',
                credentials: 'include',
                body: uploadForm,
              }
            );
            if (!uploadRes.ok) throw new Error('파일 업로드 실패');
            fileUrl = await uploadRes.text(); // 서버가 "/uploads/xxx.pdf" 등 반환
          } catch (e) {
            showCustomPopup('파일 업로드 중 오류 발생: ' + e.message);
            return;
          }
        }

        const payload = {
          title: title,
          content: content,
          date: date,
          fileUrl: fileUrl, // null이거나 "/uploads/xxx"
          imageUrl: null, // 필요시 추가 구현
          type: 'SCHOOL',
        };

        // 공지 등록
        fetch('https://unidays-project.com/api/notices', {
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
            // OCR 일정 등록 자동 호출
            fetch(`https://unidays-project.com/api/notices/${data.id}/save`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((ocrRes) => {
                if (!ocrRes.ok) throw new Error('OCR 일정 등록 실패');
                return ocrRes.text();
              })
              .then((msg) => {
                // 필요시 showCustomPopup(msg);
                window.location.href = `homepg-written.html?id=${data.id}`;
              })
              .catch((ocrError) => {
                showCustomPopup('OCR 일정 등록 중 오류: ' + ocrError.message);
                window.location.href = `homepg-written.html?id=${data.id}`;
              });
          })
          .catch((error) => {
            showCustomPopup('공지 등록 중 오류 발생: ' + error.message);
          });

        attachedFile = null;
      },
      () => {
        console.log('재확인 버튼 눌림 - 다시 확인!');
      }
    );
  });
});
