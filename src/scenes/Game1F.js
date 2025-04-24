// src/scenes/Game1F.js
import Phaser from 'phaser';

export class Game1F extends Phaser.Scene {
  constructor() {
    super('Game1F');
  }

  create() {
    // — Fondo & Score —
    this.cameras.main.setBackgroundColor('#00000a');

    // — Plataformas base —
    this.platforms = this.physics.add.staticGroup();
    // Suelo
    for (let x = 0; x < 1024; x += 95) {
      this.platforms.create(x, 770, 'viga').setScale(1).refreshBody();
    }
    // Filas escalonadas (y = 745, 725, 705, 680)
    [745, 725, 705, 680].forEach(y => {
      for (let i = 0; i < 6; i++) {
        this.platforms
          .create(764 - i * 100, y, 'viga')
          .setScale(0.8)
          .refreshBody();
      }
    });
    // Piezas sueltas
    [
      [140,650],[62,650],[890,650],[968,650],
      [140,530],[90,530],[890,530],[940,530],
      [140,410],[115,410],[890,410],[915,410],
      [140,280],[890,280],
    ].forEach(([x,y]) =>
      this.platforms.create(x, y, 'viga').setScale(0.8).refreshBody()
    );

    // — Escaleras —
    this.stairs = this.physics.add.staticGroup();
    [
      [1000,740],[30,740],
      [965,620],[65,620],
      [930,500],[100,500],
      [895,370],[135,370],
    ].forEach(([x,y]) =>
      this.generateLadder(x, y, 7, 16, 'ladderG', 4)
    );

    // — Donkey Kong “colgado” en el aire —
    this.dk = this.physics.add.sprite(500, 210, 'dk').setScale(3.5);
    this.dk.body.setAllowGravity(false);
    this.anims.create({
      key: 'dk_idle',
      frames: this.anims.generateFrameNumbers('dk', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    this.dk.play('dk_idle');

    // — Tras 2 s, DK cae y colisiona; después 1.5 s aparece la nueva plataforma + personajes —
    this.time.delayedCall(2000, () => {
      // Dejar caer a DK
      this.dk.body.setAllowGravity(true);
      this.physics.add.collider(this.dk, this.platforms);

      // 1.5 s después generamos la nueva plataforma **y** las imágenes
      this.time.delayedCall(1500, () => {
        // 1) Plataforma idéntica a la de y=680 pero a y=280
        for (let i = 0; i < 6; i++) {
          this.platforms
            .create(764 - i * 100, 280, 'viga')
            .setScale(0.8)
            .refreshBody();
        }

        // --- COORDENADAS A TU GUSTO ---
        const paulinePos = { x: 390, y: 240 };
        const marioPos   = { x: 600, y: 225 };
        const heartPos   = { x: 500, y: 200 };

        // 2) Pauline, Mario y Heart en las posiciones definidas
        this.add.image(paulinePos.x, paulinePos.y, 'pauline').setScale(2.6);
        this.add.image(marioPos.x,   marioPos.y,   'mario')
          .setScale(2.8)
          .setFlipX(true);
        this.add.image(heartPos.x,   heartPos.y,   'heart').setScale(2.7);

        // 3) Dos segundos después volvemos a MainMenu
        this.time.delayedCall(2000, () => {
          this.scene.start('FinalScore', { totalScore: this.totalScore });
        });
      });
    });
  }

  // Generador de escaleras
  generateLadder(x, y, numSteps = 7, stepSpacing = 16, key = 'ladderG', scale = 1) {
    for (let i = 0; i < numSteps; i++) {
      this.stairs
        .create(x, y - i * stepSpacing, key)
        .setScale(scale)
        .refreshBody();
    }
  }

  update() {
    // (vacío por ahora)
  }
}
