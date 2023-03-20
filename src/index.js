const RightTable = document.querySelector('.right_area .target');
const ExistingRightTableRows = document.querySelectorAll('.right_area .target tr')

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
let rightTableRowData=[]





//완료
//테이블 tr을 돔으로 만드는 함수
function RenderingTableRowDom( selectedData ){
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
//클래스 active를 넣는 함수
function clickItemsAndAddClass(){
  let tableRows = LeftTable.getElementsByTagName("tr");
  for(let i=0; i < tableRows.length; i++ ){
    tableRows[i].addEventListener('click', function(){
      if(String(this.parentNode.nodeName)==='THEAD') return;
      this.classList.add('active')
    })
 }
}

//data-tablelistuid기준으로 중복된 상품이 있는지 확인하고
//중복된 상품은 지우는 함수
//중복이 없는 데이터로의 돔을 만드는 함수
function excludeDuplicatedRow(duplicatedDataList){

  //duplicatedDataList
  //중복이 있는 데이터의 리스트

console.log('duplicatedData',duplicatedDataList)

// duplicatedDataList.reduce((acc, cur) => acc.includes(cur.tablelistuid) ? acc : [...acc, cur],[])
const unique = duplicatedDataList.filter((obj, index)=>duplicatedDataList.findIndex((item)=> item.tablelistuid === obj.tablelistuid  ) === index )

console.log('unique',unique)


}

//완료
//테이블 TR TD의 데이터를 객체 배열로 만드는 함수
//
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


//전체 데이터를 가져와서 빈 배열에 저장하는 함수
function initializeRowData(rowList) {
  let rowDataList = [];
  rowList.forEach((tableTr) => {
    rowDataList.push(convertToTableObj(tableTr));
  });
  return rowDataList;
}

//완료
function createSeletedData(tableRowList) {
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


//완료
function createRightTableData(userClickedItmemList){

  let existingRightTableData=[];
  let newGeneratedRightTableData = []

  Array.prototype.slice.call(ExistingRightTableRows).forEach((tableTr) => {
    existingRightTableData.push(convertToTableObj(tableTr));
  });

  newGeneratedRightTableData  = [...existingRightTableData, ...userClickedItmemList  ]


if(window.localStorage.getItem('previous')){
  console.log('previous',JSON.parse(window.localStorage.getItem('previous')))
  let recreated = [...JSON.parse(window.localStorage.getItem('previous')), ...newGeneratedRightTableData ]

  //작성중
excludeDuplicatedRow(recreated);


  window.localStorage.removeItem('previous' )
  window.localStorage.setItem('previous',JSON.stringify(newGeneratedRightTableData) )
  console.log('recreated',recreated)




}

window.localStorage.setItem('previous',JSON.stringify(newGeneratedRightTableData) )

  console.log('newGeneratedRightTableData', newGeneratedRightTableData)
  return newGeneratedRightTableData

}




//완료
function renderRightTable(selectedData) {
   if (!selectedData || selectedData.length === 0) return;
    RenderingTableRowDom(selectedData)

    RightTable.insertAdjacentHTML('beforeend', RenderingTableRowDom(selectedData).join(' '));

    //추가
    //기존의 오른쪽 테이블 데이터와
    //새롭게 버튼, 추가로 생성된 데이터를 함께 모아
    //오른쪽 테이블의 데이터로 만드는 함수

  let rightTableData = createRightTableData(selectedData);







    selectedData=[];

    TableRowListFromServer.forEach((tableTr) => {
      tableTr.classList.remove('active')
    });

  return;
}












// function onClickAddThenRerenderTable(selected) {
//   if (!selected || selected.length === 0) return;

//   // some 을 활용한 id 체크
//   // const filteredData = apiData.filter(
//   //   (data) =>
//   //     !selected.some((selected) => selected.tablelistuid === data.tablelistuid)
//   // );

//   // deleteOldThenRenderLeftTable(filteredData);
//   renderRightTable(selected);

//   // selected data를 초기화
//   return [];
// }

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

// 상품 추가하기
AddButton.addEventListener('click', function () {
  selectedData = renderRightTable(createSeletedData(TableRowListFromServer));
  return;
});




console.log('ExistingRightTableRows ', ExistingRightTableRows );



// AddButton.addEventListener('click', function () {


//   // selectedData = createSeletedData(TableRowListFromServer);
//   // console.log('Selected',selectedData)

//   selectedData = renderRightTable(createSeletedData(TableRowListFromServer));
//   //   selectedData = onClickAddThenRerenderTable(mockDataFromServer, createSeletedData(TableRowListFromServer));

//   return;
// });






( function(){

  clickItemsAndAddClass();

})()



console.log('초기 갖고 있는 테이블의 데이터', mockDataFromServer )
console.log('초기상태',TableRowListFromServer)
