document.addEventListener('DOMContentLoaded', () => {
	const titleInput = document.querySelector('.title-input');
	const contentInput = document.querySelector('.content-input');
	const completeBtn = document.querySelector('.complete-button');
	const charCounter = document.querySelector('.char-counter');

	// 글자 수 카운터 업데이트
	contentInput.addEventListener('input', () => {
		const length = contentInput.textContent.trim().length;
		charCounter.textContent = `${length}/1000`;
	});

	completeBtn.addEventListener('click', () => {
		const title = titleInput.textContent.trim();
		const content = contentInput.textContent.trim();

		if (!title) {
			showCustomPopup(window.popupMessages.titleRequired);
			return;
		}
		if (!content) {
			showCustomPopup(window.popupMessages.contentRequired);
			return;
		}

		showYesNoPopup(
			window.popupMessages?.writePageConfirm || '일정확인 제대로 하셨나요?',
			() => {
				// ✅ 고유 ID 생성
				const id = Date.now().toString();

				// ✅ 업로드된 이미지 복사 후 업로드 이미지 제거
				const uploadedImage = localStorage.getItem('uploadedImage') || '';

				// ✅ 글쓰기 시 데이터 로컬스토리지에 누적 저장
				const post = {
					id,
					title,
					content,
					date: new Date().toISOString(),
					image: uploadedImage,
				};

				// 학교 일정 배열로 누적
				let posts = JSON.parse(localStorage.getItem('posts_school')) || [];
				posts.push(post);
				localStorage.setItem('posts_school', JSON.stringify(posts));

				// 최신 글은 개별적으로 유지 (선택적)
				localStorage.setItem('latestSchoolPost', JSON.stringify(post));

				// uploadedImage 제거 -> 이후 다른 글 작성에 영향 방지
				localStorage.removeItem('uploadedImage');

				window.location.href = `homepg-written.html?id=${id}`;
			},
			() => {
				console.log('재확인 버튼 눌림 - 다시 확인!');
			}
		);
	});

	// 첨부 기능
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
