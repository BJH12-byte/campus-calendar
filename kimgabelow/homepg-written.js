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
							showCustomPopup('게시글이 내 프로필에 저장되었습니다!');
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
							const id = getParam('id');
							if (id) {
								let posts =
									JSON.parse(localStorage.getItem('posts_school')) || [];
								posts = posts.filter((p) => p.id !== id);
								localStorage.setItem('posts_school', JSON.stringify(posts));
								showCustomPopup('게시글이 삭제되었습니다.', () => {
									location.href = 'homepage2.html';
								});
							}
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

	// ✅ URL 파라미터로 id 받아오기
	const id = getParam('id');
	if (id) {
		const posts = JSON.parse(localStorage.getItem('posts_school')) || [];
		const post = posts.find((p) => p.id === id);

		if (post) {
			document.getElementById('post-title').innerText = post.title;
			document.getElementById('post-body').innerText = post.content;
			document.getElementById('post-date').innerText = post.date.split('T')[0];
			document.getElementById('post-subject').innerText = '학교 일정';

			const imageContainer = document.querySelector('.image-container');
			const postImage = document.getElementById('post-image');

			if (post.image) {
				postImage.src = post.image;
				imageContainer.style.display = 'block'; // 이미지 있을 때 보이기
			} else {
				postImage.removeAttribute('src');
				imageContainer.style.display = 'none'; // 이미지 없을 때 숨기기
			}
		} else {
			document.getElementById('post-title').innerText =
				'글을 찾을 수 없습니다.';
		}
	}

	// 쿼리스트링 id 읽는 함수
	function getParam(name) {
		const url = new URL(window.location.href);
		return url.searchParams.get(name);
	}
});
