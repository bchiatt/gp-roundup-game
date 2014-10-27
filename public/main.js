var game = new Phaser.Game(1600, 1200, Phaser.AUTO, '');

game.state.add('menu', Menu);
game.state.add('level1', Level1);

game.state.start('menu');
