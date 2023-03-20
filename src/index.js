const RightTable = document.querySelector('.right_area .target');
const LeftTable = document.querySelector('.left_area table');
const LeftTableHead = document.querySelector('.left_area table thead');
const LeftTableTbody = document.getElementById('itemList_tbody');
const TableRowListFromServer = document.querySelectorAll(
  '.left_area #itemList_tbody tr'
  );
const EachTableRow = document.querySelector('.left_area #itemList_tbody tr')
const AddButton = document.getElementById('add-contents');

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload',
];

let mockDataFromServer = [];
let selectedData = [];


//추가
function RenderingTableRow( selectedData ){
 const renderedTableRow = selectedData.map((checked) => {
    return `
      <tr data-tablelistuid="${checked.tablelistuid}">
        <td>${checked.category}</td>
        <td>${checked.categoryTell}</td>
        <td>${checked.categoryVerify}</td>
        <td>${checked.uploader}</td>
        <td>${checked.dateToUpload}</td>
        </tr>
      `;
  });

  return renderedTableRow
}


//완료
function clickAndAddClass(){
  let rows = LeftTable.getElementsByTagName("tr");
  for(let i=0; i < rows.length; i++ ){
    rows[i].addEventListener('click', function(){
      this.classList.add('active')
    })
 }
}


//완료
function convertToTableObj(tableRow) {
  let rowData = [];

  rowData.push(tableRow.dataset.tablelistuid);

  Array.prototype.slice
    .call(tableRow.children)
    .forEach((tableTd) => rowData.push(tableTd.textContent.trim()));

  const obj = tableColumnTitle.reduce((acc, key, index) => {
    return {
      ...acc,
      [key]: rowData[index],
    };
  }, {});

  return obj;
}


//완료
function initializeRowData(rowList) {
  let rowDataList = [];
  rowList.forEach((tableTr) => {
    rowDataList.push(convertToTableObj(tableTr));
  });
  return rowDataList;
}

//완료
function initializeSelectedData(tableRowList) {
  let rowDataList = [];
  tableRowList.forEach((tableTr) => {
    if (tableTr.classList.contains('active')){
      rowDataList.push(convertToTableObj(tableTr));
    }
  });
  return rowDataList;
}



function deleteOldThenRenderLeftTable(newRowData) {
  LeftTableTbody?.remove();

  const nextTableRowList = newRowData.map((item) => {
    return `
      <tr data-tablelistuid="${item.tablelistuid}">
        <td>${item.category}</td>
        <td>${item.categoryTell}</td>
        <td>${item.categoryVerify}</td>
        <td>${item.uploader}</td>
        <td>${item.dateToUpload}</td>
      </tr>`;
  });

  const tbody = document.createElement('tbody');

  tbody.setAttribute('id', 'itemList_tbody');
  tbody.innerHTML = nextTableRowList.join(' ');
  LeftTable.appendChild(tbody);

  return;
}

//변경중
function renderRightTable(selectedData) {

RenderingTableRow(selectedData)
    RightTable.insertAdjacentHTML('beforeend', RenderingTableRow(selectedData).join(' '));
  return;
}

function onClickAddThenRerenderTable(apiData, selected) {
  if (!selected || selected.length === 0) return;

  // some 을 활용한 id 체크
  const filteredData = apiData.filter(
    (data) =>
      !selected.some((selected) => selected.tablelistuid === data.tablelistuid)
  );

  // deleteOldThenRenderLeftTable(filteredData);
  renderRightTable(selected);

  // selected data를 초기화
  return [];
}







// function deleteOldThenRenderLeftTable(newRowData) {
//   LeftTableTbody?.remove();

//   const nextTableRowList = newRowData.map((item) => {
//     return `
//       <tr data-tablelistuid="${item.tablelistuid}">
//         <td>${item.category}</td>
//         <td>${item.categoryTell}</td>
//         <td>${item.categoryVerify}</td>
//         <td>${item.uploader}</td>
//         <td>${item.dateToUpload}</td>
//       </tr>`;
//   });

//   const tbody = document.createElement('tbody');

//   tbody.setAttribute('id', 'itemList_tbody');
//   tbody.innerHTML = nextTableRowList.join(' ');
//   LeftTable.appendChild(tbody);

//   return;
// }

// function onClickAddThenRerenderTable(apiData, selected) {
//   if (!selected || selected.length === 0) return;

//   // some 을 활용한 id 체크
//   const filteredData = apiData.filter(
//     (data) =>
//       !selected.some((selected) => selected.tablelistuid === data.tablelistuid)
//   );

//   deleteOldThenRenderLeftTable(filteredData);
//   renderRightTable(selected);

//   // selected data를 초기화
//   return [];
// }









mockDataFromServer = initializeRowData(TableRowListFromServer);



AddButton.addEventListener('click', function () {


  // selectedData = initializeSelectedData(TableRowListFromServer);
  // console.log('Selected',selectedData)

  selectedData = onClickAddThenRerenderTable(mockDataFromServer, initializeSelectedData(TableRowListFromServer));

  return;
});




(function(){

  clickAndAddClass();

})()



console.log('초기 갖고 있는 테이블의 데이터', mockDataFromServer )
console.log('클릭후,돔상태',TableRowListFromServer)
