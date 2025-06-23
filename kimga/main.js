// main.js

// 화면 전환 핸들링
const nextButtons = document.querySelectorAll('.next-button, .next-btn');

nextButtons.forEach((btn) => {
	btn.addEventListener('click', () => {
		const current = btn.closest('.screen');
		const targetId = btn.dataset.target;
		const target = document.getElementById(targetId);

		if (current && target) {
			current.style.display = 'none';
			target.style.display = 'block';
		}
	});
});

// 과목 버튼 클릭 시 리스트에 추가
const subjectButtons = document.querySelectorAll('.subject-btn');
const mySubjectList = document.getElementById('mySubjectList');

subjectButtons.forEach((btn) => {
	btn.addEventListener('click', () => {
		const subjectName = btn.textContent;
		const li = document.createElement('li');
		li.textContent = subjectName;
		mySubjectList.appendChild(li);
	});
});
