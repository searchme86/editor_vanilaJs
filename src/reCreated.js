const leftTable = document.getElementById('left-table');
const rightTable = document.getElementById('right-table');

const moveRightButton = document.getElementById('move-right-button');

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

  if (renderedTableRow.length === 0) return;

  document.querySelector('.right-table tbody').innerHTML = renderedTableRow.join('');

  return tbody;
}

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

leftTable.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.toggle('active');
  });
});

// # 추가버튼을 클릭 할 경우,
moveRightButton.addEventListener('click', () => {
  let userSelectedList = [];
  const selectedRows = Array.from(leftTable.querySelectorAll('.active'));

  selectedRows.forEach((row) => {
    userSelectedList.push(convertToTableObj(row));
  });

  createdRightTableData = [
    ...initialExistedRightTableDataArray,
    ...userSelectedList,
  ];

  previousData.push(...createdRightTableData);

  console.log('previousData', previousData);

  // ===================================================>
  //2. Todo
  let uniqueData = excludeDuplicatedData();
  console.log('uniqueData', uniqueData);

  // initialTBody.remove();

  const tbody = document.querySelector('.right-table tbody');
   while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  console.log('tbody',tbody)

  const result = RenderingTableTbody(createdRightTableData);

  if (result === undefined) return;

  rightTable.appendChild(result);

  leftTable
    .querySelectorAll('tbody tr')
    .forEach((item) => item.classList.remove('active'));
  createdRightTableData = [];
  initialExistedRightTableDataArray = [];
});
