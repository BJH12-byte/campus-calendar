document.addEventListener('DOMContentLoaded', () => {
	// ✅ 단순 메시지 팝업 (custom-popup)
	const customPopupHTML = `
    <div id="custom-popup" style="
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/></svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="white"/></svg>
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none"><path d="M11.6 25.4C4 17.8 0.9 8.5 4.7 4.7C7.8 1.6 14.4 3 20.8 7.7M25.4 11.6C33 19.2 36.1 28.5 32.3 32.3C29.2 35.4 22.6 33.9 16.2 29.3M32.3 4.7C36.1 8.5 33 17.8 25.4 25.4C17.8 33 8.5 36.1 4.7 32.3C1.6 29.2 3 22.6 7.7 16.2C8.9 14.5 10.2 13 11.6 11.6C19.2 4 28.5 0.9 32.3 4.7Z" stroke="#574AD3" stroke-width="1.5"/><circle cx="18.5" cy="18.5" r="4" stroke="#574AD3" stroke-width="1.5"/></svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="white"/></svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/></svg>
        </div>
        <div id="popup-message" style="
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          color: #574AD3;
          font-size: 16px;
          width: 80%;
          font-family: Pretendard Variable, sans-serif;
          font-weight: 600;
          text-align: center;
          white-space: pre-wrap;
        ">메시지 내용</div>
        <div style="position: absolute; top: 125px; left: 10px;">
          <svg width="300" height="2" viewBox="0 0 300 2" fill="none">
            <path d="M299 1L1 1" stroke="#BBB7F9" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div id="popup-confirm" style="
          position: absolute;
          top: 153px;
          left: 50%;
          transform: translateX(-50%);
          color: #574AD3;
          font-size: 16px;
          font-family: Pretendard Variable, sans-serif;
          font-weight: 500;
          cursor: pointer;
        ">확인</div>
      </div>
    </div>`;
	document.body.insertAdjacentHTML('beforeend', customPopupHTML);

	// ✅ Yes/No 팝업 (custom-popup-yesno)
	const yesnoPopupHTML = `
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/></svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="white"/></svg>
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none"><path d="M11.6 25.4C4 17.8 0.9 8.5 4.7 4.7C7.8 1.6 14.4 3 20.8 7.7M25.4 11.6C33 19.2 36.1 28.5 32.3 32.3C29.2 35.4 22.6 33.9 16.2 29.3M32.3 4.7C36.1 8.5 33 17.8 25.4 25.4C17.8 33 8.5 36.1 4.7 32.3C1.6 29.2 3 22.6 7.7 16.2C8.9 14.5 10.2 13 11.6 11.6C19.2 4 28.5 0.9 32.3 4.7Z" stroke="#574AD3" stroke-width="1.5"/><circle cx="18.5" cy="18.5" r="4" stroke="#574AD3" stroke-width="1.5"/></svg>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="white"/></svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L9.84776 5.07846L15.6085 5.87785L11.0641 9.84154L12.3038 15.6221L8 12.6954L3.69615 15.6221L4.9359 9.84154L0.391548 5.87785L6.15224 5.07846L8 0Z" fill="white"/></svg>
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
          width: 80%;
          white-space: pre-wrap;
        ">일정확인 제대로 하셨나요?</div>
        <div style="position: absolute; top: 132px; left: 0; width: 100%; height: 55px; overflow: hidden;">
          <svg width="300" height="2" viewBox="0 0 300 2" fill="none" style="position: absolute; left: 10px; top: 0;"><path d="M299 1L1 1" stroke="#BBB7F9" stroke-width="2" stroke-linecap="round"/></svg>
          <svg width="2" height="50" viewBox="0 0 2 50" fill="none" style="position: absolute; left: 162px; top: 0;"><path d="M1 0L1 55" stroke="#BBB7F9" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div id="popup-yesno-cancel" style="position: absolute; top: 145px; left: 25%; transform: translateX(-50%); color: #574AD3; font-size: 16px; font-family: Pretendard Variable, sans-serif; font-weight: 500; cursor: pointer;">재확인</div>
        <div id="popup-yesno-confirm" style="position: absolute; top: 145px; left: 75%; transform: translateX(-50%); color: #574AD3; font-size: 16px; font-family: Pretendard Variable, sans-serif; font-weight: 500; cursor: pointer;">네</div>
      </div>
    </div>`;
	document.body.insertAdjacentHTML('beforeend', yesnoPopupHTML);

	window.showCustomPopup = function (message, onConfirm) {
		const popup = document.getElementById('custom-popup');
		document.getElementById('popup-message').textContent = message;
		popup.style.display = 'block';
		document.getElementById('popup-confirm').onclick = () => {
			popup.style.display = 'none';
			if (typeof onConfirm === 'function') onConfirm();
		};
	};

	window.showYesNoPopup = function (message, onYes, onNo) {
		const popup = document.getElementById('custom-popup-yesno');
		document.getElementById('popup-message-yesno').textContent = message;
		popup.style.display = 'block';
		document.getElementById('popup-yesno-confirm').onclick = () => {
			popup.style.display = 'none';
			requestAnimationFrame(() => {
				// 핵심: 팝업 닫힌 후 안전하게 콜백 실행
				if (typeof onYes === 'function') onYes();
			});
		};
		document.getElementById('popup-yesno-cancel').onclick = () => {
			popup.style.display = 'none';
			if (typeof onNo === 'function') onNo();
		};
	};

	// ✅ 외부 JSON 메시지 불러와서 전역 변수에 저장
	fetch('popup_messages.json')
		.then((res) => res.json())
		.then((messages) => {
			window.popupMessages = messages;
			console.log('팝업 메시지 로드 완료:', messages);
		})
		.catch((err) => console.error('팝업 메시지 로드 실패:', err));
});
