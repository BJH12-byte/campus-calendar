document.addEventListener('DOMContentLoaded', () => {
  const subjectItems = document.querySelectorAll('.subject-item');

  subjectItems.forEach((item) => {
    item.addEventListener('click', () => {
      const subjectName = item.textContent.trim();

      switch (subjectName) {
        case '학교 일정':
          window.location.href = 'homepage2.html';
          break;
        case '전체':
          window.location.href = 'boards/all.html';
          break;
        case '전공or교양 1':
          window.location.href = 'boards/major1.html';
          break;
        case '창의적 사고와 코딩':
          window.location.href = 'boards/coding.html';
          break;
        case '이름순':
          window.location.href = 'boards/byname.html';
          break;
        case '과목5':
          window.location.href = 'boards/subject5.html';
          break;
        case '과목2':
          window.location.href = 'boards/subject2.html';
          break;
        case '과목3':
          window.location.href = 'boards/subject3.html';
          break;
        default:
          alert('해당 과목의 게시판이 아직 준비되지 않았습니다.');
      }
    });
  });
});
