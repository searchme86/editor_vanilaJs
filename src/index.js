const leftTable = document.querySelector('.left_area table');
const leftTableHead = document.querySelector('.left_area table thead');
const leftTableTbody = document.getElementById('itemList_tbody');
const tableRowList = document.querySelectorAll('.left_area #itemList_tbody tr');

const addButton = document.getElementById('add-contents');
// const rightTable = document.querySelector('.right_area table');
const target = document.querySelector('.right_area .target');

const tableColumnTitle = [
  'tablelistuid',
  'category',
  'categoryTell',
  'categoryVerify',
  'uploader',
  'dateToUpload',
];

//table 데이터
let wholeTableData = [];
let checkedRowInfo = [];

const insertAfter = (newNode, existingNode) => {
  existingNode.parentNode.insertAfter(newNode, existingNode.nextSibling);
};

// step1
// 테이블의 모든 내용을 배열로 갖고 있는다.
tableRowList.forEach((tableTr) => {
  let tableRowdata = [];

  Array.prototype.slice.call(tableTr.children).forEach((tableTd) => {
    tableRowdata.push(tableTd.textContent.trim());
  });
  tableRowdata.unshift(tableTr.dataset.tablelistuid);

  const tableDataObj = tableColumnTitle.reduce((acc, key, index) => {
    return { ...acc, [key]: tableRowdata[index] };
  }, {});

  wholeTableData.push(tableDataObj);
});

// step2
// 유저가 클릭한 로우 데이터만 배열을 만든다.
tableRowList.forEach((tableTr) => {
  let tableRowdata = [];
  if (tableTr.classList.contains('active')) {
    // console.log('tableTr', tableTr);
    // console.log('tableTr.dataset.tablelistuid', tableTr.dataset.tablelistuid);

    Array.prototype.slice.call(tableTr.children).forEach((tableTd) => {
      tableRowdata.push(tableTd.textContent.trim());
    });
    tableRowdata.unshift(tableTr.dataset.tablelistuid);

    const checkedTrContents = tableColumnTitle.reduce((acc, key, index) => {
      return { ...acc, [key]: tableRowdata[index] };
    }, {});
    tableRowdata = [];
    checkedRowInfo.push(checkedTrContents);
  }
});

addButton.addEventListener('click', function () {
  leftTableTbody?.remove();

  let filteredData = wholeTableData.filter(
    (object1) =>
      !checkedRowInfo.some(
        (object2) => object1?.tablelistuid === object2?.tablelistuid
      )
  );

  const fiteredToAdd = filteredData.map((item) => {
    return `<tr data-tablelistuid="${item.tablelistuid}"><td>${item.category}</td><td>${item.categoryTell}</td><td>${item.categoryVerify}</td><td>${item.uploader}</td><td>${item.dateToUpload}</td></tr>`;
  });

  const movedData = checkedRowInfo.map((checked) => {
    return `<tr data-tablelistuid="${checked.tablelistuid}" class="active"><td>${checked.category}</td><td>${checked.categoryTell}</td><td>${checked.categoryVerify}</td><td>${checked.uploader}</td><td>${checked.dateToUpload}</td></tr>`;
  });

  console.log('fiteredToAdd', fiteredToAdd.join(' '));

  const tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'itemList_tbody');
  tbody.innerHTML = fiteredToAdd.join(' ');
  leftTable.appendChild(tbody);
  console.log('tbody', tbody);

  console.log('wholeTableData', wholeTableData);
  console.log('filteredData', filteredData);

  //text
  const something = movedData.join(' ');
  console.log('something', something);

  target.insertAdjacentHTML('beforeend', something);
});
