import Phaser from 'phaser';

export class FinalScore extends Phaser.Scene {
  constructor() {
    super('FinalScore');
  }

  init(data) {
    // Recibimos el puntaje final
    this.finalScore = data.totalScore || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fondo
    this.cameras.main.setBackgroundColor('#00000a');

    // Texto grande centrado
    this.add.text(width / 2, height / 2 - 50,
      '¡Juego Terminado!',
      { fontSize: '48px', fill: '#fff' }
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20,
      `Puntuación Final: ${this.finalScore}`,
      { fontSize: '36px', fill: '#ff0' }
    ).setOrigin(0.5);

    // Indicador de interacción
    this.add.text(width / 2, height / 2 + 100,
      'Haz clic o presiona X para volver al menú',
      { fontSize: '24px', fill: '#fff' }
    ).setOrigin(0.5);

    // Input: click / touch
    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    }, this);

    // Input: gamepad X (o primer botón)
    this.input.gamepad.once('down', (pad, button, value) => {
      // Cualquier botón del gamepad vuelve al menú
      this.scene.start('MainMenu');
    }, this);

    // Input: keyboard X
    this.input.keyboard.once('keydown-X', () => {
      this.scene.start('MainMenu');
    });
  }

  update() {
    // espacio para futuras animaciones
  }
}
