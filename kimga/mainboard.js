// 전공명 읽기 & 반영
const params = new URLSearchParams(window.location.search);
const major = params.get('major') || '~학과';
document.querySelector('.major').textContent = major;

// 과목 선택 기능: 클릭 시 라벤더색으로 토글
document.querySelectorAll('.subject').forEach((subj) => {
	subj.addEventListener('click', () => {
		subj.classList.toggle('selected');
	});
});

// 등록 버튼 클릭 시 알림 후 1.5초 뒤 페이지 이동
document.querySelector('.register-btn').addEventListener('click', () => {
	const selected = document.querySelectorAll('.subject.selected');
	if (selected.length === 0) {
		alert('과목을 선택해주세요.');
		return;
	}

	const subjectNames = Array.from(selected)
		.map((el) => el.querySelector('.subject-title').textContent)
		.join(', ');

	alert(`${subjectNames} 이(가) 등록되었습니다.`);

	setTimeout(() => {
		window.location.href = 'auto-event-register.html';
	}, 1500);
});

// 검색 버튼 기능
document.querySelectorAll('.menu-btn').forEach((btn) => {
	if (btn.textContent === '검색') {
		btn.addEventListener('click', () => {
			const query = prompt('검색할 과목명을 입력하세요:');
			if (!query) return;

			const subjects = document.querySelectorAll('.subject');
			let found = false;

			subjects.forEach((subj) => {
				const title = subj.querySelector('.subject-title').textContent;
				if (title.includes(query)) {
					subj.scrollIntoView({ behavior: 'smooth', block: 'center' });
					subj.classList.add('highlight');
					setTimeout(() => subj.classList.remove('highlight'), 1000);
					found = true;
				}
			});

			if (!found) alert('해당 과목을 찾을 수 없습니다.');
		});
	}
});
