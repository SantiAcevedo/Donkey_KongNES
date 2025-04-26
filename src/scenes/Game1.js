import Phaser from 'phaser';
import { InputManager } from '../components/InputManager';

export class Game1 extends Phaser.Scene {
  constructor() {
    super('Game1');
    this.skipJumpAnim = false;
    this.score = 0;
    this.hasHammer = false;  // estado del martillo
  }

  init(data) {
     // data.prevScore viene de Game.js
     this.prevScore = data.prevScore || 0;
     this.score = this.prevScore;
    }

  create() {
    this.inputManager = new InputManager(this);
    this.inputManager.setup();
    // — Fondo & Score —
    this.cameras.main.setBackgroundColor('#00000a');
  // — NUEVO: utilizamos this.score (ya tiene prevScore) —
  this.scoreText = this.add.text(
    120, 40,
    'I- ' + this.score,    // ahora muestra la puntuación acumulada
    { fontSize: '38px', fill: '#fff' }
  );

  // 1) Suena levelIntro
  this.levelIntro = this.sound.add('levelIntro');
  this.levelIntro.play();

  // 2) Cuando termine levelIntro, arranca stage2 en bucle (sin modificar velocidad)
  this.levelIntro.once('complete', () => {
    this.stageMusic = this.sound.add('stage2', { loop: true });
    this.stageMusic.setVolume(1.8);
    this.stageMusic.play();
    
  });
  this.runSound    = this.sound.add('run',       { loop: true,  volume: 0.5 });
  this.jumpSound   = this.sound.add('jump',      { loop: false, volume: 1.0 });
  this.hammerSound = this.sound.add('hammer',    { loop: true,  volume: 1.0 });
  this.jumpBarrelSound = this.sound.add('jumpBarrel', { loop: false, volume: 1.0 });

    // — Plataformas —
    this.platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 1024; x += 95) {
      this.platforms.create(x, 770, 'viga').setScale(1).refreshBody();
    }
    [650, 530, 410, 280].forEach(y => {
      for (let i = 0; i < 6; i++) {
        this.platforms
          .create(764 - i * 100, y, 'viga')
          .setScale(0.8)
          .refreshBody();
      }
    });
    [
      [140,650],[62,650],[890,650],[968,650],
      [140,530],[90,530],[890,530],[940,530],
      [140,410],[115,410],[890,410],[915,410],
      [140,280],[890,280],[300,200]
    ].forEach(([x,y])=>
      this.platforms.create(x, y, 'viga').setScale(0.8).refreshBody()
    );

    // — Mario —
    this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
    this.mario.setBounce(0.1).setCollideWorldBounds(true).body.setGravityY(300);
    const w = this.mario.width * 0.6, h = this.mario.height * 0.8;
    this.mario.body
      .setSize(w, h)
      .setOffset((this.mario.width - w) / 2, this.mario.height - h);

    // — Animaciones Mario —
    this.anims.create({ key:'idle',  frames:[{key:'mario',frame:0}], frameRate:10 });
    this.anims.create({
      key:'walk',
      frames:this.anims.generateFrameNumbers('mario',{start:1,end:2}),
      frameRate:10, repeat:-1
    });
    this.anims.create({ key:'jump',  frames:[{key:'mario',frame:11}], frameRate:2 });
    // climb como antes:
    this.anims.create({
      key:'climb',
      frames:this.anims.generateFrameNumbers('mario',{start:4,end:5}),
      frameRate:5, repeat:-1
    });
    // **NUEVO** animaciones de martillo (idénticas a Game.js)
    this.anims.create({
      key:'hammerIdle',
      frames:this.anims.generateFrameNumbers('mario',{start:8,end:9}),
      frameRate:10, repeat:-1
    });
    this.anims.create({
      key:'hammerWalk',
      frames:this.anims.generateFrameNumbers('mario',{start:12,end:15}),
      frameRate:10, repeat:-1
    });
    this.mario.play('idle');

    // — Donkey Kong & Pauline —
    this.dk = this.physics.add.sprite(500,180,'dk').setScale(3.2);
    this.dk.setBounce(0.1).setCollideWorldBounds(true);
    this.physics.add.collider(this.dk, this.platforms);
    this.anims.create({
      key:'dk_idle',
      frames:this.anims.generateFrameNumbers('dk',{start:0,end:2}),
      frameRate:2, repeat:-1
    });
    this.dk.play('dk_idle');

    this.pauline = this.physics.add.sprite(300,155,'pauline').setScale(2.6);
    this.pauline.setBounce(0.1).setCollideWorldBounds(true);
    this.physics.add.collider(this.pauline, this.platforms);
    this.anims.create({
      key:'pauline_idle',
      frames:this.anims.generateFrameNumbers('pauline',{start:0,end:1}),
      frameRate:2, repeat:-1
    });
    this.pauline.play('pauline_idle');

    // — Controles —
    this.cursors = this.input.keyboard.createCursorKeys();

    // — Escaleras —
    this.stairs = this.physics.add.staticGroup();
    [
    [1000,740],[30,740],[480,740],
    [390,620],[590,620],[965,620],[65,620],
    [930,500],[100,500],[515,500],
    [895,370],[135,370],[235,370],[795,370]
    ].forEach(([x,y])=> this.generateLadder(x, y, 7, 16,'ladderG',4) );

    // Ajustar depth: escaleras al fondo (0), Mario adelante (1)
    this.stairs.children.iterate(l => l.setDepth(0));
    this.mario.setDepth(1);

    // — Botones —
    this.buttons = this.physics.add.group({ allowGravity:false, immovable:true });
    [
      [202,650],[827,650],[200,530],[827,530],
      [827,410],[200,410],[200,280],[827,280]
    ].forEach(pos=> this.buttons.create(...pos,'button').setScale(0.8).refreshBody());
    this.physics.add.overlap(this.mario, this.buttons, this.collectButton, null, this);

  // — Collider Mario ↔ Plataformas sólo fuera de escaleras —
  this.onStairs = false;
  this.physics.add.collider(
    this.mario,
    this.platforms,
    this.handlePlatformCollision,
    (m, p) => !this.onStairs && m.body.velocity.y > 0 && m.body.bottom <= p.body.top + 5,
    this
  );

// === FLAMES ===

// 1) Creamos la animación (asegúrate de hacerlo **antes** de spawnear)
this.anims.create({
    key: 'flameAnim',
    frames: this.anims.generateFrameNumbers('flames', { start: 0, end: 1 }),
    frameRate: 6,
    repeat: -1
  });
  this.anims.create({
    key: 'flameScared',
    frames: this.anims.generateFrameNumbers('flames', { start: 2, end: 3 }),
    frameRate: 6,
    repeat: -1
  });
  
  
  // 2) Grupo de flames y colisiones
  this.flames = this.physics.add.group({ allowGravity: false, immovable: true });
  this.physics.add.collider(this.flames, this.platforms);
  this.physics.add.overlap(this.mario, this.flames, this.hitByFlame, null, this);
  this.physics.add.overlap(this.flames, this.stairs, this.flameClimb, null, this);
  
  // 3) Definición de spawnFlame justo después de crear el grupo
  this.spawnFlame = (x, y, targetX, duration) => {
    const f = this.flames.create(x, y, 'flames').setScale(2.8);
    f.play('flameAnim');        // lanza la animación
  
    // para que solo escale una vez por escalera
    f.hasClimbed = false;
  
    // calculamos hacia qué lado mirar inicialmente
    const initialFlip = targetX < x;
    f.setFlipX(initialFlip);
  
    // tween horizontal con flip en yoyo/repeat
    f.tween = this.tweens.add({
      targets: f,
      x: targetX,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      callbackScope: f,
      onYoyo() {
        // al rebotar invierte el flip
        this.setFlipX(!initialFlip);
      },
      onRepeat() {
        // al volver al inicio, restablece el flip inicial
        this.setFlipX(initialFlip);
      }
    });
  };
  
  // 4) Prográmalo con delayedCall (como función, no llamada directa)
  this.time.delayedCall(3000, () => this.spawnFlame(200, 610, 560, 6000));
  this.time.delayedCall(4500, () => this.spawnFlame(827, 730, 300, 7000));
  this.time.delayedCall(7500, () => this.spawnFlame(200, 490, 560, 6500));
  this.time.delayedCall(8500, () => this.spawnFlame(827, 370, 300, 7500));
  

  // — Martillos —
  this.hammers = this.physics.add.group({ allowGravity: false, immovable: true });
  [[500, 320], [50, 450]].forEach(([x, y]) =>
    this.hammers.create(x, y, 'hammer').setScale(2.8).refreshBody()
  );
  this.physics.add.overlap(this.mario, this.hammers, this.pickUpHammer, null, this);

    // === UMBRELLAS ===
    this.umbrellas = this.physics.add.group({ allowGravity:false, immovable:true });
    [[140,240],[870,480]].forEach(([x,y])=>
      this.umbrellas.create(x,y,'umbrella').setScale(3.3).refreshBody()
    );
    this.physics.add.overlap(this.mario, this.umbrellas, this.collectUmbrella, null, this);

    // === BAG ===
    this.bag = this.physics.add.group({ allowGravity:false, immovable:true });
    this.bag.create(250,500,'bag').setScale(3.4).refreshBody();
    this.physics.add.overlap(this.mario, this.bag, this.collectBag, null, this);
  }

  update() {
    // 0) Actualizar gamepad
    this.inputManager.update();
    const padMove = this.inputManager.getMovement();
    const padJump = this.inputManager.isJumping();
  
    // 1) Estado de suelo y variable de velocidad
    const onFloor = this.mario.body.onFloor();
    let vx = 0;
  
    // 2) Detección de escalera (tecla o stick vertical)
    this.onStairs = false;
    this.physics.overlap(this.mario, this.stairs, (m, ladder) => {
      const upPressed   = this.cursors.up.isDown   || padMove.y < -0.5;
      const downPressed = this.cursors.down.isDown || padMove.y >  0.5;
      if ((upPressed || downPressed) && Math.abs(m.x - ladder.x) < 10) {
        this.onStairs = true;
      }
    }, null, this);
  
    if (this.onStairs) {
      this.mario.body.setAllowGravity(false);
      if (this.cursors.up.isDown   || padMove.y < -0.5) this.mario.setVelocityY(-100).play('climb', true);
      else if (this.cursors.down.isDown || padMove.y > 0.5) this.mario.setVelocityY(100).play('climb', true);
      else this.mario.setVelocityY(0).play('climb', true);
      return;
    } else {
      this.mario.body.setAllowGravity(true);
    }
  
// 3) Movimiento horizontal (tecla o stick)
if (this.cursors.left.isDown || padMove.x < -0.1) {
  vx = -160;
  this.mario.setFlipX(true);
} 
else if (this.cursors.right.isDown || padMove.x > 0.1) {
  vx = 160;
  this.mario.setFlipX(false);
}
this.mario.setVelocityX(vx);

// Manejo del sonido de correr
if (vx !== 0 && this.mario.body.onFloor()) {
  // Estoy moviéndome en el suelo
  if (!this.runSound.isPlaying) {
    this.runSound.play();
  }
} else {
  // Estoy quieto o en el aire
  if (this.runSound.isPlaying) {
    this.runSound.stop();
  }
}

  
    // 4) Salto (tecla ↑ o push stick hacia arriba)
    const jumpPressed = (this.cursors.up.isDown  || padJump) && onFloor;
    if (jumpPressed) {
      this.jumpSound.play();
      this.mario.setVelocityY(-290);
    }
  
    // 5) Animaciones suelo vs aire, incluyendo martillo
    if (!onFloor) {
      if (!this.skipJumpAnim) {
        this.mario.play('jump', true);
      } else {
        this.skipJumpAnim = false;
      }
    } else if (vx !== 0) {
      if (this.hasHammer) this.mario.play('hammerWalk', true);
      else                this.mario.play('walk',       true);
    } else {
      if (this.hasHammer) this.mario.play('hammerIdle', true);
      else                this.mario.play('idle',       true);
    }
  }
  

  // — Recoger martillo: dura 5 s y activa animación de martillo —
pickUpHammer(mario, hammer) {
  hammer.disableBody(true, true);
  this.hasHammer = true;
  mario.play('hammerIdle', true);
    // sonar hammer mientras dure el power-up
    this.hammerSound.play();

    // animación con martillo
    mario.play('hammerIdle', true);

  // Cambiar animación de todos los flames a flameScared
  this.flames.children.iterate(f => {
    if (f && f.anims) f.play('flameScared');
  });

  this.time.delayedCall(8000, () => {
    this.hasHammer = false;
    mario.play('idle', true);
    this.hammerSound.stop();

    // Volver a la animación normal
    this.flames.children.iterate(f => {
      if (f && f.anims) f.play('flameAnim');
    });
  });
}

  // — Choque con flames respeta martillo —
  hitByFlame(m, flame) {
    if (this.hasHammer) {
      flame.destroy();
      this.score += 500;
      this.scoreText.setText('I- ' + this.score);
      // texto flotante +500...
      const pts = this.add.text(flame.x, flame.y, '500', {
        font: '34px Arial', fill: '#ff0',
        stroke: '#000', strokeThickness: 3
      }).setOrigin(0.5);
      this.tweens.add({
        targets: pts, y: pts.y - 50, alpha: 0,
        duration: 800, ease: 'Power1',
        onComplete: () => pts.destroy()
      });
    } else {
      m.setTint(0xff0000);
      this.time.delayedCall(300, () => m.clearTint());
      this.scene.restart();
    }
  }

  // — Recoger button —
  collectButton(m, b) {
    const falling = m.body.velocity.y > 0;
    const above   = m.body.bottom <= b.body.top + 10;
    if (falling && above) {
      // 1) sonido
      this.jumpBarrelSound.play();
  
      // 2) recogida y puntuación
      b.disableBody(true,true);
      this.score += 100;
      this.scoreText.setText('I- ' + this.score);
      
      const pts = this.add.text(b.x, b.y, '100', {
        font:'34px Arial', fill:'#ff0',
        stroke:'#000', strokeThickness:3
      }).setOrigin(0.5);
      this.tweens.add({
        targets: pts, y: pts.y - 50, alpha: 0,
        duration: 800, ease:'Power1',
        onComplete: ()=> pts.destroy()
      });
      if (this.buttons.countActive(true) === 0) {
        this.time.delayedCall(1000, () => {
          this.sound.stopAll();
          this.scene.start('Game1F', { totalScore: this.score });
        });
      }
    }
  }

  // — Recoger umbrella —
  collectUmbrella(m, u) {
  // 1) sonido
  this.jumpBarrelSound.play();

  // 2) recogida y puntuación
  u.disableBody(true,true);
  this.score += 800;
  this.scoreText.setText('I- ' + this.score);
    const pts = this.add.text(u.x, u.y, '800', {
      font:'34px Arial', fill:'#0ff',
      stroke:'#000', strokeThickness:3
    }).setOrigin(0.5);
    this.tweens.add({
      targets: pts, y: pts.y - 50, alpha: 0,
      duration: 800, ease:'Power1',
      onComplete: ()=> pts.destroy()
    });
  }

  // — Recoger bag —
  collectBag(m, b) {
  // 1) sonido
  this.jumpBarrelSound.play();

  // 2) recogida y puntuación
  b.disableBody(true,true);
  this.score += 800;
  this.scoreText.setText('I- ' + this.score);
    const pts = this.add.text(b.x, b.y, '800', {
      font:'34px Arial', fill:'#f0f',
      stroke:'#000', strokeThickness:3
    }).setOrigin(0.5);
    this.tweens.add({
      targets: pts, y: pts.y - 50, alpha: 0,
      duration: 800, ease:'Power1',
      onComplete: ()=> pts.destroy()
    });
  }

  // — Rebote lateral tras colisión con plataforma —
  handlePlatformCollision(m,p) {
    if (m.body.touching.left||m.body.touching.right) {
      m.setVelocityY(-150);
      this.skipJumpAnim = true;
    }
  }

  // — Escaleras con datos en el primer peldaño —
  generateLadder(x, y, numSteps=7, stepSpacing=16, key='ladderG', scale=1) {
    for (let i = 0; i < numSteps; i++) {
      const rung = this.stairs.create(x, y - i * stepSpacing, key)
                        .setScale(scale).refreshBody();
      // sólo la base lleva datos para flameClimb
      rung.setData('isBase', i === 0);
      rung.setData('steps', numSteps);
      rung.setData('spacing', stepSpacing);
    }
  }

  // — Lógica de subida de flames (igual que antes) —
  flameClimb(flame, rung) {
    if (flame.hasClimbed) return;
    if (!rung.getData('isBase')) return;
    flame.hasClimbed = true;
    flame.tween.pause();
    const climbHeight = rung.getData('steps') * rung.getData('spacing');
    const targetY     = flame.y - climbHeight - 8;
    flame.x = rung.x;
    this.tweens.add({
      targets: flame,
      y:       targetY,
      duration:1500,
      ease:    'Linear',
      onComplete: ()=> flame.tween.resume()
    });
  }

}