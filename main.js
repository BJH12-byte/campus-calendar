// main.js

document.addEventListener('DOMContentLoaded', () => {
	// ------------------ [1] 화면 전환 기능 ------------------
	const screens = document.querySelectorAll('.screen');
	const buttons = document.querySelectorAll('.next-btn');

	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const targetId = button.getAttribute('data-target');

			screens.forEach((screen) => {
				screen.style.display = 'none';
			});

			const targetScreen = document.getElementById(targetId);
			if (targetScreen) {
				targetScreen.style.display = 'block';
			}
		});
	});

	// ------------------ [2] 과목 선택 → 리스트 추가 기능 ------------------
	const subjectButtons = document.querySelectorAll('.subject-btn');
	const myList = document.getElementById('mySubjectList');
	const selectedSubjects = new Set(); // 중복 방지용

	subjectButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const subject = btn.dataset.subject;

			if (!selectedSubjects.has(subject)) {
				const li = document.createElement('li');
				li.textContent = subject;
				myList.appendChild(li);
				selectedSubjects.add(subject);
			} else {
				alert(`${subject}은 이미 추가되어 있어요.`);
			}
		});
	});
});
