$(function () {
  function checkIfStingType(value) {
    if (!typeof value === 'string') {
      let stringType = value.toString();
      return stringType;
    }
    return value;
  }

  function isKeyInObject(obj, key) {
    let result = Object.keys(obj).some((value) => value === key);
    return result;
  }

  function getValueByDataType(value) {
    if (value === ' ') return 0;
    if (typeof value === 'object') {
      if (isKeyInObject(value, 'itemdepth')) {
        return value['itemdepth'];
      } else if (isKeyInObject(value, 'itemdepth')) {
        return value['itemuid'];
      }
    }
    return parseInt(value);
  }

  function checkIfValueNaN(testValue) {
    let itemDepthNumber;

    if (isNaN(testValue)) {
      itemDepthNumber = 0;
      return itemDepthNumber;
    } else if (testValue === undefined) {
      itemDepthNumber = -1;
      return itemDepthNumber;
    } else {
      return testValue;
    }
  }

  function getValueByAttribute(DOM, checkedInput, domDataAttributeName) {
    let domDataValueByAttribute;
    let valueThroughNaNCheck;

    // console.log('//-----getValueByAttribute-----//');
    // console.log('***--이전에 체크할 기준이 되는 돔--***', DOM);
    // console.log('***--체크한 돔안의 INPUT--***', checkedInput);
    // console.log('***--domDataAttributeName--***', domDataAttributeName);

    if (DOM === undefined) {
      valueThroughNaNCheck = -1;
      return valueThroughNaNCheck;
    }

    //제일 첫번째 돔 선택될 경우
    if (DOM.length === 0) {
      domDataValueByAttribute = getValueByDataType(
        checkedInput
          .parent()
          .parent()
          .data(checkIfStingType(domDataAttributeName))
      );

      // console.log(
      //   '이전에 돔이 존재합니다. === 0, domDataValueByAttribute',
      //   domDataValueByAttribute
      // );

      valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
      return valueThroughNaNCheck;
    } else {
      domDataValueByAttribute = getValueByDataType(
        DOM.data(checkIfStingType(domDataAttributeName))
      );

      // console.log(
      //   '이전에 돔이 존재합니다. , domDataValueByAttribute',
      //   domDataValueByAttribute
      // );
      valueThroughNaNCheck = checkIfValueNaN(domDataValueByAttribute);
      return valueThroughNaNCheck;
    }
  }

  function setDataSetValueByAttribute(
    DOM,
    checkedInput,
    domDataAttributeName,
    depthNum
  ) {
    if (DOM.length === 0 || DOM === undefined) {
      checkedInput
        .parent()
        .parent()
        .attr(domDataAttributeName.toString(), depthNum);
    }

    DOM.attr(domDataAttributeName, depthNum);
  }

  function checkIfPrevDOMExisted(DOM, checkedInput) {
    if (DOM.length === 0 || DOM === undefined) {
      setDataSetValueByAttribute(DOM, checkedInput, 'data-itemdepth', 0);
      applyPaddingStyle(DOM, checkedInput, 0);
    } else {
      return DOM;
    }
  }

  function applyPaddingStyle(DOM, checkedInput, depthNum) {
    const PADDING_SIZE = 12;

    let currentItemOfIterating = checkedInput;
    let valueTransformedString = (parseInt(depthNum) * PADDING_SIZE).toString();
    let spaceStyle = valueTransformedString + 'px';

    if (DOM.length === 0 || DOM === undefined) {
      currentItemOfIterating.parent().parent().css('padding-left', spaceStyle);
    }

    DOM.css('padding-left', spaceStyle);
  }

  // 이전 돔에 따른
  function calcPrevDOMDepthNumByCurrent(
    parentOfcheckedInput,
    domDataAttributeName,
    checkedInput
  ) {
    let isPrevElemExsited;
    let domDataValueByAttribute;

    isPrevElemExsited = checkIfPrevDOMExisted(
      parentOfcheckedInput.prev(),
      checkedInput
    );

    domDataValueByAttribute = getValueByAttribute(
      isPrevElemExsited,
      checkedInput,
      domDataAttributeName
    );

    return domDataValueByAttribute;
  }

  function calcCurrentDOMDepthNum(
    DOM,
    domDataAttributeName,
    checkedInput,
    prevItemDepthNum
  ) {
    const EMPTY_TABLE_UID = 'table_0000';

    let currentDOMDepthNum;

    let currentDOMDataUidValue = getValueByAttribute(
      DOM,
      checkedInput,
      domDataAttributeName
    );

    if (currentDOMDataUidValue === EMPTY_TABLE_UID) {
      currentDOMDepthNum = prevItemDepthNum;
      currentDOMDepthNum += 1;

      console.log('currentDOMDepthNum', currentDOMDepthNum);
      return currentDOMDepthNum;
    } else {
      currentDOMDepthNum = getValueByDataType(prevItemDepthNum) + 1;
      console.log('currentDOMDepthNum', currentDOMDepthNum);
      return currentDOMDepthNum;
    }
  }

  $(document).on('click', 'button[name=btnTableMoveRight]', function (e) {
    e.preventDefault();

    EDITING_FLAG = true;

    let currentDOMDepthNum;

    console.log('currentDOMDepthNum', currentDOMDepthNum);

    $.each(
      $('input[name=tableCheckbox]:checked').get().reverse(),
      function (index, element) {
        if ($('input[name=tableCheckbox]:checked').length === 0) {
          return;
        }

        let checkedInput = $(this);
        let parentOfcheckedInput = $(this).parent().parent();

        console.log('**--------------------code starts--------------------**');

        let prevItemDepthNum = calcPrevDOMDepthNumByCurrent(
          parentOfcheckedInput,
          'itemdepth',
          checkedInput
        );

        let currentItemDepthNum = calcCurrentDOMDepthNum(
          parentOfcheckedInput,
          'itemuid',
          checkedInput,
          prevItemDepthNum
        );

        parentOfcheckedInput.attr('data-itemdepth', currentItemDepthNum);

        applyPaddingStyle(
          parentOfcheckedInput,
          checkedInput,
          currentItemDepthNum
        );

        console.log('**--------------------code ends--------------------**');
      }
    );
  });
});
