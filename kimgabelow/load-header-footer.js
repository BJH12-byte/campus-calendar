document.addEventListener('DOMContentLoaded', () => {
	fetch('header-top.html')
		.then((res) => res.text())
		.then((html) => {
			document.getElementById('header-placeholder').innerHTML = html;
		})
		.catch((err) => console.error('header-top 로드 실패:', err));

	fetch('footer-nav.html')
		.then((res) => res.text())
		.then((html) => {
			document.getElementById('footer-placeholder').innerHTML = html;
		})
		.catch((err) => console.error('footer-nav 로드 실패:', err));
});
