load([
    '../samples/es5/integer.js',
    '../samples/es5/calculus.js'
], function () {

var NDIGITS = 600;

print('-- sqrt 2');
print(Calc.root(UInt.parse('2').exp(NDIGITS*2), NDIGITS).toSource());

print('-- pi');
print(Calc.Archimede.PI(NDIGITS).toSource());

print('-- log 2');
print(Calc.Archimede.log(UInt.parse('2').exp(NDIGITS), NDIGITS).toSource());

}); /* load */
  