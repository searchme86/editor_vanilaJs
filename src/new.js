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

    if (isNaN(ifValueOfNaN)) {
      itemDepthNumber = 0;
      return itemDepthNumber;
    } else {
      return ifValueOfNaN;
    }
  }

  function getDataSetByAttribute(DOM, iteratingDOM, attributeName) {
    let domDataValueByAttribute;
    let valueThroughNaNCheck;

    console.log(
      '-------------------------getDataSetByAttribute-------------------------'
    );

    if (transferValueToString(attributeName) === 'itemdepth') {
      console.log('previousDOM', DOM);

      if (DOM === undefined) {
        domDataValueByAttribute = transferValueToNumber(
          iteratingDOM
            .parent()
            .parent()
            .data(transferValueToString(attributeName))
        );
        valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
        return valueThroughNaNCheck;
      } else {
        domDataValueByAttribute = transferValueToNumber(
          DOM.data(transferValueToString(attributeName))
        );
        valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
        return valueThroughNaNCheck;
      }
    }

    // domDataValueByAttribute = DOM.data(transferValueToString(attributeName));
    // valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);

    // return valueThroughNaNCheck;
  }

  function setDataSetValueByAttribute(
    DOM,
    iteratingDOM,
    attributeName,
    depthNum
  ) {
    if (DOM.length === 0 || DOM === undefined) {
      iteratingDOM.parent().parent().attr(attributeName.toString(), depthNum);
      return;
    }

    DOM.attr(attributeName, depthNum);
  }

  function checkIfPrevDOMExistedToReturnDOM(DOM, iteratingDOM) {
    if (DOM.length === 0 || DOM === undefined) {
      setDataSetValueByAttribute(DOM, iteratingDOM, 'data-itemdepth', 0);
      applyPaddingStyle(DOM, iteratingDOM, 0);
    } else {
      console.log('previousDOM', DOM);
      return DOM;
    }
  }

  function applyPaddingStyle(DOM, iteratingDOM, depthNum) {
    const PADDING_SIZE = 12;

    let currentItemOfIterating = iteratingDOM;
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
    iteratingDOM
  ) {
    let prevElements;
    let domDataValueByAttribute;

    prevElements = checkIfPrevDOMExistedToReturnDOM(
      currentCheckedThisItem.prev(),
      iteratingDOM
    );

    domDataValueByAttribute = getDataSetByAttribute(
      prevElements,
      iteratingDOM,
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

  // ==================================================================
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
