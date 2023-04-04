$(function () {
  //값의 타입을 string으로 변경하는 함수
  function transferValueToString(value) {
    if (!typeof value === 'string') {
      let stringValueType = value.toString();
      return stringValueType;
    }
    return value;
  }

  function transferValueToNumber(value) {
    // let NumberValueType;

    // if (value === ' ') {
    //   NumberValueType = 0;
    //   return NumberValueType;
    // } else if (typeof value === 'object') {
    //   NumberValueType = parseInt(value?.itemdepth);
    //   console.log('NumberValueType for object', NumberValueType);
    //   console.log('typeof NumberValueType', typeof NumberValueType);
    //   return NumberValueType;
    // }

    // NumberValueType = parseInt(value);
    // console.log(
    //   "NumberValueType for not both '  ' and object",
    //   NumberValueType
    // );
    // return NumberValueType;

    if (value === ' ') return 0;
    return typeof value === 'object' ? value['itemdepth'] : parseInt(value);
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

    console.log('//-----getDataSetByAttribute-----//');
    console.log('***--DOM--***', DOM);
    console.log('***--iteratingCurrentDOM--***', iteratingCurrentDOM);
    console.log('***--attributeName--***', attributeName);

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
          .data(transferValueToString(attributeName))
      );

      console.log(
        'DOM.length === 0, domDataValueByAttribute',
        domDataValueByAttribute
      );

      valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
      return valueThroughNaNCheck;
    } else {
      domDataValueByAttribute = transferValueToNumber(
        DOM.data(transferValueToString(attributeName))
      );

      console.log(
        'DOM.length !== 0, domDataValueByAttribute',
        domDataValueByAttribute
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
    iteratingThisDOM,
    prevItemDepthNumOfCheckedItem
  ) {
    const EMPTY_TABLE_UID = 'table_0000';

    let CheckedCurrentDepthNum;
    let currentDOM = DOM;

    let currentDataUid = getDataSetByAttribute(
      currentDOM,
      iteratingThisDOM,
      attributeName
    );

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
          iteratingThisDOM,
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
