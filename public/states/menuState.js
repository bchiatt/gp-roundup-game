var Menu = (function(){

  var o = {
    l : {},
    preload: function(){
      game.load.image('startButton', 'assets/firstaid.png');
    },
    create: function(){
      o.l.startButton = game.add.button(game.width/2, 300, 'startButton', o.l.startGame, game);
      o.l.startButton.anchor.setTo(0.5,0.5);
    },
  };

  o.l.startGame = function(){
    game.state.start('level1');
  };

  return o;

})();
