/****************************************************
 * 상품항목관리 스크립트
 ****************************************************/

$(function () {
  /****************************************************
   * 우측으로 아이템 복사
   ****************************************************/

  const tableColumnTitle = [
    'tablelistuid',
    'category',
    'categoryTell',
    'categoryVerify',
    'uploader',
    'dateToUpload',
  ];

  let LeftTableTr = $('.main_table tbody tr');

  //유저가 클릭한 왼쪽 테이블의 데이터 배열
  let TRobjectArray = [];

  //중복이 있는 왼쪽 데이터 + 오른쪽 데이터 합
  // 단, 갱신된다는 가정
  let RightTableAllData = [];

  //클릭하면 클래스 active가 생성되거나 삭제됨
  $.each(LeftTableTr, function (index, element) {
    $(element).on('click', function () {
      $(element).toggleClass('active');
    });
  });

  // 개별 테이블 로우를 관련 데이터가 있는 객체로 생성함
  function convertTRToTrObjArray(tableRow) {
    let rowData = [];

    rowData.push(tableRow.attr('data-tablelistuid'));

    $.each(tableRow.children(), function (index, item) {
      rowData.push($(item).text().trim());
    });

    const obj = tableColumnTitle.reduce((acc, key, index) => {
      return {
        ...acc,
        [key]: rowData[index],
      };
    }, {});

    return obj;
  }

  //테이블 왼쪽과 오른쪽 테이블(왼쪽 테이블 + 추가된 테이블)을 서로비교
  //filterDuplicates => calcDuplicatedToFindItemToAdd
  function calcDuplicatedToFindItemToAdd(arr, reference) {
    console.log('calcDuplicatedToFindItemToAdd로 들어간 arr', arr);
    console.log('calcDuplicatedToFindItemToAdd로 들어간 reference', reference);
    // *전체 : A(오른쪽) - 왼쪽과 오른쪽 데이터 합친것에서 중복 된 것을 뺀 값(전체)

    //왼쪽 데이터 에서 오른쪽 데이터 중 왼쪽과 중복된 데이터를 뺀 값
    //왼쪽과 오늘쪽의 데이터를 모은 새로운 배열을 만듬

    //arr은
    //왼쪽 데이터 배열과 오른쪽 데이터 배열이 합친 것
    //RightTableAllData = [...TRobjectArray, ...RightTableExistedData ]
    //let DataListToAdd = calcDuplicatedToFindItemToAdd(RightTableAllData)

    let uniqueArray = [];

    $.each(arr, function (i, obj) {
      if (
        $.inArray(
          obj.tablelistuid,
          $.map(uniqueArray, function (item) {
            return item.tablelistuid;
          })
        ) === -1
      ) {
        uniqueArray.push(obj);
      }
    });

    //버그
    //기존 테이블 값을 뺴야함
    //중복이 없는 왼쪽 오른쪽 데이터에서 기존 오른쪽에 있던 것을 뺀 나머지

    //왼쪽과 오른쪽 데이터 합친것에서 중복 된 것을 뺀 값(전체)-A
    console.log(
      '1. 왼쪽과 오른쪽 데이터 합친것에서 중복 된 것을 뺀 값(전체)',
      uniqueArray
    );

    //A(오른쪽)에서 왼쪽을 뻰

    //이전(RightTableExistedData)값을 빼면
    //전제 : RightTableExistedData 은 매번 새롭게 갱신된다.
    //오른쪽에 없는 데이터 TR을 구할 수 있음

    //버그
    //기존 테이블 값을 제거해야함
    /*  const filteredAndUniqueData = uniqueArray.filter(
          (obj, index) =>{
              console.log('filteredAndUniqueData함수내',obj )
            reference.findIndex(
                (item) => {
                    console.log('reference findIndx,',item)
                    console.log('item.tablelistuid,',item.tablelistuid)
                     console.log('obj.tablelistuid,',obj.tablelistuid)
                    return item.tablelistuid === obj.tablelistuid
                }
            ) !== index
          }

       );*/

    const filteredAndUniqueData = uniqueArray.filter(
      (obj, index) =>
        reference.findIndex(
          (item) => item.tablelistuid === obj.tablelistuid
        ) !== index
    );

    console.log(
      '2. 0-1에서 기존에 있는 오른쪽 테이블 값을 뺀 것, 즉, 새로 추가할 것',
      filteredAndUniqueData
    );

    //우측 테이블에 없는 데이터를 의미함
    return filteredAndUniqueData;
  }

  function excludeDuplicatedItems(arr) {
    const unique = arr.filter(
      (obj, index) =>
        arr.findIndex((item) => item.tablelistuid === obj.tablelistuid) !==
        index
    );
    return unique;
  }

  //버그가 있는 함수
  //배열의 길이가 서로 다를 경우, 비교가 불가능
  function something(arr1, arr2) {
    /*     const unique = arr.filter(
          (obj, index) =>
               arr.findIndex(
                (item) => item.tablelistuid === obj.tablelistuid
            ) === index
       );

       return unique*/

    let result = [];

    $.each(arr1, function (index1, obj1) {
      let found = false;

      $.each(arr2, function (index2, obj2) {
        if (obj1.tablelistuid === obj2.tablelistuid) {
          found = true;
          return false;
        }
      });

      if (!found) {
        result.push(obj1);
      }
    });

    console.log('something함수 안에 result', result);

    return result;
  }

  //실행부
  $(document).on('click', 'button[name=moveRightButton]', function (e) {
    e.preventDefault();

    console.log('<======하나의 클릭이벤트 싸이클이 시작됐습니다.======>');
    // 클릭 전, 오른쪽 테이블에 있는 데이터
    // 단, 갱신된다는 가정
    let RightTableExistedData = [];

    let targetTable = document.getElementById('right-table');

    //초기화 부분

    let uniqueRightTableDataList = excludeDuplicatedItems(
      RightTableExistedData
    );
    console.log('uniqueRightTableDataList', uniqueRightTableDataList);

    //초기화 부분

    // 왼쪽에 유저가 클릭한 모든 아이템들을 배열에 넣음
    //tr.active 갯수만큼 이터레이션 중임,,,
    $.each($('#leftTbody > tr.active'), function (index, item) {
      const TRobj = convertTRToTrObjArray($(item));
      TRobjectArray.push(TRobj);
    });

    console.log('유저가 토글한 데이터 배열', TRobjectArray);

    //오른쪽에 있는 기존에 있는 아이템들을 배열에 넣음
    $.each($('#rightTbody tr'), function (index, item) {
      const RightTableItemsObj = convertTRToTrObjArray($(item));
      uniqueRightTableDataList.push(RightTableItemsObj);
    });

    //왼쪽과 오늘쪽의 데이터를 모은 새로운 배열을 만듬
    /* RightTableAllData = [...TRobjectArray, ...uniqueRightTableDataList ]*/

    console.log('변환 전', TRobjectArray);
    console.log('변환 전', uniqueRightTableDataList);

    RightTableAllData = something([
      ...TRobjectArray,
      ...uniqueRightTableDataList,
    ]);

    console.log('변환 후', TRobjectArray);
    console.log('변환 후', uniqueRightTableDataList);

    console.log(
      '0.우측버튼 누르기 이전, 이전 오른쪽 테이블 데이터',
      uniqueRightTableDataList
    );
    console.log(
      '0-1,왼쪽과 오늘쪽의 데이터를 합친것(중복을제외한)  ',
      RightTableAllData
    );

    //왼쪽 데이터 배열과 오른쪽 데이터 배열의 중복을 삭제해서
    //새로 추가될 데이터 배열을 생성
    let DataListToAdd = calcDuplicatedToFindItemToAdd(
      RightTableAllData,
      uniqueRightTableDataList
    );
    console.log('3.오른쪽에 없고 왼쪽에 있는 데이터', DataListToAdd);

    //계산된 새로 추가될 아이템 배열, DataListToAdd
    //좌우 중복을 제외한, 데이터만 오른쪽으로 이동하고, 추가된 데이터만 테이블에 추가함
    $.each(DataListToAdd, function (index, item) {
      let row = $('<tr>');
      row.attr('data-tablelistuid', item.tablelistuid);
      let category = $('<p>').text(item.category);
      let categoryTell = $('<p>').text(item.categoryTell);
      let categoryVerify = $('<p>').text(item.categoryVerify);
      let dateToUpload = $('<p>').text(item.dateToUpload);
      let uploader = $('<p>').text(item.uploader);

      let categoryCell = $('<td>').append(category);
      let categoryTellCell = $('<td>').append(categoryTell);
      let categoryVerifyCell = $('<td>').append(categoryVerify);
      let dateToUploadCell = $('<td>').append(dateToUpload);
      let uploaderCell = $('<td>').append(uploader);

      row.append(
        categoryCell,
        categoryTellCell,
        categoryVerifyCell,
        dateToUploadCell,
        uploaderCell
      );

      $('#rightTbody').append(row);
    });

    //이전에 유저가 왼쪽 테이블에 클릭해 저장된 변수의 값을 초기화
    //이전에 클릭했던 값이 중복되지 않도록 초기화 시킴
    TRobjectArray = [];

    console.log('<======하나의 클릭이벤트 싸이클이 종료됐습니다.======>');

    //여기까지 button[name=moveRightButton]코드
  });

  /****************************************************
   * 좌측으로 아이템 삭제
   ****************************************************/

  /****************************************************
   * 아래로 이동 버튼
   ****************************************************/
  $(document).on('click', 'button[name=moveDownItem]', function (e) {
    e.preventDefault();

    $($('#rightTbody>tr.active').get().reverse()).each(function () {
      let next = $(this).next();
      $(this).insertAfter(next);
    });
  });
});
