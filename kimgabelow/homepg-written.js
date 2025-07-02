document.addEventListener('DOMContentLoaded', () => {
	// header-top 로드
	fetch('header-top.html')
		.then((res) => res.text())
		.then((html) => {
			const headerPlaceholder = document.getElementById('header-placeholder');
			headerPlaceholder.innerHTML = html;

			// header-controls 로드해서 header-top 밑에 추가
			fetch('header-controls.html')
				.then((res) => res.text())
				.then((controlsHtml) => {
					const container = document.createElement('div');
					container.innerHTML = controlsHtml;
					headerPlaceholder.appendChild(container);

					// ✅ 저장/더보기 버튼 이벤트 등록
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

					if (optionEdit) {
						optionEdit.addEventListener('click', () => {
							location.href = 'subjectwritten.html';
						});
					}

					if (optionDelete) {
						optionDelete.addEventListener('click', () => {
							localStorage.removeItem('latestPost');
							alert('게시글이 삭제되었습니다.');
							location.href = 'subjectboard.html';
						});
					}
				})
				.catch((err) => console.error('header-controls 로드 실패:', err));
		})
		.catch((err) => console.error('header-top 로드 실패:', err));

	// footer-nav 로드
	fetch('footer-nav.html')
		.then((res) => res.text())
		.then((html) => {
			document.getElementById('footer-placeholder').innerHTML = html;
		})
		.catch((err) => console.error('footer-nav 로드 실패:', err));

	// ✅ 로컬스토리지에서 게시글 표시
	const latestPostStr = localStorage.getItem('latestPost');
	if (latestPostStr) {
		const post = JSON.parse(latestPostStr);
		document.getElementById('post-title').innerText = post.title;
		document.getElementById('post-body').innerText = post.content;
		document.getElementById('post-date').innerText = post.date.split('T')[0];
		if (post.image) {
			document.getElementById('post-image').src = post.image;
		}
	}
});
