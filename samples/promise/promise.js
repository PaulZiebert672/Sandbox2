void function () {
  /**
   * list of sample objects
   * @type {Object}[]
   */
  var list = [
    { name: 'Object 1'},
    { name: 'Object 2'},
  ];

  /**
   * initial time moment
   * @type {Number}
   */
  var date0 = Date.now();

  /**
   * prints elapsed time marked by the given string
   * @param {String} mark 
   */
  var printTime = (mark) => print(mark , 'elapsed time:', Date.now() - date0, 'ms.');

  /**
   * view contents of the list
   */
  var viewList = function () {
    setTimeout(function () {
      printTime('~~>');
      list.forEach(item => print(item.name));
    }, 500);
  };

  /**
   * add item to the list
   * @param {Object} item
   * @returns {Promise} 
   */
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

  addItem({ name: 'Object A' })
    .then(viewList)
    .catch(err => print(err));
}();