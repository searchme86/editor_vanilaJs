// recreated
const leftTable = document.getElementById('left-table');
const rightTable = document.getElementById('right-table');

const moveRightButton = document.getElementById('move-right-button');

const initialTBody = document.querySelector('.initial');
const initialTRs = document.querySelectorAll('.initial tr');

// Right
let initialExistedRightTableDataArray = [];
let createdRightTableData = [];

// Left
let LeftTableData = [];
let selectedData = [];

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload',
];

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

function RenderingTableTbody(selectedData) {
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

  console.log('renderedTableRow', renderedTableRow);
  if (!renderedTableRow.length) return;

  const tbody = document.createElement('tbody');
  tbody.innerHTML = renderedTableRow.join('');

  return tbody;
}

// ===================================================>
// 스크립트 시작
// 초기 오른쪽 테이블 데이터를 구한다.
initialTRs.forEach((initial) => {
  initialExistedRightTableDataArray.push(convertToTableObj(initial));
});

//1. 유저 왼쪽 테이블 로우 클릭한다.
leftTable.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.toggle('active');
  });
});

// # 추가버튼을 클릭 할 경우,
// 왼쪽 데이터를 셀렉트 하고, 추가버튼을 눌러, 오른쪽 테이블에 데이터를 추가한다.
// 유저가 클릭한, 왼쪽 데이터와, 오른쪽 기존의 있는 데이터를 합친후, 새롭게 tbody tr을 만들어서 리렌더링 한다.
moveRightButton.addEventListener('click', () => {
  let userSelectedList = [];
  const selectedRows = Array.from(leftTable.querySelectorAll('.active'));

  // selectedRowst선택한 데이터를 객체배열로 만듦
  // 새로운 tr로 만들기 위한 기본 준비
  selectedRows.forEach((row) => {
    userSelectedList.push(convertToTableObj(row));
  });

  // 왼쪽에 추가한 데이터와, 기존 오른쪽에 있는 데이터를 합쳐서, 새롭게 오른쪽 데이터를 생성한다.
  createdRightTableData = [
    ...initialExistedRightTableDataArray,
    ...userSelectedList,
  ];

  // 중복을 삭제한다.

  // 오른쪽 테이블의 tbody를 삭제하고
  initialTBody.remove();

  // 데이터를 가지고 tbody를 만든다.
  const result = RenderingTableTbody(createdRightTableData);

  //만약 tbody가 없다면, 즉 유저가 클릭한 아이템이 없어서 만들 tbody가 없다면, 종료하라
  if (result === undefined) return;

  //만약 tbody가 있다면, 만든 것을 테이블에 렌더링 해라
  rightTable.appendChild(result);

  leftTable
    .querySelectorAll('tbody tr')
    .forEach((item) => item.classList.remove('active'));
  createdRightTableData = [];
  initialExistedRightTableDataArray = [];
});
