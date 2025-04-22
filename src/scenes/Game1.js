import Phaser from 'phaser';

export class Game1 extends Phaser.Scene {
    constructor() {
        super('Game1');
        this.skipJumpAnim = false;
        this.score = 0;  // Contador de puntuación
    }

    preload() {
        // — Carga de assets —
        this.load.image('viga',    'assets/viga.png');
        this.load.image('ladderG', 'assets/ladderG.png');
        this.load.image('button',  'assets/button.png');    // <— tu collectible
        this.load.spritesheet('mario', 'assets/mario.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('dk',    'assets/dk.png',    { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // — Fondo —
        this.cameras.main.setBackgroundColor('#00000a');

        // — Puntuación en pantalla —
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px', fill: '#fff'
        });

        // — Plataformas —
        this.platforms = this.physics.add.staticGroup();
        for (let x = 0; x < 1024; x += 95) {
            this.platforms.create(x, 770, 'viga').setScale(1).refreshBody();
        }
        [650, 530, 410, 280].forEach(y => {
            for (let i = 0; i < 6; i++) {
                this.platforms.create(764 - i * 100, y, 'viga')
                              .setScale(0.8).refreshBody();
            }
        });
        [
            [140,650],[62,650],[890,650],[968,650],
            [140,530],[90,530],[890,530],[940,530],
            [140,410],[115,410],[890,410],[915,410],
            [140,280],[890,280]
        ].forEach(([x,y])=>
            this.platforms.create(x,y,'viga').setScale(0.8).refreshBody()
        );

        // — Mario —
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
        this.mario.setBounce(0.1).setCollideWorldBounds(true).body.setGravityY(300);
        const w = this.mario.width * 0.6, h = this.mario.height * 0.8;
        this.mario.body.setSize(w, h)
                        .setOffset((this.mario.width - w) / 2, this.mario.height - h);

        // — Animaciones Mario —
        this.anims.create({ key:'idle',  frames:[{key:'mario',frame:0}], frameRate:10 });
        this.anims.create({ key:'walk',  frames:this.anims.generateFrameNumbers('mario',{start:1,end:2}), frameRate:10, repeat:-1 });
        this.anims.create({ key:'jump',  frames:[{key:'mario',frame:11}], frameRate:2 });
        this.anims.create({ key:'climb', frames:this.anims.generateFrameNumbers('mario',{start:4,end:5}), frameRate:5, repeat:-1 });
        this.mario.play('idle');

        // — Donkey Kong —
        this.dk = this.physics.add.sprite(500,220,'dk').setScale(3);
        this.dk.setBounce(0.1).setCollideWorldBounds(true);
        this.physics.add.collider(this.dk, this.platforms);
        this.anims.create({ key:'dk_idle', frames:this.anims.generateFrameNumbers('dk',{start:0,end:2}), frameRate:2, repeat:-1 });
        this.dk.play('dk_idle');

        // — Controles —
        this.cursors = this.input.keyboard.createCursorKeys();

        // — Escaleras —
        this.stairs = this.physics.add.staticGroup();
        [
          [1000,740],[30,740],[480,740],
          [390,620],[590,620],[965,620],[65,620],
          [930,500],[100,500],[515,500],
          [895,370],[135,370],[235,370],[795,370]
        ].forEach(([x,y])=> this.generateLadder(x, y, 7, 16, 'ladderG', 4) );

        // — Botones (collectibles) —
        this.buttons = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        // Define aquí tus posiciones de botón:
        const buttonPositions = [
          [202, 650],
          [827, 650],
          [200, 530],
          [827, 530],
          [827, 410],
          [200, 410],
          [200, 280],
          [827, 280]
        ];
        buttonPositions.forEach(([x, y]) => {
            this.buttons.create(x, y, 'button').setScale(0.8).refreshBody();
        });
        // Overlap Mario ↔ botones
        this.physics.add.overlap(this.mario, this.buttons, this.collectButton, null, this);

        // — Colisión Mario ↔ Plataformas con filtro —
        this.onStairs = false;
        this.physics.add.collider(
            this.mario,
            this.platforms,
            this.handlePlatformCollision,
            (m, p) => {
                return !this.onStairs &&
                       m.body.velocity.y > 0 &&
                       (m.body.bottom <= p.body.top + 5);
            },
            this
        );
    }

    update() {
        const onFloor = this.mario.body.onFloor();
        let vx = 0;

        // — Movimiento horizontal & salto —
        if (this.cursors.left.isDown)      { vx = -160; this.mario.setFlipX(true); }
        else if (this.cursors.right.isDown){ vx =  160; this.mario.setFlipX(false); }
        this.mario.setVelocityX(vx);
        if (this.cursors.up.isDown && onFloor) {
            this.mario.setVelocityY(-290);
        }

        // — Animaciones suelo vs aire —
        if (!onFloor) {
            if (!this.skipJumpAnim) this.mario.play('jump', true);
            else this.skipJumpAnim = false;
        } else if (vx !== 0) {
            this.mario.play('walk', true);
        } else {
            this.mario.play('idle', true);
        }

        // — Lógica de escalera —
        this.onStairs = false;
        this.physics.overlap(this.mario, this.stairs, (m, ladder) => {
            if ((this.cursors.up.isDown || this.cursors.down.isDown) &&
                Math.abs(m.x - ladder.x) < 10) {
                this.onStairs = true;
            }
        }, null, this);

        if (this.onStairs) {
            this.mario.body.setAllowGravity(false);
            if (this.cursors.up.isDown) {
                this.mario.setVelocityY(-100).play('climb', true);
            } else if (this.cursors.down.isDown) {
                this.mario.setVelocityY(100).play('climb', true);
            } else {
                this.mario.setVelocityY(0).play('climb', true);
            }
            return;
        } else {
            this.mario.body.setAllowGravity(true);
        }
    }

    // — Recoger botón —
    collectButton(mario, button) {
        const isFalling = mario.body.velocity.y > 0;
        const aboveButton = mario.body.bottom <= button.body.top + 10;
    
        if (isFalling && aboveButton) {
            button.disableBody(true, true);
            this.score += 100;
            this.scoreText.setText('Score: ' + this.score);
    
            const pts = this.add.text(button.x, button.y, '+100', {
                font: '24px Arial',
                fill: '#ffff00',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
            this.tweens.add({
                targets: pts,
                y:    pts.y - 50,
                alpha:0,
                duration: 800,
                ease: 'Power1',
                onComplete: () => pts.destroy()
            });
    
            // — Verificar si ya no quedan botones —
            if (this.buttons.countActive(true) === 0) {
                this.time.delayedCall(1000, () => {
                    this.scene.start('MainMenu');
                });
            }
        }
    }
    
    

    // — Rebote lateral tras colisión con plataforma —
    handlePlatformCollision(mario, platform) {
        if (mario.body.touching.right || mario.body.touching.left) {
            mario.setVelocityY(-150);
            this.skipJumpAnim = true;
        }
    }

    // — Generador de escaleras —
    generateLadder(x, y, numSteps, stepSpacing = 32, key = 'ladderG', scale = 1) {
        for (let i = 0; i < numSteps; i++) {
            this.stairs.create(x, y - i * stepSpacing, key)
                       .setScale(scale)
                       .refreshBody();
        }
    }
}
