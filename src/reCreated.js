const leftTable = document.getElementById('left-table');
const rightTable = document.getElementById('right-table');

const moveRightButton = document.getElementById('move-right-button');
const moveLeftButton = document.getElementById('move-left-button');

const initialTBody = document.querySelector('.initial');
const initialTRs = document.querySelectorAll('.initial tr');

// Right
let initialExistedRightTableDataArray = [];
let createdRightTableData = [];
let previousData = [];

// Left
let LeftTableData = [];
let selectedData = [];

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload'
];

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
      [key]: rowData[index]
    };
  }, {});

  return obj;
}

//완료
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

  if (renderedTableRow.length === 0) return;
  document.querySelector('.right-table tbody').innerHTML =
    renderedTableRow.join('');
}

//완료
function excludeDuplicatedData() {
  const filteredAndUniqueData = previousData.filter(
    (obj, index) =>
      previousData.findIndex(
        (item) => item.tablelistuid === obj.tablelistuid
      ) === index
  );
  return filteredAndUniqueData;
}

initialTRs.forEach((initial) => {
  initialExistedRightTableDataArray.push(convertToTableObj(initial));
});

// =======================================>
// # Category, 추가 버튼
// 왼쪽의 테이블 로우를 클릭해서, 우측 테이블로 데이터를 추가함

// 유저가 왼쪽 테이블의 로우 를 클릭할때
leftTable.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.toggle('active');
  });
});

// #추가버튼을 클릭 할 경우,
moveRightButton.addEventListener('click', () => {
  let userSelectedList = [];
  const selectedRows = Array.from(leftTable.querySelectorAll('.active'));

  selectedRows.forEach((row) => {
    userSelectedList.push(convertToTableObj(row));
  });

  createdRightTableData = [
    ...initialExistedRightTableDataArray,
    ...userSelectedList
  ];

  previousData.push(...createdRightTableData);
  console.log('previousData', previousData);

  let uniqueData = excludeDuplicatedData();
  console.log('uniqueData', uniqueData);

  const tbody = document.querySelector('.right-table tbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  console.log('tbody', tbody);

  // const result = RenderingTableTbody(createdRightTableData);
  const result = RenderingTableTbody(uniqueData);

  if (result === undefined) return;

  rightTable.appendChild(result);

  // =======================>

  leftTable
    .querySelectorAll('tbody tr')
    .forEach((item) => item.classList.remove('active'));
  createdRightTableData = [];
  initialExistedRightTableDataArray = [];

  console.log('result', result);
});

// =======================================>
// # Category, 삭제 버튼
// 오른쪽 테이블 로우를 클릭해서, 오른쪽 데이터가 삭제된다.

document
  .querySelector('.right-table tbody')
  .addEventListener('click', function (e) {
    let selectedTR = e.target.parentNode;
    selectedTR.classList.add('tobeDeleted');
  });

moveLeftButton.addEventListener('click', function () {
  const RowsToBeDeleted = Array.from(
    rightTable.querySelectorAll('.tobeDeleted')
  );

  RowsToBeDeleted.forEach((rows) => rows.remove());
});
