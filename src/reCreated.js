// Left-table
const leftTable = document.getElementById('left-table');

//button
const moveRightButton = document.getElementById('move-right-button');
const moveLeftButton = document.getElementById('move-left-button');
const moveItemUpButton = document.getElementById('move-up-item');
const moveItemDownButton = document.getElementById('move-down-item');

// Right-table
const rightTable = document.getElementById('right-table');
const initialTBody = document.querySelector('.initial');
const initialTRs = document.querySelectorAll('.initial tr');

// Right-Data
let createdRightTableData = [];
let initialExistedRightTableDataArray = [];
let previousData = [];

// Left-Data
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

const convertTrArrayToTrObj = (tableRow) => {
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
};

const RenderingTrAndInsertTbody = (selectedData) => {
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
};

const excludeDuplicatedItems = () => {
  const filteredAndUniqueData = previousData.filter(
    (obj, index) =>
      previousData.findIndex(
        (item) => item.tablelistuid === obj.tablelistuid
      ) === index
  );
  return filteredAndUniqueData;
};

const insertAfter = (referenceNode, newNode) => {
  if (!!referenceNode.nextSibling) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    referenceNode.parentNode.appendChild(newNode);
  }
};

const moveElementsToPreviousPosition = (elements) => {
  console.log('elements', elements);
  const previousSibling = elements[0].previousSibling;
  if (!previousSibling) return;
  const parentNode = elements[0].parentNode;
  for (let i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], previousSibling.previousSibling);
  }
};

const moveElementsToNextPosition = (elements) => {
  console.log('elements', elements);

  //test

  const last = elements[elements.length - 1];

  const afterSelectedArrayPosition =
    elements[elements.length - 1].nextElementSibling;
  // 버그 발생
  //: 이유 : nextSibling으로 할 경우, 텍스트 뒤에 붙는다.
  // nextElementSibling으로 변경하면 클릭하는 횟수만큼 이동함
  //버그 코드
  // const afterSelectedArrayPosition = elements[elements.length - 1].nextSibling;

  console.log('nextSibling', afterSelectedArrayPosition);
  console.log(
    'afterSelectedArrayPosition.nextSibling',
    afterSelectedArrayPosition.nextSibling
  );
  if (!afterSelectedArrayPosition) return;
  const parentNode = elements[0].parentNode;

  for (let i = 0; i < elements.length; i++) {
    parentNode.insertBefore(
      elements[i],
      afterSelectedArrayPosition.nextSibling
    );
  }
};

initialTRs.forEach((initial) => {
  initialExistedRightTableDataArray.push(convertTrArrayToTrObj(initial));
});

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

  let uniqueData = excludeDuplicatedItems();
  const tbody = document.querySelector('.right-table tbody');

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const result = RenderingTrAndInsertTbody(uniqueData);
  if (result === undefined) return;
  rightTable.appendChild(result);

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

// # Category, 삭제 버튼
moveLeftButton.addEventListener('click', function () {
  const RowsToBeDeleted = Array.from(
    rightTable.querySelectorAll('.tobeDeleted')
  );

  RowsToBeDeleted.forEach((rows) => rows.remove());
});

// # Category, 위로이동 버튼
moveItemUpButton.addEventListener('click', function () {
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  // console.log('moveItemUpButton,RowsToBeMoved ', RowsToBeMoved);
  moveElementsToPreviousPosition(RowsToBeMoved);
});

// # Category, 아래이동 버튼
moveItemDownButton.addEventListener('click', function () {
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  // console.log('moveItemDownButton,RowsToBeMoved ', RowsToBeMoved);

  moveElementsToNextPosition(RowsToBeMoved);
});
