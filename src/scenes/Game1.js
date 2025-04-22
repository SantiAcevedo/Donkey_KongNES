import { Scene } from 'phaser';

export class Game1 extends Scene
{
    constructor ()
    {
        super('Game1');
        this.isClimbing = false; // Flag para controlar animación de escalada
    }

    create() {
        // — Fondo —
        this.cameras.main.setBackgroundColor('#00000a');

        // — Plataformas estáticas —
        this.platforms = this.physics.add.staticGroup();
        // Plataforma inicial en x=250, y=770 (ajustá según tu lienzo)
        for (let x = 0; x < 1024; x += 95) {
            this.platforms.create(x, 770, 'viga');
        }

        // Generar escalones de las plataformas con bucles
        let startX = 764; 
        let startY = 650;
        let stepX = -100;
        let stepY = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'viga');
            escalon.setScale(0.8).refreshBody();
        }
       
        let startX1 = 764; 
        let startY1 = 530;
        let stepX1 = -100;
        let stepY1 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX1 + (i * stepX1), startY1 + (i * stepY1), 'viga');
            escalon.setScale(0.8).refreshBody();
        }
    
        let startX2 = 764; 
        let startY2 = 410;
        let stepX2 = -100;
        let stepY2 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX2 + (i * stepX2), startY2 + (i * stepY2), 'viga');
            escalon.setScale(0.8).refreshBody();
        }

        let startX3 = 764; 
        let startY3 = 280;
        let stepX3 = -100;
        let stepY3 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX3 + (i * stepX3), startY3 + (i * stepY3), 'viga');
            escalon.setScale(0.8).refreshBody();
        }

        this.platforms.create(140, 650, 'viga').setScale(0.8).refreshBody();//primeras vigas
        this.platforms.create(62, 650, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(890, 650, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(968, 650, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(140, 530, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(90, 530, 'viga').setScale(0.8).refreshBody();//segundas vigas
        this.platforms.create(890, 530, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(940, 530, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(140, 410, 'viga').setScale(0.8).refreshBody();//terceras vigas
        this.platforms.create(115, 410, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(890, 410, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(915, 410, 'viga').setScale(0.8).refreshBody();
        this.platforms.create(140, 280, 'viga').setScale(0.8).refreshBody();//cuartas vigas
        this.platforms.create(890, 280, 'viga').setScale(0.8).refreshBody();



        // — Mario —
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        this.mario.body.setGravityY(300);

        // Crear a Donkey Kong
        this.dk = this.physics.add.sprite(500, 220, 'dk').setScale(3);
        this.dk.setBounce(0.1);
        this.dk.setCollideWorldBounds(true);
        this.physics.add.collider(this.dk, this.platforms);
        this.anims.create({
            key: 'dk_idle',
            frames: this.anims.generateFrameNumbers('dk', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        this.dk.play('dk_idle');

        // Reducir la caja de colisión si querés (igual que antes)
        const w = this.mario.width * 0.6;
        const h = this.mario.height * 0.8;
        this.mario.body.setSize(w, h);
        this.mario.body.setOffset((this.mario.width - w) / 2, this.mario.height - h);

        // — Colisiones —
        this.physics.add.collider(this.mario, this.platforms);

        // — Animaciones —
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'mario', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'mario', frame: 11 }],
            frameRate: 2
        });

        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers('mario', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        // — Controles —
        this.cursors = this.input.keyboard.createCursorKeys();
        this.mario.play('idle');

        this.stairs = this.physics.add.staticGroup();
        this.generateLadder(1000, 745, 7, 16, "ladderG", 4); //primera fila   
        this.generateLadder(30, 745, 7, 16, "ladderG", 4);
        this.generateLadder(480, 745, 7, 16, "ladderG", 4);
        this.generateLadder(390, 625, 7, 16, "ladderG", 4); //segunda fila
        this.generateLadder(590, 625, 7, 16, "ladderG", 4);
        this.generateLadder(965, 625, 7, 16, "ladderG", 4);
        this.generateLadder(65, 625, 7, 16, "ladderG", 4); 
        this.generateLadder(930, 505, 7, 16, "ladderG", 4);//tercera fila
        this.generateLadder(100, 505, 7, 16, "ladderG", 4);
        this.generateLadder(515, 505, 7, 16, "ladderG", 4);
        this.generateLadder(895, 385, 7, 16, "ladderG", 4); //ultima fila 
        this.generateLadder(135, 385, 7, 16, "ladderG", 4);
        this.generateLadder(235, 385, 7, 16, "ladderG", 4); 
        this.generateLadder(795, 385, 7, 16, "ladderG", 4);     
    }
    // Función para generar escaleras
    generateLadder(x, y, numSteps, stepSpacing = 32, key = 'ladder', scale = 1) {
        for (let i = 0; i < numSteps; i++) {
            this.stairs.create(x, y - i * stepSpacing, key).setScale(scale).refreshBody();
        }
    }

    update() {
        const onFloor = this.mario.body.onFloor();
        let vx = 0;

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            vx = -160;
            this.mario.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            vx = 160;
            this.mario.setFlipX(false);
        }
        this.mario.setVelocityX(vx);

        // Salto
        if (this.cursors.up.isDown && onFloor) {
            this.mario.setVelocityY(-290);
        }

        // Asignación de animación (una sola vez por frame)
        if (!onFloor) {
            // En el aire → salto
            this.mario.play('jump', true);
        } else if (vx !== 0) {
            // En tierra y moviéndose → caminar
            this.mario.play('walk', true);
        } else {
            // En tierra y quieto → idle
            this.mario.play('idle', true);
        }

    // 1) Detección de escalera
    this.onStairs = false;
    this.physics.overlap(this.mario, this.stairs, (m, ladder) => {
        if ((this.cursors.up.isDown || this.cursors.down.isDown) &&
            Math.abs(m.x - ladder.x) < 10) {
            this.onStairs = true;
            this.skipJumpAnim = true;
        }
    }, null, this);

    // 2) Si está en escalera: sube/baja y anima 'climb', luego salimos
    if (this.onStairs) {
        this.mario.body.setAllowGravity(false);
        if (this.cursors.up.isDown) {
            this.mario.setVelocityY(-100);
            this.mario.play('climb', true);
        } else if (this.cursors.down.isDown) {
            this.mario.setVelocityY(100);
            this.mario.play('climb', true);
        } else {
            this.mario.setVelocityY(0);
            this.mario.play('climb', true);
        }
        return; 
    } else {
        this.mario.body.setAllowGravity(true);
    }
    }
    handlePlatformCollision(mario, platform) {
        if (this.onStairs) return;
        if (mario.body.touching.right) {
            mario.setVelocityY(-150);
            this.skipJumpAnim = true; 
        }
        if (mario.body.touching.left) {
            mario.setVelocityY(-150);
        }
    }
}