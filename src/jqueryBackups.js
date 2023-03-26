$(function () {
  const tableColumnTitle = [
    'tablelistuid',
    'category',
    'categoryTell',
    'categoryVerify',
    'uploader',
    'dateToUpload',
  ];

  let LeftTableTr = $('.main_table tbody tr');

  function convertTableRowToObjArray(tableEachRow) {
    let rowData = [];
    rowData.push(tableEachRow.attr('data-tablelistuid'));
    $.each(tableEachRow.children(), function (index, item) {
      rowData.push($(item).text().trim());
    });
    const createdNewTableRowObj = tableColumnTitle.reduce((acc, key, index) => {
      return {
        ...acc,
        [key]: rowData[index],
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

  function calculateCurrentRightTableRowsArray() {
    let rightTableTRArray = [];

    $.each($('#rightTbody tr'), function (index, item) {
      const totalRightTableDataArray = convertTableRowToObjArray($(item));
      rightTableTRArray.push(totalRightTableDataArray);
    });

    return rightTableTRArray;
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

    console.log('TableRowsDuplicated', TableRowsDuplicated);
    console.log('TableRowsToAdd', TableRowsToAdd);

    AddTableRowToCurrentTable(RightTable, TableRowsToAdd);

    transformArrayToText(TableRowsDuplicated, 'category');

    calculateCurrentRightTableRowsArray();
  });
});