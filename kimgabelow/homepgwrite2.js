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
				// ✅ 글쓰기 시 데이터 로컬스토리지에 저장
				const post = {
					title,
					content,
					date: new Date().toISOString(),
					image: localStorage.getItem('uploadedImage') || '',
				};
				localStorage.setItem('latestPost', JSON.stringify(post));

				window.location.href = 'homepg-written.html';
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
