function toggleMajorOptions() {
	const options = document.getElementById('majorOptions');
	options.style.display = options.style.display === 'flex' ? 'none' : 'flex';
}

function selectMajor(major) {
	document.getElementById('selectedMajor').innerText = major;
	toggleMajorOptions();
}

function submitForm() {
	const name = document.getElementById('name').value.trim();
	const studentId = document.getElementById('studentId').value.trim();
	const major = document.getElementById('selectedMajor').innerText;

	if (!name || !studentId || major === '전공 선택') {
		alert('모든 항목을 입력해주세요.');
		return;
	}

	if (!/^[0-9]+$/.test(studentId)) {
		alert('학번은 숫자만 입력해주세요.');
		return;
	}

	// ✅ 백엔드로 데이터 전송 예제
	// fetch('/api/signup', {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify({ name, studentId, major })
	// }).then(res => ...);

	// 전공별 페이지로 이동
	window.location.href = `mainboard.html?major=${encodeURIComponent(major)}`;
}
