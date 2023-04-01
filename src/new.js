$(function () {
  //값의 타입을 숫자로 텍스트로 변경
  function transferValueToString(value) {
    let stringValueType = value.toString();
    return stringValueType;
  }

  //값의 타입을 숫자로 변경
  function transferValueToNumber(value) {
    let NumberValueType = value.parseInt();
    return NumberValueType;
  }

  //완료
  //value가 NaN인지 확인
  //ifValueOfNaN가 NaN이면 0을 반환
  //NaN일 경우, 0으로 값을 반환하도록 설정
  //=> 돔이 없어서 계산된 값이 없기 때문에, 돔이 없기에 해당 dataSet value가 0이 되어야 한다.
  //ifValueOfNaN가 값이 있으면, 그 값을 반환
  function checkIfValueNaN(ifValueOfNaN) {
    let itemDepthNumber;

    if (isNaN(ifValueOfNaN)) {
      itemDepthNumber = 0;
      return itemDepthNumber;
    } else {
      return ifValueOfNaN;
    }
  }

  //'item-depth'라고 정의한 dataSet 값을 추출하는 목적함수
  //만약 해당 돔이 없을 경우,0으로 값을 반환하도록 함
  function getDataSetAttribute(DOM, attributeName) {
    let NumberTypeValue;
    let valueThroughNaNCheck;

    NumberTypeValue = transferValueToNumber(
      DOM.data(transferValueToString(attributeName))
    );

    valueThroughNaNCheck = checkIfValueNaN(NumberTypeValue);

    return valueThroughNaNCheck;
  }

  function setDataSetAttribute(DOM, attributeName, depthNum) {
    if (typeof attributeName !== 'string') {
      DOM.attr(attributeName.toString(), depthNum);
    }
    DOM.attr(attributeName, depthNum);
  }

  function checkIfPrevDomExsited(DOM) {
    if ($(DOM).length === 0 && $(DOM).prev() === undefined) {
      setDataSetAttribute($(DOM), 'data-itemdepth', 0);
      applyPaddingStyle(DOM, 0);
    } else {
      return DOM;
    }
  }

  function applyPaddingStyle(DOM, depthNum) {
    const PADDING_SIZE = 12;

    let valueTransformedString = (parseInt(depthNum) * PADDING_SIZE).toString();
    let spaceStyle = valueTransformedString + 'px';

    DOM.css('padding-left', spaceStyle);
  }

  function calcPrevItemDepthNum(currentCheckedThisItem, attributeName) {
    let prevElementsExisted;
    let NumberTypeValue;

    prevElementsExisted = checkIfPrevDomExsited(currentCheckedThisItem.prev());
    NumberTypeValue = getDataSetAttribute(prevElementsExisted, attributeName);

    return NumberTypeValue;
  }

  function calcCurrentCheckedItemDepthNum(
    DOM,
    attributeName,
    prevItemDepthNumOfCheckedItem
  ) {
    const EMPTY_TABLE_UID = 'table_0000';

    let CheckedCurrentDepthNum;
    let currentDOM = DOM;
    let attributeToFind = attributeName;

    let currentDataUid = getDataSetAttribute(currentDOM, attributeToFind);

    if (currentDataUid === EMPTY_TABLE_UID) {
      CheckedCurrentDepthNum = prevItemDepthNumOfCheckedItem;
      CheckedCurrentDepthNum += 1;
      return CheckedCurrentDepthNum;
    } else {
      CheckedCurrentDepthNum =
        transferValueToNumber(prevItemDepthNumOfCheckedItem) + 1;
      return CheckedCurrentDepthNum;
    }
  }

  // =================================================================================

  $(document).on('click', 'button[name=btnTableMoveRight]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    $.each(
      $('input[name=tableCheckbox]:checked').get().reverse(),
      function (index, element) {
        if ($('input[name=tableCheckbox]:checked').length === 0) {
          return;
        }
        let CheckedCurrentDepthNum;

        let currentCheckedThisItem = $(this).parent().parent();
        let prevItemDepthNum = calcPrevItemDepthNum(currentCheckedThisItem);

        let currentItemDepthNum = calcCurrentCheckedItemDepthNum(
          currentCheckedThisItem,
          'itemuid',
          prevItemDepthNum
        );

        currentCheckedThisItem.attr('data-itemdepth', currentItemDepthNum);

        applyPaddingStyle(currentCheckedThisItem, currentItemDepthNum);
      }
    );
  });
});
