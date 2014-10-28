var Level1 = (function(){

  var o = {
    l : {},
    preload: function(){
      game.load.image('wall', 'assets/gameBackground.png');
      game.load.image('ground', 'assets/ground-grey.png');
      game.load.image('ledge', 'assets/platform-grey.png');
      game.load.image('spray', 'assets/spray.png');
      game.load.spritesheet('kirby', 'assets/kirby-walking.png', 39, 53);
      game.load.spritesheet('mogwai', 'assets/cute-walking.png', 57.67, 65);
      game.load.spritesheet('gremlin', 'assets/gremlin-walking.png', 57.625, 65);
    },
    create: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.add.sprite(0, 0, 'wall');

      // platforms //
      platforms = game.add.group();
      platforms.enableBody = true;

      var ground = platforms.create(0, game.world.height - 54, 'ground');
      ground.scale.setTo(2, 2);
      ground.body.immovable = true;

      var ledge = platforms.create(500, 450, 'ledge');
      ledge.body.immovable = true;
      ledge.scale.x = 2.5;

      ledge = platforms.create(0, 320, 'ledge');
      ledge.scale.x = 2.5;
      ledge.body.immovable = true;

      ledge = platforms.create(450, 180, 'ledge');
      ledge.scale.x = 1.3;
      ledge.body.immovable = true;

      ledge = platforms.create(750, 180, 'ledge');
      ledge.scale.x = 1;
      ledge.body.immovable = true;

      // bullets //
      o.l.bullets = game.add.group();
      o.l.bullets.enableBody = true;
      o.l.bullets.physicsBodyType = Phaser.Physics.ARCADE;

      o.l.bullets.createMultiple(1, 'spray');
      o.l.bullets.setAll('checkWorldBounds', true);
      o.l.bullets.setAll('outOfBoundsKill', true);

      // player //
      player = game.add.sprite(32, game.world.height - 150, 'kirby');

      game.physics.arcade.enable(player);

      player.body.bounce.y = 0.2;
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;
      player.scale.setTo(1.5);

      player.animations.add('left', [1, 2, 3, 4, 5, 6, 7], 15, true);
      player.animations.add('right', [1, 2, 3, 4, 5, 6, 7], 15, true);

      // mogwai //
      mogwai = game.add.sprite(332, game.world.height - 220, 'mogwai');

      game.physics.arcade.enable(mogwai);

      mogwai.body.gravity.y = 300;
      mogwai.body.collideWorldBounds = true;

      mogwai.animations.add('left', [1, 2, 3, 4, 5], 15, true);
      mogwai.animations.add('right', [1, 2, 3, 4, 5], 15, true);
      mogwai.animations.add('die', [])


      // gremlin //
      gremlin = game.add.sprite(game.world.width - 50, 40, 'gremlin');

      game.physics.arcade.enable(gremlin);

      gremlin.body.gravity.y = 300;
      gremlin.body.collideWorldBounds = true;

      // controls //
      cursors = game.input.keyboard.createCursorKeys();
      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      game.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

      // score and countdown timer //
      o.l.score = 0;
      o.l.scoreDisplay = game.add.text(30, 30, 'Score: ' + o.l.score, { font: '24px Arial', fill: '#ffffff', align: 'left' });

      o.l.counter = 30;
      o.l.counterDisplay = game.add.text(700, 30, 'Remaining: ' + o.l.counter, { font: '24px Arial', fill: '#ffffff', align: 'left' });
      game.time.events.add(Phaser.Timer.SECOND * 30, o.l.gameOver, this);
      game.time.events.loop(Phaser.Timer.SECOND, o.l.updateCounter, this);
    },
    update: function(){
      game.physics.arcade.collide(player, platforms);
      game.physics.arcade.collide(mogwai, platforms);
      game.physics.arcade.collide(gremlin, platforms);
      game.physics.arcade.overlap(player, mogwai, o.l.gameOver);
      game.physics.arcade.overlap(o.l.bullets, mogwai, o.l.killMogwai, null, this);
      game.physics.arcade.overlap(o.l.bullets, gremlin, o.l.killGremlin, null, this);

      player.body.velocity.x = 0;

      if (cursors.left.isDown){
        o.l.direction = 'left';

        player.anchor.setTo(0.5, 1);
        player.scale.x = -1.5;
        player.body.velocity.x = -200;

        player.animations.play('left');
      }
      else if (cursors.right.isDown)
      {
        o.l.direction = 'right';

        player.anchor.setTo(0.5, 1);
        player.scale.x = 1.5;
        player.body.velocity.x = 200;

        player.animations.play('right');
      }
      else
      {
        player.animations.stop();
        player.frame = 1;
      }

      if (fireButton.isDown)
        o.l.fireBullet(player);

      if (cursors.up.isDown && player.body.touching.down)
        o.l.jump(player);
    }
  };

  o.l.fireBullet = function(player){
    var bullet = o.l.bullets.getFirstExists(false);
    if(bullet){
      bullet.reset(player.x, player.y - 20);

      if(o.l.direction === 'right'){
        bullet.anchor.setTo(0.5, 1);
        bullet.scale.x = 1;
        bullet.body.velocity.x = 450;
      }else{
        bullet.anchor.setTo(0.5, 1);
        bullet.scale.x = -1;
        bullet.body.velocity.x = -450;
      }
    }
  };

  o.l.updateCounter = function(){
     o.l.counter--;
     o.l.counterDisplay.setText('Remaining: ' + o.l.counter);
  };

  o.l.gameOver = function(){
    game.state.restart();
    //o.l.song.destroy();
  };

  o.l.killMogwai = function(){
    o.l.bullets.getFirstExists(true).kill();
    mogwai.kill();
    o.l.score += 20;
    o.l.scoreDisplay.setText('Score: ' + o.l.score);
  };

  o.l.killGremlin = function(){
    o.l.bullets.getFirstExists(true).kill();
    gremlin.kill();
    o.l.score += 40;
    o.l.scoreDisplay.setText('Score: ' + o.l.score);
  };

  o.l.jump = function(player){
    player.body.velocity.y = -350;
    //player.jumpSound.play();
  };

  return o;

})();
