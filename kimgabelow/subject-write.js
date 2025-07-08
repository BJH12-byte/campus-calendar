document.addEventListener('DOMContentLoaded', () => {
  // URL 파라미터에서 subjectId 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const urlSubjectId = urlParams.get('subjectId');

  const titleInput = document.querySelector('.title-input');
  const contentInput = document.querySelector('.content-input');
  const completeBtn = document.querySelector('.complete-button');
  const charCounter = document.querySelector('.char-counter');
  const dateDisplay = document.querySelector('.date-display');
  const pageTitle = document.querySelector('.page-title');

  // 1. 과목 정보 localStorage + URL 파라미터 모두에서 읽기
  let subjectId = null;
  let subjectName = null;
  try {
    const subjectObj = JSON.parse(localStorage.getItem('selectedSubjectObj'));
    if (subjectObj && subjectObj.id) {
      subjectId = String(subjectObj.id);
      subjectName = subjectObj.name || '';
    }
  } catch {}

  // URL subjectId가 있으면 무조건 덮어쓴다(우선순위)
  if (urlSubjectId) {
    subjectId = String(urlSubjectId);
    // subjectName도 localStorage에서 id가 일치할 때만 사용
    try {
      const subjectObj = JSON.parse(
        localStorage.getItem('selectedSubjectObj') || '{}'
      );
      if (subjectObj && String(subjectObj.id) === subjectId) {
        subjectName = subjectObj.name || '';
      }
    } catch {}
  }

  // 과목명 표시
  pageTitle.textContent = subjectName ? subjectName : '과목 선택 필요';

  // subjectId 없는 경우, 강제 복귀
  if (!subjectId) {
    alert('과목 정보가 올바르지 않습니다. 다시 과목을 선택하세요.');
    window.location.href = 'subject-choose.html';
    return;
  }

  // 2. 글자수 카운터
  contentInput.addEventListener('input', () => {
    const length = contentInput.textContent.trim().length;
    charCounter.textContent = `${length}/1000`;
  });

  // 3. 파일 업로드 함수 (PDF/이미지/엑셀 POST)
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
      .then((url) => cb(null, url))
      .catch((err) => cb(err));
  }

  // 4. 완료 버튼: 첨부파일 업로드 → 공지 등록 → OCR 등록
  completeBtn.addEventListener('click', () => {
    const title = titleInput.textContent.trim();
    const content = contentInput.textContent.trim();
    let dateText = dateDisplay ? dateDisplay.textContent.trim() : '';
    let date = '';
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateText)) {
      date = dateText.replace(/\./g, '-');
    } else {
      const now = new Date();
      now.setHours(now.getHours() + 9); // KST
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
      }
    );

    // 5. 공지(과목) 등록 후 OCR
    function registerNotice(fileUrl) {
      let imageUrl = null;
      const uploadedImage = localStorage.getItem('uploadedImage') || '';
      if (uploadedImage) imageUrl = uploadedImage;
      const payload = {
        title,
        content,
        date,
        fileUrl,
        imageUrl,
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
              // 등록 끝나면 과목정보/이미지 클린업
              localStorage.removeItem('selectedSubjectObj');
              localStorage.removeItem('uploadedImage');
              window.location.href = `subject-written.html?id=${data.id}`;
            })
            .catch((ocrError) => {
              showCustomPopup('OCR 일정 등록 중 오류: ' + ocrError.message);
              // 등록 실패 시에도 정보는 지움
              localStorage.removeItem('selectedSubjectObj');
              localStorage.removeItem('uploadedImage');
              window.location.href = `subject-written.html?id=${data.id}`;
            });
        })
        .catch((error) => {
          showCustomPopup('공지 등록 중 오류 발생: ' + error.message);
        });
    }
  });

  // 6. 첨부/카메라 팝업
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

  // 7. 이미지 첨부(카메라/갤러리)
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
  document.getElementById('file-input').addEventListener('change', (e) => {
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
