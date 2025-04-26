import Phaser from 'phaser';
import { InputManager } from '../components/InputManager';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Setup gamepad via InputManager (if needed elsewhere)
        this.inputManager = new InputManager(this);
        this.inputManager.setup();

        this.cameras.main.setBackgroundColor('#00000a');

        // Fondo
        this.add.image(510, 380, 'menu').setOrigin(0.5).setScale(1.7);

        // Botón Player1
        const playerImage = this.add.image(512, 430, 'player')
            .setOrigin(0.5)
            .setScale(1.4)
            .setInteractive();
        this.add.image(512, 465, 'player2').setOrigin(0.5).setScale(1.4);

        // Música de menú
        this.menuMusic = this.sound.add('menu', { loop: true });
        this.menuMusic.play();

        // Función que arranca el juego
        const startGame = () => {
            playerImage.disableInteractive();
            if (this.menuMusic.isPlaying) this.menuMusic.stop();
            this.startMusic = this.sound.add('start');
            this.startMusic.play();
            this.startMusic.once('complete', () => this.scene.start('Game'));
        };

        // Click/tap sobre la imagen
        playerImage.on('pointerdown', startGame);

        // Tecla X del teclado
        this.input.keyboard.on('keydown-X', startGame);

        // Gamepad: botón X/A
        this.input.gamepad.on('down', (pad, button, value) => {
            // 2 = X en Xbox, 0 = A en Nintendo/PlayStation
            if (button.index === 2 || button.index === 0) {
                startGame();
            }
        });
    }
}
