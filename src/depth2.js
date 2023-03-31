$(function () {
  var padding = 12; // 초기 padding 값
  $('#myList input[type="checkbox"]').on('click', function () {
    var checkedCount = $('#myList input:checked').length;
    if (checkedCount === 1) {
      $(this)
        .parent()
        .css('padding-left', padding + 'px');
    } else if (checkedCount > 1) {
      var index = $('#myList input').index(this);
      $('#myList input:checked').each(function (i) {
        var li = $(this).parent();
        if (i === 0) {
          li.css('padding-left', '');
        } else {
          li.css('padding-left', padding * i + 'px');
        }
      });
    } else {
      $(this).parent().css('padding-left', '');
    }
  });

  $('#moveBtn').on('click', function () {
    $('#myList input:checked').each(function () {
      var li = $(this).parent();
      var index = $('#myList input').index(this);
      li.css('padding-left', padding * index + 'px');
    });
  });
});

// ///
// 설명:

// 초기 padding 값은 12로 설정합니다.
// 인풋 클릭 이벤트를 처리합니다.
// 체크된 인풋이 1개일 경우, 해당 인풋의 부모 li 요소에 padding-left 값을 설정합니다.
// 체크된 인풋이 2개 이상일 경우, 첫번째 인풋의 부모 li 요소는 padding-left 값을 초기화하고, 두번째 이후 인풋의 부모 li 요소에 padding-left 값을 설정합니다. 이때, padding 값은 체크된 인풋의 순서에 따라 적용됩니다.
// 체크된 인풋이 없을 경우, 해당 인풋의 부모 li 요소의 padding-left 값을 초기화합니다.
// 버튼 클릭 이벤트를 처리합니다.
// 체크된 인풋의 개수와 순서에 따라 각각의 부모 li 요소에 padding-left 값을 설정합니다.
