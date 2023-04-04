$(function () {
  function transferValueToString(value) {
    if (!typeof value === 'string') {
      let stringValueType = value.toString();
      return stringValueType;
    }
    return value;
  }

  function transferValueToNumber(value) {
    let NumberValueType = parseInt(value);
    return NumberValueType;
  }

  function checkIfValueNaN(ifValueOfNaN) {
    let itemDepthNumber;
    let checkNum;
    checkNum = ifValueOfNaN;

    console.log('ifValueOfNaN,함수인자', ifValueOfNaN);
    console.log('checkNum', checkNum);

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
    console.log('DOM,prev()', DOM);

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

    console.log('domDataValueByAttribute', domDataValueByAttribute);
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
      }
    );
  });
});
