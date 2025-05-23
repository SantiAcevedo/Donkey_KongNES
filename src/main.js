import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Game1 } from './scenes/Game1';
import {Game1F} from './scenes/Game1F';
import {FinalScore} from './scenes/FinalScore'; 

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 780,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    input: {
        gamepad: true
      },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game, // Asegúrate de que Game esté aquí
        Game1,
        Game1F,
        FinalScore,
        GameOver
    ]
};

export default new Phaser.Game(config);

