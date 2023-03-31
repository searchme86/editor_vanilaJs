$(function () {
  // const PADDING_SIZE = 12;

  const EMPTY_TABLE_UID = 'table_0000';

  function transferValueToString(value) {
    let stringValueType = value.toString();
    return stringValueType;
  }

  function transferValueToNumber(value) {
    let NumberValueType = value.parseInt();
    return NumberValueType;
  }

  function checkIfDomExsited(DOM) {
    let elementDepthNum;
    if ($(DOM).length === 0 && $(DOM).prev() === undefined) {
      elementDepthNum = 0;
      return elementDepthNum;
    }
  }

  //value가 NaN인지 확인
  function checkIfValueNaN(value) {
    if (isNaN(value)) {
    }
  }

  //dataset 값을 가져옴
  //텍스트의 값을 반환
  function getDataSetAttribute(DOM, attributeName) {
    let dataSetValue;
    let attr;
    if (typeof attributeName !== 'string') {
      attr = attributeName.toString();
      DOM.attr(attr, depthNum);
    }
    // let prevItemDepthNumOfCheckedItem;
    // prevItemDepthNumOfCheckedItem = Number(prevItemOfChecked.data('itemdepth'));
    // return prevItemDepthNumOfCheckedItem;
    //let currentCheckedDataUidOfThisItem = currentCheckedThisItem.data('itemuid');

    return dataSetValue;
  }

  //dataset 값을 지정함
  function setDataSetAttribute(DOM, attributeName, depthNum) {
    let attr;
    if (typeof attributeName !== 'string') {
      attr = attributeName.toString();
      DOM.attr(attr, depthNum);
    }
    DOM.attr(attributeName, depthNum);
    // DOM.attr('data-itemdepth', depthNum);
  }

  //인자로 들어온 돔의 DepthNum을 계산하다
  function calculateDepthNum(DOM) {
    //숫자 타입으로 반환한다.

    let prevItemOfChecked = currentCheckedThisItem.prev();
    let prevItemDepthNumOfCheckedItem = Number(
      prevItemOfChecked.data('itemdepth')
    );

    if (currentCheckedDataUidOfThisItem === EMPTY_TABLE_UID) {
      CheckedCurrentDepthNum = prevItemDepthNumOfCheckedItem;
      CheckedCurrentDepthNum += 1;
    } else {
      CheckedCurrentDepthNum = Number(prevItemDepthNumOfCheckedItem) + 1;
    }
  }

  //패딩으로 적용할 값을 구해 스타일에 넣는다.
  function applyPaddingStyle(DOM, depthNum) {
    const PADDING_SIZE = 12;
    let itemDepthNum = calculateDepthNum(depthNum);
    let valueTransformedString = (itemDepthNum * PADDING_SIZE).toString();
    let spaceStyle = valueTransformedString + 'px';
    DOM.css('padding-left', spaceStyle);
  }

  $(document).on('click', 'button[name=btnTableMoveRight]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    let CheckedInputItems = $(
      $('input[name=tableCheckbox]:checked').get().reverse()
    );
    let currentCheckedThisItem = $(this).parent().parent();

    CheckedInputItems.each(function () {
      if (CheckedInputItems.length === 0) {
        return;
      }

      console.log('currentCheckedThisItem', currentCheckedThisItem);

      let CheckedCurrentDepthNum;
    });
  });

  //================================================항목 좌로 이동================================================>
  $(document).on('click', 'button[name=btnTableMoveLeft]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    $('input[name=tableCheckbox]:checked').each(function () {
      let itemDepth = $(this).parent().parent().data('itemdepth');

      console.log('itemDepth', itemDepth);

      itemDepth -= 1;

      console.log('itemDepth', itemDepth);

      if (itemDepth < 0) {
        itemDepth = 0;
      }

      $(this).parent().parent().data('itemdepth', itemDepth);

      let spaceStyle = itemDepth * PADDING_SIZE + 'px';
      $(this)
        .parent()
        .parent()
        .attr('style', 'padding-left: ' + spaceStyle);
    });

    /*$("button[name='btnInitNumber']").trigger('click');*/
  });

  /****************************************************
   * 목차 아래로 이동 버튼
   ****************************************************/
  $(document).on('click', 'button[name=btnTableMoveDown]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    // 역순으로 이동
    $($('input[name=tableCheckbox]:checked').get().reverse()).each(function () {
      let next = $(this).parent().parent().next();
      $(this).parent().parent().insertAfter(next);
    });

    $("button[name='btnInitNumber']").trigger('click');
  });

  /****************************************************
   * 목차 위로 이동 버튼
   ****************************************************/
  $(document).on('click', 'button[name=btnTableMoveUp]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    $('input[name=tableCheckbox]:checked').each(function () {
      let before = $(this).parent().parent().prev();
      $(this).parent().parent().insertBefore(before);
    });

    $("button[name='btnInitNumber']").trigger('click');
  });
});
