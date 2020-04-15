var list = [
  { name: 'Object 1'},
  { name: 'Object 2'},
];
var date0 = Date.now();
var printTime = (mark) => print(mark , 'elapsed time:', Date.now() - date0, 'ms.');

var viewList = function () {
  setTimeout(function () {
    printTime('~~>');
    list.forEach(item => print(item.name));
  }, 500);
};

var addItem = function (item, callback) {
  setTimeout(function() {
    printTime('::>');
    list.push(item);
    callback && callback();
  }, 1000);
};

//addItem({ name: 'Object A' });
//viewList();
addItem({ name: 'Object A' }, viewList);
