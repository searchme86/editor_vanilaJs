$(document).ready(function () {
  var depth = 0; // initial depth is 0

  // add data-itemdepth attribute to each li element
  $('#myList li').attr('data-itemdepth', 0);

  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      // increase depth if checked
      depth += 1;
    } else {
      // decrease depth if unchecked
      depth -= 1;
    }

    // update data-itemdepth for each li element
    $('#myList li').each(function () {
      var index = $(this).index();
      $(this).attr('data-itemdepth', index < depth ? index + 1 : depth);
    });
  });

  $('#indentButton').click(function () {
    var $checkedItems = $('input[type="checkbox"]:checked');

    if ($checkedItems.length > 0) {
      var $lastCheckedItem = $(
        $checkedItems[$checkedItems.length - 1]
      ).parent();
      var lastCheckedItemIndex = $lastCheckedItem.index();

      // move all checked items
      $checkedItems.each(function () {
        var $item = $(this).parent();
        var itemIndex = $item.index();
        var itemDepth = $item.attr('data-itemdepth');

        // move the item only if it is not at the target depth
        if (itemIndex >= lastCheckedItemIndex || itemDepth < depth) {
          $item.css('padding-left', 12 * depth);
          $item.attr('data-itemdepth', depth);
        }
      });
    }
  });
});
