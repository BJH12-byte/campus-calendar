document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelectorAll('.tab');
	const tabIndicator = document.querySelector('.tab-indicator');

	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			tabs.forEach((t) => t.classList.remove('active'));
			tab.classList.add('active');

			if (tab.dataset.tab === 'school-schedule') {
				document.getElementById('school-schedule-board').style.display =
					'block';
				document.getElementById('subject-board').style.display = 'none';
			} else if (tab.dataset.tab === 'subject-board') {
				window.location.href = 'subjectselect.html';
			}
		});
	});

	fetch('footer-nav.html')
		.then((res) => res.text())
		.then((html) => {
			document.getElementById('footer-placeholder').innerHTML = html;
		})
		.catch((err) => console.error('footer-nav 로드 실패:', err));

	// ✅ 글쓰기 버튼 클릭 시 이동
	const writeBtn = document.querySelector('.write-btn');
	if (writeBtn) {
		writeBtn.addEventListener('click', () => {
			window.location.href = 'homepgwrite.html';
		});
	}
});
document.addEventListener('DOMContentLoaded', () => {
	// ...

	// ✅ 글목록에 최신글 추가
	const latestPostStr = localStorage.getItem('latestPost');
	if (latestPostStr) {
		const post = JSON.parse(latestPostStr);
		const board = document.getElementById('school-schedule-board');

		if (board) {
			const item = document.createElement('div');
			item.className = 'board-item';
			item.onclick = () => {
				window.location.href = 'homepg-written.html';
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
			board.prepend(item);
		}
	}
});
