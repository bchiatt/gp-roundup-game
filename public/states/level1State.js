var Level1 = (function(){

  var o = {
    l : {},
    preload: function(){
      game.load.image('sky', 'assets/sky.png');
      game.load.image('ground', 'assets/platform.png');
      game.load.image('star', 'assets/star.png');
      game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.add.sprite(0, 0, 'sky');

      platforms = game.add.group();
      platforms.enableBody = true;

      var ground = platforms.create(0, game.world.height - 64, 'ground');
      ground.scale.setTo(2, 2);
      ground.body.immovable = true;

      var ledge = platforms.create(400, 400, 'ground');
      ledge.body.immovable = true;

      ledge = platforms.create(-150, 250, 'ground');
      ledge.body.immovable = true;

      player = game.add.sprite(32, game.world.height - 150, 'dude');

      game.physics.arcade.enable(player);

      player.body.bounce.y = 0.4;
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;

      player.animations.add('left', [0, 1, 2, 3], 10, true);
      player.animations.add('right', [5, 6, 7, 8], 10, true);

      cursors = game.input.keyboard.createCursorKeys();
      game.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

      stars = game.add.group();
      stars.enableBody = true;

      for (var i = 0; i < 500; i++){
        var star = stars.create(i * 4, 0, 'star');

        star.body.gravity.y = 106;

        star.body.bounce.y = 0.7 + Math.random() * 0.2;
      }
    },
    update: function(){
      game.physics.arcade.collide(player, platforms);
      game.physics.arcade.collide(stars, platforms);
      game.physics.arcade.overlap(player, stars, o.l.collectStar, null, this);

      player.body.velocity.x = 0;

      if (cursors.left.isDown){
          player.body.velocity.x = -150;

          player.animations.play('left');
      }
      else if (cursors.right.isDown)
      {
          player.body.velocity.x = 150;

          player.animations.play('right');
      }
      else
      {
          player.animations.stop();

          player.frame = 4;
      }

      if (cursors.up.isDown && player.body.touching.down)
      {
          player.body.velocity.y = -350;
      }
    }
  };

  o.l.collectStar = function(player, star){
     star.kill();
     o.l.score += 10;
     game.scoreText.text = 'Score: ' + o.l.score;
  };

  o.l.gameOver = function(){
    //game.state.restart();
    //o.l.song.destroy();
  };

  o.l.jump = function(){
    //game.add.tween(o.l.dude).to({angle: -20}, 100).start();
    //o.l.dude.body.velocity.y = -350;
    //o.l.jumpSound.play();
  };

  return o;

})();
