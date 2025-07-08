document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('.title-input');
  const contentInput = document.querySelector('.content-input');
  const completeBtn = document.querySelector('.complete-button');
  const charCounter = document.querySelector('.char-counter');
  const dateDisplay = document.querySelector('.date-display');
  const pageTitle = document.querySelector('.page-title');

  // ✅ 과목 정보: 로컬스토리지(subjectInfo) or URL파라미터(id, name)
  let subjectId = null;
  let subjectName = null;

  // 1. 우선 URL파라미터로 먼저 시도
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('subjectId') && urlParams.get('subjectName')) {
    subjectId = urlParams.get('subjectId');
    subjectName = urlParams.get('subjectName');
  } else {
    // 2. 로컬스토리지로 대체
    try {
      const subjectObj = JSON.parse(localStorage.getItem('selectedSubjectObj'));
      if (subjectObj && subjectObj.id && subjectObj.name) {
        subjectId = subjectObj.id;
        subjectName = subjectObj.name;
      }
    } catch {}
  }

  if (subjectName) {
    pageTitle.textContent = subjectName;
  } else {
    pageTitle.textContent = '과목 선택 필요';
  }

  // 글자 수 카운터
  contentInput.addEventListener('input', () => {
    const length = contentInput.textContent.trim().length;
    charCounter.textContent = `${length}/1000`;
  });

  // 파일 업로드 상태
  let uploadedFileUrl = null;

  // 파일 업로드 함수
  function uploadFileToServer(file, cb) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://unidays-project.com/api/notices/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('파일 업로드 실패');
        return res.text();
      })
      .then((url) => {
        cb(null, url);
      })
      .catch((err) => {
        cb(err);
      });
  }

  // 완료 버튼 클릭
  completeBtn.addEventListener('click', () => {
    const title = titleInput.textContent.trim();
    const content = contentInput.textContent.trim();
    let dateText = dateDisplay ? dateDisplay.textContent.trim() : '';
    let date = '';
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateText)) {
      date = dateText.replace(/\./g, '-');
    } else {
      const now = new Date();
      date = now.toISOString().slice(0, 10);
    }

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
    if (!subjectId || !subjectName) {
      showCustomPopup('과목 정보를 확인하세요.');
      return;
    }

    showYesNoPopup(
      window.popupMessages?.writePageConfirm || '일정확인 제대로 하셨나요?',
      () => {
        // 1. 파일 업로드(첨부 있으면), 없으면 바로 진행
        const fileInputElem = document.getElementById('file-input');
        const hasFile = fileInputElem && fileInputElem.files.length > 0;
        if (hasFile) {
          uploadFileToServer(fileInputElem.files[0], (err, fileUrl) => {
            if (err) {
              showCustomPopup('파일 업로드 실패: ' + err.message);
              return;
            }
            registerNotice(fileUrl);
          });
        } else {
          registerNotice(null);
        }
      },
      () => {
        // NO 클릭 시
        console.log('재확인 버튼 눌림 - 다시 확인!');
      }
    );

    // 실제 공지 등록 함수
    function registerNotice(fileUrl) {
      let imageUrl = null;
      const uploadedImage = localStorage.getItem('uploadedImage') || '';
      if (uploadedImage) imageUrl = uploadedImage;

      const payload = {
        title: title,
        content: content,
        date: date,
        fileUrl: fileUrl,
        imageUrl: imageUrl,
        type: 'SUBJECT',
        subject: { id: subjectId, name: subjectName },
      };

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
          // OCR 자동 등록
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
              // 필요하면 showCustomPopup(msg);
              window.location.href = `subject-written.html?id=${data.id}`;
            })
            .catch((ocrError) => {
              showCustomPopup('OCR 일정 등록 중 오류: ' + ocrError.message);
              window.location.href = `subject-written.html?id=${data.id}`;
            });
        })
        .catch((error) => {
          showCustomPopup('공지 등록 중 오류 발생: ' + error.message);
        });

      localStorage.removeItem('uploadedImage');
    }
  });

  // 첨부/카메라 팝업
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

  // 카메라 이미지 저장
  document.getElementById('camera-input').addEventListener('change', (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('uploadedImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // 파일 업로드(이미지일 경우, 실제 fileUrl은 PDF만 의미)
  document.getElementById('file-input').addEventListener('change', (e) => {
    // 파일 첨부는 업로드 함수에서 처리
    // 이미지는 base64로 저장(미리보기)
    if (e.target.files.length) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem('uploadedImage', reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });
});
