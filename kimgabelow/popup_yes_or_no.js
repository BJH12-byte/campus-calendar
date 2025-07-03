document.addEventListener('DOMContentLoaded', () => {
	const popupHTML = `
    <div id="custom-popup-yesno" style="
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      background: transparent;
    ">
      <div style="
        width: 327px;
        height: 187px;
        position: relative;
        border-radius: 25px;
        background: #E6E6F2;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/>
          </svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="4" fill="white"/>
          </svg>
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
            <path d="M11.6 25.4C4 17.8 0.9 8.5 4.7 4.7C7.8 1.6 14.4 3 20.8 7.7M25.4 11.6C33 19.2 36.1 28.5 32.3 32.3C29.2 35.4 22.6 33.9 16.2 29.3M32.3 4.7C36.1 8.5 33 17.8 25.4 25.4C17.8 33 8.5 36.1 4.7 32.3C1.6 29.2 3 22.6 7.7 16.2C8.9 14.5 10.2 13 11.6 11.6C19.2 4 28.5 0.9 32.3 4.7Z" stroke="#574AD3" stroke-width="1.5"/>
            <circle cx="18.5" cy="18.5" r="4" stroke="#574AD3" stroke-width="1.5"/>
          </svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="4" fill="white"/>
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/>
          </svg>
        </div>

        <div id="popup-message-yesno" style="
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          color: #574AD3;
          font-size: 16px;
          font-family: Pretendard Variable, sans-serif;
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
        ">일정확인 제대로 하셨나요?</div>
<!-- ✅ 가로+세로선 wrapper 추가 -->
<div style="
  position: absolute;
  top: 132px;       /* 가로선 위치 */
  left: 0;
  width: 100%;
  height: 55px;     /* 버튼 영역 높이 */
  overflow: hidden; /* 이 div 범위를 넘어가는 건 안보이게 함 */
">
  <!-- 가로선 -->
  <svg width="300" height="2" viewBox="0 0 300 2" fill="none" style="
    position: absolute;
    left: 10px;
    top: 0;
  ">
    <path d="M299 1L1 1" stroke="#BBB7F9" stroke-width="2" stroke-linecap="round"/>
  </svg>

  <!-- 세로선 -->
  <svg width="2" height="50" viewBox="0 0 2 50" fill="none" style="
    position: absolute;
    left: 162px;
    top: 0;
  ">
    <path d="M1 0L1 55" stroke="#BBB7F9" stroke-width="2" stroke-linecap="round"/>
  </svg>
</div>

        <div id="popup-yesno-cancel" style="
          position: absolute;
          top: 145px;
          left: 25%;
          transform: translateX(-50%);
          color: #574AD3;
          font-size: 16px;
          font-family: Pretendard Variable, sans-serif;
          font-weight: 500;
          cursor: pointer;
        ">재확인</div>

        <div id="popup-yesno-confirm" style="
          position: absolute;
          top: 145px;
          left: 75%;
          transform: translateX(-50%);
          color: #574AD3;
          font-size: 16px;
          font-family: Pretendard Variable, sans-serif;
          font-weight: 500;
          cursor: pointer;
        ">네</div>
      </div>
    </div>
  `;

	document.body.insertAdjacentHTML('beforeend', popupHTML);

	window.showYesNoPopup = function (message, onYes, onNo) {
		const popup = document.getElementById('custom-popup-yesno');
		document.getElementById('popup-message-yesno').textContent = message;
		popup.style.display = 'block';

		document.getElementById('popup-yesno-confirm').onclick = () => {
			popup.style.display = 'none';
			if (typeof onYes === 'function') onYes();
		};
		document.getElementById('popup-yesno-cancel').onclick = () => {
			popup.style.display = 'none';
			if (typeof onNo === 'function') onNo();
		};
	};
});
