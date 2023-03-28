/****************************************************
 * 상품항목관리 스크립트
 ****************************************************/

$(function () {
  /****************************************************
   * 버튼 클릭해, 선택항목 우측으로 아이템 복사
   ****************************************************/

  const tableColumnTitle = [
    'tablelistuid',
    'category',
    'categoryTell',
    'categoryVerify',
    'uploader',
    'dateToUpload'
  ];

  let LeftTableTr = $('.left-table tbody tr');

  function convertTableRowToObjArray(tableEachRow) {
    let rowData = [];
    rowData.push(tableEachRow.attr('data-tablelistuid'));
    $.each(tableEachRow.children(), function (index, item) {
      rowData.push($(item).text().trim());
    });
    const createdNewTableRowObj = tableColumnTitle.reduce((acc, key, index) => {
      return {
        ...acc,
        [key]: rowData[index]
      };
    }, {});
    return createdNewTableRowObj;
  }

  function createUniqueDataArray(arr1, arr2) {
    let rightArr = arr2 || [];
    const uniqueArray = $.unique($.merge(arr1, rightArr));
    return uniqueArray;
  }

  function createObjArrayOfTableData(arr) {
    let array = [];
    $.each(arr, function (index, item) {
      const TableRowObjectArray = convertTableRowToObjArray($(item));
      array.push(TableRowObjectArray);
      createUniqueDataArray(array);
    });
    return array;
  }

  function compareAgainstToAdd(arr, reference) {
    let uniqueLeftTableArray = [];

    $.each(arr, function (i, obj) {
      if (
        $.inArray(
          obj.tablelistuid,
          $.map(uniqueLeftTableArray, function (item) {
            return item.tablelistuid;
          })
        ) === -1
      ) {
        uniqueLeftTableArray.push(obj);
      }
    });

    const filterItemsAgainstRightTable = uniqueLeftTableArray.filter(
      (obj, index) =>
        !reference.some((item) => item.tablelistuid === obj.tablelistuid)
    );

    return filterItemsAgainstRightTable;
  }

  function findDuplicated(arr, reference) {
    let uniqueLeftTableArray = [];

    $.each(arr, function (i, obj) {
      if (
        $.inArray(
          obj.tablelistuid,
          $.map(uniqueLeftTableArray, function (item) {
            return item.tablelistuid;
          })
        ) === -1
      ) {
        uniqueLeftTableArray.push(obj);
      }
    });

    const duplicatedDataArray = uniqueLeftTableArray.filter((obj, index) =>
      reference.some((item) => item.tablelistuid === obj.tablelistuid)
    );

    return duplicatedDataArray;
  }

  function transformArrayToText(arr, categoryToFilter) {
    let alertMessage;
    let textArray = [];
    let variableToString = categoryToFilter.toString();

    if (!variableToString || variableToString === undefined) return;

    tableColumnTitle.forEach((columnText) => {
      if (columnText !== variableToString) return;
    });

    $.each(arr, function (index, item) {
      textArray.push(item[variableToString]);
    });

    if (textArray.length === 0) return;
    alertMessage = `"${textArray.join(
      ','
    )}" 는/은 이미 항목에 포함되어 있습니다.`;

    return alertMessage;
  }

  function AddTableRowToCurrentTable(targetTable, tablRowArrayToAdd) {
    $.each(tablRowArrayToAdd, function (index, item) {
      let row = $('<tr>');
      row.attr('data-tablelistuid', item.tablelistuid);
      let category = $('<p>').addClass('td_c').text(item.category);
      let categoryTell = $('<p>').addClass('td_c').text(item.categoryTell);
      let categoryVerify = $('<p>').addClass('td_c').text(item.categoryVerify);
      let dateToUpload = $('<p>').addClass('td_c').text(item.dateToUpload);
      let uploader = $('<p>').addClass('td_c').text(item.uploader);

      let categoryCell = $('<td>').append(category);
      let categoryTellCell = $('<td>').append(categoryTell);
      let categoryVerifyCell = $('<td>').append(categoryVerify);
      let dateToUploadCell = $('<td>').append(dateToUpload);
      let uploaderCell = $('<td>').append(uploader);

      row.append(
        categoryCell,
        categoryTellCell,
        categoryVerifyCell,
        dateToUploadCell,
        uploaderCell
      );

      targetTable.append(row);
    });
  }

  $.each(LeftTableTr, function (index, element) {
    $(element).on('click', function () {
      $(element).toggleClass('active');
    });
  });

  $(document).on('click', 'button[name=moveRightButton]', function (e) {
    e.preventDefault();

    let userSelecteTableRow;
    let TableRowsToAdd;
    let TableRowsDuplicated;

    const RightTable = $('#rightTbody');
    let LeftTableTrSelected = $('#leftTbody > tr.active');
    let RightDataBeforeClicked = $('#rightTbody tr');

    userSelecteTableRow = createObjArrayOfTableData(LeftTableTrSelected);

    TableRowsToAdd = compareAgainstToAdd(
      userSelecteTableRow,
      createObjArrayOfTableData(RightDataBeforeClicked)
    );

    TableRowsDuplicated = findDuplicated(
      userSelecteTableRow,
      createObjArrayOfTableData(RightDataBeforeClicked)
    );

    AddTableRowToCurrentTable(RightTable, TableRowsToAdd);

    transformArrayToText(TableRowsDuplicated, 'category');
  });

  /****************************************************
   * 버튼 클릭해, 선택항목 아이템 삭제
   ****************************************************/
  $(document).on('click', '.right-table tbody tr', function () {
    $(this).toggleClass('active');
  });

  $(document).on('click', 'button[name=moveLeftButton]', function (e) {
    e.preventDefault();
    if ($('.right-table tbody tr').length - 1 === 0) return;
    $.each($('.right-table tbody tr.active'), function (index, item) {
      $(item).remove();
    });
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
   * Shift key를 누르면서 전체 선택
   ****************************************************/

  $(document).on('click', '.main_table table tr', function (e) {
    // console.log('previousDOMClicked', previousDOMClicked);
    //만약 키보드의 shiftkey와 이전에 클릭한 돔이 있으면

    //2. 이벤트에 shiftkey가 있는지를 체크
    if (e.shiftKey && previousDOMClicked) {
      //처음 스타트할 기준을 세우기 위한 변수,
      //유저가 처음에 클릭한 아이템의 인덱스를 계산한다.
      //유저가 shiftkey와 함께 마우스 클릭하기 전의 돔의 인덱스를 구한다.
      let previousDOMClickedIndex = $('.main_table table tr').index(
        previousDOMClicked
      );
      // console.log('previousDOMClickedIndex', previousDOMClickedIndex);

      //클릭이벤트에서 this는 내가 당시 클릭한 그것을 의미해서
      //클릭한 그것(this)이 현재current라고 의미한다.
      //shiftKey와 함께 유저가 (현재)클릭한 그것인 this의 인덱스를 구한다.
      let DomClickedIndexWithShiftKey = $('.main_table table tr').index(this);
      // console.log('DomClickedIndexWithShiftKey', DomClickedIndexWithShiftKey);

      //shiftkey를 누른상태에서 어떤 요소를 누르면 해당 요소는 제외하는 로직도 추가해보자
      //클릭한 그 대상을 배열에서 제거한다.

      let range =
        previousDOMClickedIndex < DomClickedIndexWithShiftKey
          ? $('li').slice(
              previousDOMClickedIndex,
              DomClickedIndexWithShiftKey + 1
            )
          : $('li').slice(
              DomClickedIndexWithShiftKey,
              previousDOMClickedIndex + 1
            );

      range.addClass('active');

      // console.log('e', e.target);
      // console.log('this', this);
    } else {
      // 만약 shiftKey 키와 같이 클릭하지 않고,
      // 그냥 마우스로 아이템 클릭 할 경우,
      // 모든 아이템의 클래스, active를 삭제하고
      //2.
      $('.main_table table tr').removeClass('active');
      // 클릭한 돔에 클래스, active를 더한다.
      // 3.
      $(this).addClass('active');
    }
    // 처음 스타트를 지정하기 위해,
    // 처음 클릭한 돔을 저장할 용도
    // 경우1) e.shiftKey를 누르면서 돔을 클릭해도
    // => e.shiftKey과 돔의 값이 둘다 있어야 하는데,
    // 둘중 하나라도 없기 때문에,
    // 경우2) 그냥 마우스를 클릭한 경우,
    //4.
    previousDOMClicked = this;
  });
});
