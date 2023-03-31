// 버튼 클릭 시 이벤트 처리 함수
$('#btn').click(function () {
  // 선택한 인풋 요소들을 가져옵니다.
  var checkedInputs = $('input:checked');

  // 인풋 요소가 선택되지 않은 경우 함수를 종료합니다.
  if (checkedInputs.length === 0) {
    return;
  }

  // 선택된 인풋 요소들의 부모 요소를 가져옵니다.
  var parentElements = checkedInputs.parent('li');

  // 선택된 인풋 요소들의 가장 작은 들여쓰기 값을 찾습니다.
  var smallestIndent = Infinity;
  parentElements.each(function () {
    var currentIndent = $(this).parentsUntil('.list').length;
    if (currentIndent < smallestIndent) {
      smallestIndent = currentIndent;
    }
  });

  // 각 인풋 요소를 움직입니다.
  parentElements.each(function () {
    var currentIndent = $(this).parentsUntil('.list').length;
    var paddingLeft = (currentIndent - smallestIndent) * 20 + 'px';
    $(this).css('padding-left', paddingLeft);
    $(this).appendTo($(this).parent());
  });
});
