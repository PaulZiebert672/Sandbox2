console.log('-->',  $('.productInStockList').length);

// if($('.productInStockList').length > 0) {
    // $.get(
        // '/OnlineOperations/CheckChange',
        // null,
        // function () {
            // console.log('inside func');
        // }
    // );
// }

$el = $('.productInStockList');
for(var $item of $el) {
    $.get(
        '/OnlineOperations/CheckChange',
        { key1: 'value1' },
        function (data) {
            console.log('inside func --> ' + JSON.stringify(data));
        }
    );
}