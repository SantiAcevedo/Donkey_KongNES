// src/scenes/FinalScore.js
import Phaser from 'phaser';

export class FinalScore extends Phaser.Scene {
  constructor() {
    super('FinalScore');
  }

  init(data) {
    // recogemos la puntuación total
    this.totalScore = data.totalScore || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#00000a');
    // Título
    this.add.text(512, 200, '¡Nivel Completado!', {
      fontSize: '48px', fill: '#fff'
    }).setOrigin(0.5);

    // Puntuación final
    this.add.text(512, 300, `Puntuación Total: ${this.totalScore}`, {
      fontSize: '36px', fill: '#ff0', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Botón para volver al menú
    const restart = this.add.text(512, 400, 'Volver al menú', {
      fontSize: '28px', fill: '#0ff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restart.on('pointerup', () => {
      this.scene.start('MainMenu');
    });
  }
}
