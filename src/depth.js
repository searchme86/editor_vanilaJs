//
$(document).ready(function () {
  var depth = 0; // 초기 들여쓰기 뎁스 값
  var padding = 12; // 들여쓰기 할 padding 값
  var $list = $('#myList');

  // 인풋 클릭시
  $list.on('click', 'input[type="checkbox"]', function () {
    var $item = $(this).parent(); // li 엘리먼트 선택
    var index = $item.index(); // li 엘리먼트의 인덱스 번호

    if ($(this).is(':checked')) {
      $item.attr('data-itemdepth', depth); // 들여쓰기 뎁스 값 설정
      $item.css('padding-left', depth * padding + 'px'); // padding-left 값 설정
    } else {
      $item.attr('data-itemdepth', 0); // 체크 해제시 들여쓰기 뎁스 값은 0
      $item.css('padding-left', '0'); // padding-left 값 초기화
    }
  });

  // 버튼 클릭시
  $('#moveBtn').on('click', function () {
    var checkedItems = $list.find('input[type="checkbox"]:checked').parent(); // 체크된 li 엘리먼트 선택

    if (checkedItems.length > 1) {
      var startIndex = checkedItems.first().index(); // 첫번째 체크된 li 엘리먼트의 인덱스 번호
      checkedItems.each(function (i) {
        $(this).css('padding-left', (i + depth) * padding + 'px'); // padding-left 값 설정
        $(this).attr('data-itemdepth', depth + i); // 들여쓰기 뎁스 값 설정
      });

      // 다음 클릭시 들여쓰기 뎁스 값 변경
      depth += checkedItems.length - 1;

      // 체크해제
      $list.find('input[type="checkbox"]').prop('checked', false);
    }
  });
});
