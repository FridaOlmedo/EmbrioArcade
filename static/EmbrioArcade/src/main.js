import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { DefeatScene } from './scenes/DefeatScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,                     // 👉 Cambiado a 1280x720 (16:9)
    height: 720,
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,      // 👉 Se adapta manteniendo proporciones
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MenuScene, GameScene, VictoryScene, DefeatScene]
};

const game = new Phaser.Game(config);

// ✅ Hace que al cambiar tamaño (landscape / portrait) se ajuste
window.addEventListener('resize', () => game.scale.refresh());