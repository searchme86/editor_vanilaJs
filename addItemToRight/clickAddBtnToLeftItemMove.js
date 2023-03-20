// 서버에서 데이터를 호출합니다.
const data = [
  {
    tablelistuid: '1',
    category: 'Category 1',
    categoryTell: 'Tell 1',
    categoryVerify: 'Verify 1',
    uploader: 'Uploader 1',
    dateToUpload: '2022-01-01',
  },
  {
    tablelistuid: '2',
    category: 'Category 2',
    categoryTell: 'Tell 2',
    categoryVerify: 'Verify 2',
    uploader: 'Uploader 2',
    dateToUpload: '2022-01-02',
  },
  {
    tablelistuid: '3',
    category: 'Category 3',
    categoryTell: 'Tell 3',
    categoryVerify: 'Verify 3',
    uploader: 'Uploader 3',
    dateToUpload: '2022-01-03',
  },
];

// 왼쪽 테이블에 데이터를 보관합니다.
const tableLeftBody = document.querySelector('#table-left tbody');
data.forEach((item) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.tablelistuid}</td>
    <td>${item.category}</td>
    <td>${item.categoryTell}</td>
    <td>${item.categoryVerify}</td>
    <td>${item.uploader}</td>
    <td>${item.dateToUpload}</td>
  `;
  tableLeftBody.appendChild(tr);
});

// 왼쪽 테이블 row에 click 이벤트를 추가하고 active class를 추가합니다.
tableLeftBody.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'TD') {
    const tr = target.closest('tr');
    if (tr) {
      const isActive = tr.classList.contains('active');
      tableLeftBody
        .querySelectorAll('tr')
        .forEach((row) => row.classList.remove('active'));
      if (!isActive) {
        tr.classList.add('active');
      }
    }
  }
});

// 오른쪽 테이블에 데이터를 추가합니다.
const tableRightBody = document.querySelector('#table-right tbody');
document.querySelector('#add-btn').addEventListener('click', () => {
  const activeRow = tableLeftBody.querySelector('.active');
  if (activeRow) {
    const tds = activeRow.querySelectorAll('td');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tds[0].textContent}</td>
      <td>${tds[1].textContent}</td>
      <td>${tds[2].textContent}</td>
      <td>${tds[3].textContent}</td>
      <td>${tds[4].textContent}</td>
      <td>${tds[5].textContent}</td>
      <td><button class="move-left-btn">←</button></td>
    `;
    tableRightBody.appendChild(tr);
    activeRow.classList.remove('active');
  }
});

// 오른쪽 테이블 row에 click 이벤트를 추가하고 왼쪽으로 이동합니다.
tableRightBody.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('move-left-btn')) {
    const tr = target.closest('tr');
    if (tr) {
      const tds = tr.querySelectorAll('td');
      const tablelistuid = tds[0].textContent;
      const leftRows = tableLeftBody.querySelectorAll(
        `tr td:first-child:not(.no-data):not(.selected)[data-id="${tablelistuid}"]`
      );
      if (leftRows.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="no-data" colspan="6">No data</td>`;
        tableLeftBody.appendChild(tr);
      }
      leftRows.forEach((row) => row.closest('tr').remove());
      tableRightBody.removeChild(tr);
    }
  }
});
