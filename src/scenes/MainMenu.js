import Phaser from 'phaser';
import { InputManager } from '../components/InputManager';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Setup gamepad via InputManager
        this.inputManager = new InputManager(this);
        this.inputManager.setup();

        this.cameras.main.setBackgroundColor('#00000a');

        // Fondo
        this.add.image(510, 380, 'menu').setOrigin(0.5).setScale(1.7);

        // Botón Player1
        const player1 = this.add.image(512, 430, 'player')
            .setOrigin(0.5)
            .setScale(1.4)
            .setInteractive();
        // Botón Player2
        const player2 = this.add.image(512, 465, 'player2')
            .setOrigin(0.5)
            .setScale(1.4)
            .setInteractive();

        // Música de menú
        this.menuMusic = this.sound.add('menu', { loop: true });
        this.menuMusic.play();

        // Funciones para iniciar escenas
        const startGame = () => {
            player1.disableInteractive();
            player2.disableInteractive();
            if (this.menuMusic.isPlaying) this.menuMusic.stop();
            this.startMusic = this.sound.add('start');
            this.startMusic.play();
            this.startMusic.once('complete', () => this.scene.start('Game'));
        };

        const startGame1 = () => {
            player1.disableInteractive();
            player2.disableInteractive();
            if (this.menuMusic.isPlaying) this.menuMusic.stop();
            this.startMusic = this.sound.add('start');
            this.startMusic.play();
            this.startMusic.once('complete', () => this.scene.start('Game1'));
        };

        // Mouse / Touch
        player1.on('pointerdown', startGame);
        player2.on('pointerdown', startGame1);

        // Teclado: X para Player1, S para Player2 (opcional)
        this.input.keyboard.on('keydown-X', startGame);
        this.input.keyboard.on('keydown-S', startGame1);

        // Gamepad: 0 = Cross/A -> Player1, 2 = Square -> Player2
        this.input.gamepad.on('down', (pad, button) => {
            if (button.index === 0) {
                startGame();
            } else if (button.index === 2) {
                startGame1();
            }
        });
    }
}
