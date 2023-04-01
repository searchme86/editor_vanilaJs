$(function () {
  // const PADDING_SIZE = 12;

  // const EMPTY_TABLE_UID = 'table_0000';

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

  //'item-depth'라고 정의한 dataSet 값을 추출하는 목적함수
  //만약 해당 돔이 없을 경우,0으로 값을 반환하도록 함
  function getDataSetAttribute(DOM, attributeName) {
    let NumberTypeDataValue;
    let valueThroughNaNCheck;

    if (!DOM || DOM === 0) {
      NumberTypeDataValue = 0;
      return NumberTypeDataValue;
    }

    // html에서 dataSet 값을 가져올때는 string으로 가져온다
    // 사용할때는 number 타입이어야 한다.
    NumberTypeDataValue = transferValueToNumber(
      DOM.data(transferValueToString(attributeName))
    );

    //만약 반환된 값이 NaN인지 체크를 한다.
    //NaN 일경우, 0을 반환하도록 한다.
    //그렇지 않을 경우, 'item-depth'에 해당하는 dataSet의 값을, 해당 숫자값을 반환하도록 한다.

    valueThroughNaNCheck = checkIfValueNaN(NumberTypeDataValue);

    return valueThroughNaNCheck;
  }

  //dataset 값을 지정함
  function setDataSetAttribute(DOM, attributeName, depthNum) {
    if (typeof attributeName !== 'string') {
      DOM.attr(attributeName.toString(), depthNum);
    }
    DOM.attr(attributeName, depthNum);
    // DOM.attr('data-itemdepth', depthNum);
  }

  function applyPaddingStyle(DOM, depthNum) {
    const PADDING_SIZE = 12;
    let existedDOM;

    let valueTransformedString = (parseInt(depthNum) * PADDING_SIZE).toString();
    let spaceStyle = valueTransformedString + 'px';

    existedDOM = checkIfPrevDomExsited(DOM);
    existedDOM.css('padding-left', spaceStyle);
  }

  //이전의 돔이 있는지 체크한다.
  //이전의 돔이 없으면
  //값으 모두 0으로 패딩값, 데이터셋값으로 설정한다.
  //이전돔이 있으면, 이전 돔을 반환한다.
  function checkIfPrevDomExsited(DOM) {
    let prevElementDepthNum;

    if ($(DOM).length === 0 || $(DOM).prev() === undefined) {
      // 0의 값일 경우, 'itemdepth'라는 이름으로, data-itemdepth를 '0'의 값으로 설정한다.
      setDataSetAttribute($(DOM), 'itemdepth', prevElementDepthNum);
      applyPaddingStyle(DOM, 0);
    } else {
      return DOM;
    }
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

  //이전 돔의 depthNum을 구한다.
  function calculatePrevItemDepthNum(currentCheckedThisItem, attributeName) {
    let prevElementsListOfChecked;
    let NumberTypeDataValue;

    prevElementsListOfChecked = checkIfPrevDomExsited(
      currentCheckedThisItem.prev()
    );
    NumberTypeDataValue = getDataSetAttribute(
      prevElementsListOfChecked,
      attributeName
    );

    return NumberTypeDataValue;
  }

  function calculateCurrentItemDepthNum(
    DOM,
    attributeName,
    prevItemDepthNumOfCheckedItem
  ) {
    const EMPTY_TABLE_UID = 'table_0000';
    let CheckedCurrentDepthNum = 0;

    let currentDOM = DOM;
    let attributeToFind = attributeName;

    let currentDataUid = getDataSetAttribute(currentDOM, attributeToFind);

    if (currentDataUid === EMPTY_TABLE_UID) {
      CheckedCurrentDepthNum = prevItemDepthNumOfCheckedItem;
      CheckedCurrentDepthNum += 1;
      return CheckedCurrentDepthNum;
    } else {
      CheckedCurrentDepthNum = Number(prevItemDepthNumOfCheckedItem) + 1;
      return CheckedCurrentDepthNum;
    }
  }

  // 실제 시작
  $(document).on('click', 'button[name=btnTableMoveRight]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    let CheckedInputItems = $(
      $('input[name=tableCheckbox]:checked').get().reverse()
    );

    $.each(CheckedInputItems, function (index, element) {
      console.log(
        '====================체크한 인풋이 포한된 돔을 순회한다.===================='
      );

      if (CheckedInputItems.length === 0) {
        return;
      }

      let currentCheckedThisItem = $(this).parent().parent();
      let prevItemDepthNum = calculatePrevItemDepthNum(currentCheckedThisItem);

      let currentItemDepthNum = calculateCurrentItemDepthNum(
        currentCheckedThisItem,
        'itemuid',
        prevItemDepthNum
      );

      applyPaddingStyle(currentCheckedThisItem, currentItemDepthNum);
    });
  });
});
