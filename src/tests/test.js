QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test('it plays', function(){
  $('.audio1 playPause').trigger('click');
});

console.log("s")