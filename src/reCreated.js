const leftTable = document.getElementById('left-table');
const rightTable = document.getElementById('right-table');

const moveRightButton = document.getElementById('move-right-button');
const moveLeftButton = document.getElementById('move-left-button');
const moveItemUpButton = document.getElementById('move-up-item');
const moveItemDownButton = document.getElementById('move-down-item');

const initialTBody = document.querySelector('.initial');
const initialTRs = document.querySelectorAll('.initial tr');

// Right
let initialExistedRightTableDataArray = [];
let createdRightTableData = [];
let previousData = [];

// Left
let LeftTableData = [];
let selectedData = [];
let clickedItemsToMove = [];

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload'
];

//완료
function convertTrArrayToTrObj(tableRow) {
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
function RenderingTrAndInsertTbody(selectedData) {
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
function excludeDuplicatedItems() {
  const filteredAndUniqueData = previousData.filter(
    (obj, index) =>
      previousData.findIndex(
        (item) => item.tablelistuid === obj.tablelistuid
      ) === index
  );
  return filteredAndUniqueData;
}

const insertAfter = (referenceNode, nodeToInsert) => {
  if (!!referenceNode.nextElementSilbing) {
    referenceNode.parentNode.insertBefore(
      nodeToInsert,
      referenceNode.nextElementSilbing
    );
  } else {
    referenceNode.parentNode.appendChild(nodeToInsert);
  }
};

const moveElementsToNextPosition = (elements) => {
  console.log('elements', elements);
  const nextSibling = elements[elements.length - 1].nextSibling;
  console.log('nextSibling', nextSibling);
  if (!nextSibling) return;
  const parentNode = elements[0].parentNode;
  for (var i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], nextSibling.nextSibling);
  }
};

const moveElementsToPreviousPosition = (elements) => {
  const previousSibling = elements[0].previousSibling;
  if (!previousSibling) return;
  const parentNode = elements[0].parentNode;
  for (var i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], previousSibling.previousSibling);
  }
};

initialTRs.forEach((initial) => {
  initialExistedRightTableDataArray.push(convertTrArrayToTrObj(initial));
});

// =======================================>
// # Category, 추가 버튼
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
    userSelectedList.push(convertTrArrayToTrObj(row));
  });

  createdRightTableData = [
    ...initialExistedRightTableDataArray,
    ...userSelectedList
  ];

  previousData.push(...createdRightTableData);
  // console.log('previousData', previousData);

  let uniqueData = excludeDuplicatedItems();
  // console.log('uniqueData', uniqueData);

  const tbody = document.querySelector('.right-table tbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  console.log('tbody', tbody);

  // const result = RenderingTrAndInsertTbody(createdRightTableData);
  const result = RenderingTrAndInsertTbody(uniqueData);

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

document
  .querySelector('.right-table tbody')
  .addEventListener('click', function (e) {
    let selectedTR = e.target.parentNode;
    selectedTR.classList.add('tobeDeleted');
  });

// =======================================>
// # Category, 삭제 버튼
// 오른쪽 테이블 로우를 클릭해서, 오른쪽 데이터가 삭제된다.
moveLeftButton.addEventListener('click', function () {
  const RowsToBeDeleted = Array.from(
    rightTable.querySelectorAll('.tobeDeleted')
  );

  RowsToBeDeleted.forEach((rows) => rows.remove());
});

// =======================================>
// # Category, 위로이동 버튼
moveItemUpButton.addEventListener('click', function () {
  console.log('this', this);
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  console.log('RowsToBeMoved', RowsToBeMoved);

  // const elems = document.querySelectorAll('.my-elements');
  moveElementsToPreviousPosition(RowsToBeMoved);
});

// =======================================>
// # Category, 아래이동 버튼
moveItemDownButton.addEventListener('click', function () {
  console.log('this', this);
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  console.log('RowsToBeMoved', RowsToBeMoved);

  // const elems = document.querySelectorAll('.my-elements');
  moveElementsToNextPosition(RowsToBeMoved);
});
