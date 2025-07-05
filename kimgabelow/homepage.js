document.addEventListener('DOMContentLoaded', () => {
	// ✅ 기존 글목록 렌더링 로직
	const schoolPostsStr = localStorage.getItem('posts_school');
	if (schoolPostsStr) {
		const posts = JSON.parse(schoolPostsStr);
		const board = document.getElementById('school-schedule-board');

		if (board) {
			board.innerHTML = ''; // 기존 내용을 초기화 후 렌더링
			posts
				.slice()
				.reverse()
				.forEach((post, index) => {
					const item = document.createElement('div');
					item.className = 'board-item';
					item.onclick = () => {
						localStorage.setItem('latestSchoolPost', JSON.stringify(post));
						window.location.href = `homepg-written.html?id=${index}`;
					};

					const content = document.createElement('div');
					content.className = 'board-content';

					const title = document.createElement('div');
					title.className = 'board-title';
					title.innerText = post.title;
					content.appendChild(title);

					const thumbnail = document.createElement('div');
					thumbnail.className = 'thumbnail';

					if (post.image) {
						const img = document.createElement('img');
						img.src = post.image;
						img.alt = '썸네일';
						thumbnail.appendChild(img);
					} else {
						thumbnail.innerText = 'No Image';
					}

					item.appendChild(content);
					item.appendChild(thumbnail);
					board.appendChild(item);
				});
		}
	}

	// ✅ 탭 클릭 이벤트 처리 로직만 추가
	const tabs = document.querySelectorAll('.tab');
	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			tabs.forEach((t) => t.classList.remove('active'));
			tab.classList.add('active');

			if (tab.dataset.tab === 'school-schedule') {
				document.getElementById('school-schedule-board').style.display =
					'block';
			} else if (tab.dataset.tab === 'subject-board') {
				window.location.href = 'subjectselect.html';
			}
		});
	});
});
