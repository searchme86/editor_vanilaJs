// 왼쪽 테이블 선택된 행 목록
let selectedRows = [];

// 왼쪽 테이블 생성
const leftTable = document.createElement('table');
const leftTableHead = document.createElement('thead');
const leftTableHeaderRow = document.createElement('tr');
const leftTableHeader = document.createElement('th');
leftTableHeader.textContent = 'Select';
leftTableHeaderRow.appendChild(leftTableHeader);
for (const key in data[0]) {
  const leftTableHeader = document.createElement('th');
  leftTableHeader.textContent = key;
  leftTableHeaderRow.appendChild(leftTableHeader);
}
leftTableHead.appendChild(leftTableHeaderRow);
leftTable.appendChild(leftTableHead);
const leftTableBody = document.createElement('tbody');
data.forEach((rowData) => {
  const leftTableRow = document.createElement('tr');
  const leftTableRowSelect = document.createElement('td');
  const leftTableRowSelectInput = document.createElement('input');
  leftTableRowSelectInput.type = 'checkbox';
  leftTableRowSelectInput.dataset.id = rowData.tablelistuid;
  leftTableRowSelect.appendChild(leftTableRowSelectInput);
  leftTableRow.appendChild(leftTableRowSelect);
  for (const key in rowData) {
    const leftTableData = document.createElement('td');
    leftTableData.textContent = rowData[key];
    leftTableRow.appendChild(leftTableData);
  }
  leftTableBody.appendChild(leftTableRow);
});
leftTable.appendChild(leftTableBody);

// 왼쪽 테이블 이벤트 리스너 등록
leftTable.addEventListener('click', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (checkbox) {
    const selectedId = checkbox.dataset.id;
    const selectedRow = data.find((row) => row.tablelistuid === selectedId);
    if (selectedRows.includes(selectedRow)) {
      selectedRows = selectedRows.filter((row) => row !== selectedRow);
    } else {
      selectedRows.push(selectedRow);
    }
    checkbox.checked = !checkbox.checked;
    highlightSelectedRows(leftTableBody);
  }
});

// 왼쪽 테이블 선택한 행 하이라이트 표시
function highlightSelectedRows(tableBody) {
  const tableRows = tableBody.querySelectorAll('tr');
  tableRows.forEach((row) => {
    if (
      selectedRows.includes(
        data.find(
          (dataRow) =>
            dataRow.tablelistuid ===
            row.querySelector('td input[type="checkbox"]').dataset.id
        )
      )
    ) {
      row.classList.add('selected');
    } else {
      row.classList.remove('selected');
    }
  });
}
