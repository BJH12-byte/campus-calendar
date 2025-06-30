document.addEventListener('DOMContentLoaded', () => {
	const startButton = document.querySelector('.start-button');
	const googleButton = document.querySelector('.google-button');

	if (startButton) {
		startButton.addEventListener('click', () => {
			window.location.href = 'signup.html'; // 시작하기 후 이동
		});
	}

	if (googleButton) {
		googleButton.addEventListener('click', () => {
			window.location.href = 'signup.html'; // 구글 로그인 페이지 이동
		});
	}
});
