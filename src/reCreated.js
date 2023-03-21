const leftTable = document.getElementById('left-table');

const moveRightButton = document.getElementById('move-right-button');
const moveLeftButton = document.getElementById('move-left-button');
const moveItemUpButton = document.getElementById('move-up-item');
const moveItemDownButton = document.getElementById('move-down-item');

const rightTable = document.getElementById('right-table');
const initialTBody = document.querySelector('.initial');
const initialTRs = document.querySelectorAll('.initial tr');

let createdRightTableData = [];
let initialExistedRightTableDataArray = [];
let previousData = [];

let LeftTableData = [];
let selectedData = [];
let clickedItemsToMove = [];

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload',
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
      [key]: rowData[index],
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

const moveElementsToPreviousPosition = (elements) => {
  const previousSibling = elements[0].previousSibling;
  if (!previousSibling) return;
  const parentNode = elements[0].parentNode;
  for (let i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], previousSibling.previousSibling);
  }
};

const moveElementsToNextPosition = (elements) => {
  const afterSelectedArrayPosition =
    elements[elements.length - 1].nextElementSibling;

  if (!afterSelectedArrayPosition) return;
  const parentNode = elements[0].parentNode;

  if (elements.length === 1) {
    for (let i = 0; i < elements.length; i++) {
      parentNode.insertBefore(
        elements[i],
        afterSelectedArrayPosition.nextElementSibling
      );
    }
  } else {
    for (let i = 0; i < elements.length; i--) {
      parentNode.insertBefore(
        elements[i + (elements.length - 1)],
        afterSelectedArrayPosition.nextElementSibling
      );
    }
  }
};

initialTRs.forEach((initial) => {
  initialExistedRightTableDataArray.push(convertTrArrayToTrObj(initial));
});

leftTable.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.toggle('active');
  });
});

moveRightButton.addEventListener('click', () => {
  let userSelectedList = [];

  const selectedRows = Array.from(leftTable.querySelectorAll('.active'));
  selectedRows.forEach((row) => {
    userSelectedList.push(convertTrArrayToTrObj(row));
  });
  createdRightTableData = [
    ...initialExistedRightTableDataArray,
    ...userSelectedList,
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
});

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

moveItemUpButton.addEventListener('click', function () {
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  moveElementsToPreviousPosition(RowsToBeMoved);
});

moveItemDownButton.addEventListener('click', function () {
  const RowsToBeMoved = Array.from(rightTable.querySelectorAll('.tobeDeleted'));
  moveElementsToNextPosition(RowsToBeMoved);
});
