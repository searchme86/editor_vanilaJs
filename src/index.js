/* class */
const LeftTable = document.querySelector('.left_area table');
const LeftTableHead = document.querySelector('.left_area table thead');
const LeftTableTbody = document.getElementById('itemList_tbody');
const TableRowListFromServer = document.querySelectorAll(
  '.left_area #itemList_tbody tr'
);

const AddButton = document.getElementById('add-contents');
const RightTable = document.querySelector('.right_area .target');

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

function initializeRowData(rowList) {
  let rowDataList = [];
  rowList.forEach((tableTr) => {
    rowDataList.push(convertToTableObj(tableTr));
  });
  return rowDataList;
}

// TODO
// 원래라면, object가 존재하고, 클릭된 애들을 바꿔야하는데,
// 첫번째는 class name을 주입해야하고, 해당 값을 selected data에 적재해야한다.
// 하지만, 지금은 이후에 대해서 고려가 된 상태이다.
function initializeSelectedData(tableRowList) {
  let rowDataList = [];
  tableRowList.forEach((tableTr) => {
    if (!tableTr.classList.contains('active')) return;
    rowDataList.push(convertToTableObj(tableTr));
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

function renderRightTable(selectedData) {
  const newData = selectedData.map((checked) => {
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
  RightTable.insertAdjacentHTML('beforeend', newData.join(' '));
  return;
}

function onClickAddThenRerenderTable(apiData, selected) {
  if (!selected || selected.length === 0) return;

  // some 을 활용한 id 체크
  const filteredData = apiData.filter(
    (data) =>
      !selected.some((selected) => selected.tablelistuid === data.tablelistuid)
  );

  deleteOldThenRenderLeftTable(filteredData);
  renderRightTable(selected);

  // selected data를 초기화
  return [];
}

/* initial */

let mockDataFromServer = [];
let selectedData = [];

mockDataFromServer = initializeRowData(TableRowListFromServer);

// 이미 선택이 된 데이터 = click 이벤트가 끝난 상태로 가정함.
// TODO 이거는 사라질 함수
selectedData = initializeSelectedData(TableRowListFromServer);

AddButton.addEventListener('click', function () {
  selectedData = onClickAddThenRerenderTable(mockDataFromServer, selectedData);
  return;
});

/*
interface (selectedData, api data)
  category:  string
  categoryTell:  string
  categoryVerify: string
  dateToUpload: ISO format string
  tablelistuid: UID string
  uploader: "admin" // type check 필요.
*/

// console.log('selectedData?', selectedData);
// function clickRow (rowClass) {
//   // 1. 해당 값을 interface selected object로 만든다.
//   // 2. 해당 객체의 유니크 아이디가 이미 있는지 여부 체크
//   // 3. 없으면, selectedData에 추가
//   // 4. 있으면, selectedData에서 제거

//   // 목적: selected data 축적
// }

// // api data => object 로 가지고 있어.
// // api data -> isSelected 라는 property.
// // isSelected가 true면, 오른쪽에 들어가는거고
// // isSelected가 false면, 왼쪽에 들어가는거고
// // 임시적으로 관리되는 isFocusedData
// // api data 를 reduce 한 data. -> isSelected

// const Container = () => {
//   const [data, setData] = useState([]);
//   const [focused, setFocused] = useState([]);

//   useEffect(
//     const apiData = axios.get();

//     // apiData -> isSelected add
//     const isSelectedData = apiData.map((item) => {
//       return {
//         ...item,
//         isSelected: false,
//       }
//     }
//     setData(isSelectedData);
//   );

//   // focused -> data
//   const onClickAdd = () => {
//     const filtered = data.filter((item) => !focused.some((focused) => focused.id === item.id));
//     setData(filtered);
//     // isSelected true.
//     setFocused([]);
//   }

//   const onClickRow = (row) => {
//     const isFocused = focused.some((focused) => focused.id === row.id);
//     if (isFocused) {
//       setFocused(focused.filter((focused) => focused.id !== row.id));
//     } else {
//       setFocused([...focused, row]);
//     }
//   }

//   return (
//     <div>
//       <LeftTable onClickRow></LeftTable>
//       <ButtonList onClickAdd />
//       <RightTable data></RightTable>
//     </div>
//   )
// }

// const LeftTable = ({ data}) => {
//   return (
//     {data.map(data => {
//       if (data.isSelected === true) return;
//       return (
//         <tr onClick={onClickRow}>
//         </tr>
//       );
//     })}
//   )
// }

// const RightTable = ({ data}) => {
//   return (
//     {data.map(data => {
//       if (data.isSelected === false) return;
//       return (
//         <tr>
//         </tr>
//       );
//     })}
//   )
// }
