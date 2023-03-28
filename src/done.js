/****************************************************
 * 상품항목관리 스크립트
 ****************************************************/

$(function () {
  /****************************************************
   * 버튼 클릭해, 선택항목 우측으로 이동 (기존목록에서 복제)
   ****************************************************/
  $(document).on('click', 'button[name=moveRightButton]', function (e) {
    e.preventDefault();
    let existsItem = [];

    $.each($('#leftTbody>tr.active'), function (leftIndex, leftItem) {
      let leftUid = $(this).data('tablelistuid');
      let newRow = $(this).clone();
      let ifDuplicatedItemExisted = false;

      $.each($('#rightTbody>tr'), function (rightIndex, rightItem) {
        let rightUid = $(this).data('tablelistuid');
        let rightItemname = $(this).data('itemname');

        if (leftUid === rightUid) {
          existsItem.push(rightItemname);
          ifDuplicatedItemExisted = true;
          return false;
        }
      });

      if (ifDuplicatedItemExisted === false) {
        newRow.insertAfter($('#rightTbody tr:last'));
      }

      if ($('.right_area .main_table tbody tr').length === 0) {
        $('.right_area .main_table tbody').append(newRow);
        $('.alertTextMessage').remove();
        $('.right_area .main_table').css('position', ' ');
      }
    });

    if (existsItem !== '') {
      alertPop(
        '알림',
        '다음 항목이 중복됩니다.\n' + existsItem.join(','),
        'alert'
      );
    }

    $.each($('#leftTbody>tr'), function (leftIndex, leftItem) {
      $(leftItem).removeClass('active');
    });

    $.each($('#rightTbody>tr'), function (rightIndex, rightItem) {
      $(rightItem).removeClass('active');
    });

    existsItem = [];
  });

  /****************************************************
   * 버튼 클릭해, 선택항목 왼쪽으로 이동 (기존목록에서 삭제)
   ****************************************************/
  $(document).on('click', 'button[name=moveLeftButton]', function (e) {
    e.preventDefault();
    $.each($('.right-table tbody tr.active'), function (index, item) {
      $(item).remove();
    });

    if ($('.right-table tbody tr').length === 0) {
      let alertTextMessage = $('<p>');
      let textToShow = '항목이 존재하지 않습니다.';

      $('.right_area .main_table').css('position', 'relative');
      alertTextMessage.text(textToShow).addClass('alertTextMessage');
      alertTextMessage.css({
        position: 'absolute',
        'z-index': '1',
        top: '50%',
        left: '50%'
      });

      $('.right_area .main_table ').append(alertTextMessage);
    }
  });

  /****************************************************
   * 버튼 클릭해, 선택항목 아래로 이동
   ****************************************************/
  $(document).on('click', 'button[name=moveDownItem]', function (e) {
    e.preventDefault();

    $($('#rightTbody>tr.active').get().reverse()).each(function () {
      let next = $(this).next();
      $(this).insertAfter(next);
    });
  });

  /****************************************************
   * 버튼 클릭해, 선택항목 위로 이동
   ****************************************************/
  $(document).on('click', 'button[name=moveUpItem]', function (e) {
    e.preventDefault();

    $('#rightTbody>tr.active').each(function () {
      let before = $(this).prev();
      $(this).insertBefore(before);
    });
  });

  /****************************************************
   * 키보드,shift를 누르면서 두개의 아이템 선택 시, 가운데 아이템까지 전체 선택됨
   * 개별 테이블 항목의 선택하기 및 해제하기
   ****************************************************/
  let previousDOMClicked;

  $(document).on('click', '.main_table table tr', function (e) {
    if (e.shiftKey && previousDOMClicked) {
      let previousDOMClickedIndex = $('.main_table table tr').index(
        previousDOMClicked
      );
      let DomClickedIndexWithShiftKey = $('.main_table table tr').index(this);

      if (previousDOMClickedIndex < DomClickedIndexWithShiftKey) {
        for (
          let i = previousDOMClickedIndex;
          i < DomClickedIndexWithShiftKey + 1;
          i++
        ) {
          let elementPerIndex = $('.main_table table tr').eq(i);
          elementPerIndex.addClass('active');
        }
      } else {
        for (
          let i = DomClickedIndexWithShiftKey;
          i < previousDOMClickedIndex + 1;
          i++
        ) {
          let elementPerIndex = $('.main_table table tr').eq(i);
          elementPerIndex.addClass('active');
        }
      }
    } else {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        return;
      } else {
        $(this).addClass('active');
        previousDOMClicked = this;
      }
    }
  });
});
