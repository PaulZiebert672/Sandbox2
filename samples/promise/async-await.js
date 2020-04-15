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

var addItem = function (item) {
  return new Promise(function (resolve, reject) {
    setTimeout(function() {
      printTime('::>');
      list.push(item);
      var err = false;
      (!err)? resolve(): reject('Error occured');
    }, 1000);
  });
};

void async function () {
  await addItem({ name: 'Object A' });
  viewList();
}();
