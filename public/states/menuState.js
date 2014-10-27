var menu = (function(){

  var o = {
    l : {},
    preload: function(){
    },
    create: function(){
    },
  };

  o.l.startGame = function(){
    game.state.start('Level1');
  };

  return o;

})();
