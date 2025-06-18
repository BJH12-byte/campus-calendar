// login.js

document.addEventListener('DOMContentLoaded', function () {
	const loginBtn = document.getElementById('loginBtn');

	if (loginBtn) {
		loginBtn.addEventListener('click', function () {
			// 로그인 버튼 클릭 시 main.html로 이동
			window.location.href = 'main.html';
		});
	}
});
