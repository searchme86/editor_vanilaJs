// Sample arrays to compare
var array1 = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
];
var array2 = [
  { id: 1, name: 'John' },
  { id: 4, name: 'Tom' },
  { id: 5, name: 'Alice' },
];

// Function to check for duplicates
function checkDuplicates(arr1, arr2) {
  let duplicates = [];
  $.each(arr1, function (index, obj1) {
    $.each(arr2, function (index, obj2) {
      // 추가하지 마세요
      if (obj1.tablelistuid === obj2.tablelistuid) {
      } else {
        //추가하세요;
      }
    });
  });
  return duplicates;
}

// Usage
var duplicateItems = checkDuplicates(array1, array2);

// Output
console.log(duplicateItems); // [{id: 1, name: 'John'}]
