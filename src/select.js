$(function () {
  // 이전에 클릭한 돔을 저장할 변수정의
  // 이전에 클릭한 돔의 값에 접근하기 위해 전역으로 설정
  let previousDOMClicked;
  let DOMtoBeDeleted;

  // 1.
  // li 돔을 클릭할 때,
  $(document).on('click', 'li', function (e) {
    // console.log('previousDOMClicked', previousDOMClicked);
    //만약 키보드의 shiftkey와 이전에 클릭한 돔이 있으면

    //2. 이벤트에 shiftkey가 있는지를 체크
    if (e.shiftKey && previousDOMClicked) {
      //처음 스타트할 기준을 세우기 위한 변수,
      //유저가 처음에 클릭한 아이템의 인덱스를 계산한다.
      //유저가 shiftkey와 함께 마우스 클릭하기 전의 돔의 인덱스를 구한다.
      let previousDOMClickedIndex = $('li').index(previousDOMClicked);
      // console.log('previousDOMClickedIndex', previousDOMClickedIndex);

      //클릭이벤트에서 this는 내가 당시 클릭한 그것을 의미해서
      //클릭한 그것(this)이 현재current라고 의미한다.
      //shiftKey와 함께 유저가 (현재)클릭한 그것인 this의 인덱스를 구한다.
      let DomClickedIndexWithShiftKey = $('li').index(this);
      // console.log('DomClickedIndexWithShiftKey', DomClickedIndexWithShiftKey);

      //shiftkey를 누른상태에서 어떤 요소를 누르면 해당 요소는 제외하는 로직도 추가해보자
      //클릭한 그 대상을 배열에서 제거한다.

      let range =
        previousDOMClickedIndex < DomClickedIndexWithShiftKey
          ? $('li').slice(
              previousDOMClickedIndex,
              DomClickedIndexWithShiftKey + 1
            )
          : $('li').slice(
              DomClickedIndexWithShiftKey,
              previousDOMClickedIndex + 1
            );

      range.addClass('active');

      // console.log('e', e.target);
      // console.log('this', this);
    } else {
      // 만약 shiftKey 키와 같이 클릭하지 않고,
      // 그냥 마우스로 아이템 클릭 할 경우,
      // 모든 아이템의 클래스, active를 삭제하고
      //2.
      $('li').removeClass('active');
      // 클릭한 돔에 클래스, active를 더한다.
      // 3.
      $(this).addClass('active');
    }
    // 처음 스타트를 지정하기 위해,
    // 처음 클릭한 돔을 저장할 용도
    // 경우1) e.shiftKey를 누르면서 돔을 클릭해도
    // => e.shiftKey과 돔의 값이 둘다 있어야 하는데,
    // 둘중 하나라도 없기 때문에,
    // 경우2) 그냥 마우스를 클릭한 경우,
    //4.
    previousDOMClicked = this;
  });
});

$(document).ready(function () {
  var shiftKeyPressed = false;
  // Shift 키를 누를 때와 떼었을 때의 이벤트 리스너를 추가합니다.
  $(document).on('keydown keyup', function (event) {
    if (event.shiftKey) {
      shiftKeyPressed = true;
    } else {
      shiftKeyPressed = false;
    }
  });

  // "delete-item" 클래스를 가진 모든 요소에 대한 클릭 이벤트 리스너를 추가합니다.
  $('.delete-item').on('click', function () {
    // Shift 키가 눌려있는 경우 "to-be-deleted" 클래스를 추가합니다.
    if (shiftKeyPressed) {
      $(this).addClass('to-be-deleted');
    } else if ($(this).hasClass('to-be-deleted')) {
      // Shift 키가 눌려있지 않고, "to-be-deleted" 클래스가 있는 경우 "to-be-deleted" 클래스를 제거합니다.
      $(this).removeClass('to-be-deleted');
    } else {
      // Shift 키가 눌려있지 않고, "to-be-deleted" 클래스가 없는 경우 DOM에서 요소를 제거합니다.
      $(this).remove();
    }
  });
});
