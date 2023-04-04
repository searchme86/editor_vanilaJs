$(function () {
  //값의 타입을 string으로 변경하는 함수
  function transferValueToString(value) {
    if (!typeof value === 'string') {
      let stringValueType = value.toString();
      return stringValueType;
    }
    return value;
  }

  //값의 타입을 number로 변경하는 함수
  //value가 객체일 경우
  // value ={itemdepth:0, itemuid:'22222'}
  //value가 숫자일 경우를
  //모두 처리하는 함수를 만들어야 함
  //value가 없을때,
  function transferValueToNumber(value) {
    let NumberValueType;

    if (value === ' ') {
      NumberValueType = 0;
      return NumberValueType;
    } else if (typeof value === 'object') {
      NumberValueType = parseInt(value?.itemdepth);
      console.log('NumberValueType for object', NumberValueType);
      console.log('typeof NumberValueType', typeof NumberValueType);
      return NumberValueType;
    }

    NumberValueType = parseInt(value);
    console.log(
      "NumberValueType for not both '  ' and object",
      NumberValueType
    );
    return NumberValueType;
  }

  function checkIfValueNaN(ifValueOfNaN) {
    let itemDepthNumber;
    let checkNum;
    checkNum = ifValueOfNaN;

    if (isNaN(checkNum)) {
      itemDepthNumber = 0;
      return itemDepthNumber;
    } else if (checkNum === undefined) {
      itemDepthNumber = -1;
      return itemDepthNumber;
    } else {
      return checkNum;
    }
  }

  function getDataSetByAttribute(DOM, iteratingCurrentDOM, attributeName) {
    let domDataValueByAttribute;
    let valueThroughNaNCheck;
    let attrValue;

    attrValue = attributeName;

    //특정돔의 prev값이 없어, undefined 일 경우,
    //즉, 제일 첫번째 돔이라는 것이기 때문에
    //-1을 반환하여,
    //CheckedCurrentDepthNum = prevItemDepthNumOfCheckedItem;
    //CheckedCurrentDepthNum += 1;
    //0으로 만든다.
    if (DOM === undefined) {
      valueThroughNaNCheck = -1;
      return valueThroughNaNCheck;
    }

    //제일 첫번째 돔 선택될 경우
    if (DOM.length === 0) {
      domDataValueByAttribute = transferValueToNumber(
        iteratingCurrentDOM
          .parent()
          .parent()
          .data(transferValueToString(attrValue))
      );
      valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
      return valueThroughNaNCheck;
    } else {
      domDataValueByAttribute = transferValueToNumber(
        DOM.data(transferValueToString(attrValue))
      );
      valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
      return valueThroughNaNCheck;
    }
  }

  function setDataSetValueByAttribute(
    DOM,
    iteratingCurrentDOM,
    attributeName,
    depthNum
  ) {
    let attrValue = attributeName;

    if (DOM.length === 0 || DOM === undefined) {
      iteratingCurrentDOM
        .parent()
        .parent()
        .attr(attrValue.toString(), depthNum);
    }

    DOM.attr(attrValue, depthNum);
  }

  function checkIfPrevDOMExistedToReturnDOM(DOM, iteratingCurrentDOM) {
    if (DOM.length === 0 || DOM === undefined) {
      setDataSetValueByAttribute(DOM, iteratingCurrentDOM, 'data-itemdepth', 0);
      applyPaddingStyle(DOM, iteratingCurrentDOM, 0);
    } else {
      return DOM;
    }
  }

  function applyPaddingStyle(DOM, iteratingCurrentDOM, depthNum) {
    const PADDING_SIZE = 12;

    let currentItemOfIterating = iteratingCurrentDOM;
    let valueTransformedString = (parseInt(depthNum) * PADDING_SIZE).toString();
    let spaceStyle = valueTransformedString + 'px';

    if (DOM.length === 0 || DOM === undefined) {
      currentItemOfIterating.parent().parent().css('padding-left', spaceStyle);
    }

    DOM.css('padding-left', spaceStyle);
  }

  function calcPrevItemDepthNum(
    currentCheckedThisItem,
    attributeName,
    iteratingCurrentDOM
  ) {
    let prevElements;
    let domDataValueByAttribute;

    prevElements = checkIfPrevDOMExistedToReturnDOM(
      currentCheckedThisItem.prev(),
      iteratingCurrentDOM
    );

    domDataValueByAttribute = getDataSetByAttribute(
      prevElements,
      iteratingCurrentDOM,
      attributeName
    );

    return domDataValueByAttribute;
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

    let currentDataUid = getDataSetByAttribute(currentDOM, attributeToFind);

    // prevItemDepthNumOfCheckedItem이 undefined라면 이전 아이템이 없다는 것
    // prevItemDepthNumOfCheckedItem이 undefined라면
    // prevItemDepthNumOfCheckedItem은 -1을 반환

    if (currentDataUid === EMPTY_TABLE_UID) {
      // prevItemDepthNumOfCheckedItem이 undefined라면 어떻게 처리?

      CheckedCurrentDepthNum = prevItemDepthNumOfCheckedItem;
      CheckedCurrentDepthNum += 1;
      return CheckedCurrentDepthNum;
    } else {
      CheckedCurrentDepthNum =
        transferValueToNumber(prevItemDepthNumOfCheckedItem) + 1;
      return CheckedCurrentDepthNum;
    }
  }

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

        let iteratingThisDOM = $(this);
        let currentCheckedThisItem = $(this).parent().parent();

        console.log('**----------code starts----------**');

        let prevItemDepthNum = calcPrevItemDepthNum(
          currentCheckedThisItem,
          'itemdepth',
          iteratingThisDOM
        );

        let currentItemDepthNum = calcCurrentCheckedItemDepthNum(
          currentCheckedThisItem,
          'itemuid',
          prevItemDepthNum
        );

        currentCheckedThisItem.attr('data-itemdepth', currentItemDepthNum);

        applyPaddingStyle(
          currentCheckedThisItem,
          iteratingThisDOM,
          currentItemDepthNum
        );

        console.log('**----------code ends----------**');
      }
    );
  });
});
