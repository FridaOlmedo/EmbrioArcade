// src/scenes/GameScene.js
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('sperm1', 'assets/sperm_1.png');
        this.load.image('sperm2', 'assets/sperm_2.png');
        this.load.image('sperm3', 'assets/sperm_3.png');
        this.load.image('corazon_lleno', 'assets/corazon_rojo.png');
        this.load.image('corazon_vacio', 'assets/corazon_gris.png');
        this.load.audio('choque', 'assets/bang_caricaturesco.wav');
        this.load.audio('game_music', 'assets/music_game.mp3');
    }

    create() {
        this.CELDA = 30;
        this.FILAS = this.game.config.height / this.CELDA;
        this.COLUMNAS = this.game.config.width / this.CELDA;

        this.mapa = Array.from({ length: this.FILAS }, () => Array(this.COLUMNAS).fill(1));
        this.generarLaberinto(1, 1);

        for (let y = 0; y < this.FILAS; y++) {
            for (let x = 0; x < this.COLUMNAS; x++) {
                if (this.mapa[y][x] === 1) {
                    this.add.rectangle(
                        x * this.CELDA + this.CELDA / 2,
                        y * this.CELDA + this.CELDA / 2,
                        this.CELDA,
                        this.CELDA,
                        0xffb6c1
                    );
                }
            }
        }

        this.frames = ['sperm1', 'sperm2', 'sperm3'];
        this.frameActual = 0;
        this.animTiempo = 0;
        this.animIntervalo = 150;

        this.sperm = this.physics.add.sprite(this.CELDA + 2, this.CELDA + 2, 'sperm1');
        this.sperm.setDisplaySize(40, 40);
        this.sperm.setCollideWorldBounds(true);

        this.meta = this.add.ellipse(
            this.game.config.width - 2 * this.CELDA,
            this.game.config.height - 2 * this.CELDA,
            30, 30, 0xadd8e6
        );
        this.physics.add.existing(this.meta, true);

        // 🎵 Música
        this.music = this.sound.add('game_music', { loop: true, volume: 0.5 });
        this.music.play();

        // 🎵 Sonido de choque
        this.choque = this.sound.add('choque');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.vidas = 3;
        this.cooldownChoque = false;

        this.corazones = [];
        for (let i = 0; i < 3; i++) {
            this.corazones[i] = this.add
                .image(10 + i * 40, 10, 'corazon_lleno')
                .setOrigin(0)
                .setDisplaySize(30, 30);
        }

        // 🎯 Animaciones
        this.tweens.add({
            targets: this.meta,
            scale: { from: 1, to: 1.1 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: this.sperm,
            angle: { from: -5, to: 5 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // 🎯 Temporizador
        this.tiempoRestante = 60;
        this.tiempoText = this.add.text(800, 10, 'Tiempo: 60', { fontSize: '24px', color: '#000' });
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tiempoRestante--;
                this.tiempoText.setText('Tiempo: ' + this.tiempoRestante);
                if (this.tiempoRestante <= 0) {
                    this.music.stop();
                    this.scene.start('DefeatScene');
                }
            },
            loop: true
        });
    }

    update(time, delta) {
        let nuevaX = this.sperm.x;
        let nuevaY = this.sperm.y;
        const vel = 2.5;

        if (this.cursors.left.isDown) nuevaX -= vel;
        if (this.cursors.right.isDown) nuevaX += vel;
        if (this.cursors.up.isDown) nuevaY -= vel;
        if (this.cursors.down.isDown) nuevaY += vel;

        const cx = Math.floor(nuevaX / this.CELDA);
        const cy = Math.floor(nuevaY / this.CELDA);

        if (
            cx >= 0 && cx < this.COLUMNAS &&
            cy >= 0 && cy < this.FILAS &&
            this.mapa[cy][cx] === 0
        ) {
            this.sperm.x = nuevaX;
            this.sperm.y = nuevaY;
        } else if (
            (this.cursors.left.isDown || this.cursors.right.isDown ||
             this.cursors.up.isDown || this.cursors.down.isDown) &&
            !this.cooldownChoque
        ) {
            this.choque.play();
            this.vidas--;
            this.actualizarCorazones();

            this.cooldownChoque = true;
            this.time.delayedCall(500, () => {
                this.cooldownChoque = false;
            });

            if (this.vidas <= 0) {
                this.music.stop();
                this.scene.start('DefeatScene');
            }
        }

        this.animTiempo += delta;
        if (this.animTiempo >= this.animIntervalo) {
            this.animTiempo = 0;
            this.frameActual = (this.frameActual + 1) % this.frames.length;
            this.sperm.setTexture(this.frames[this.frameActual]);
        }

        if (Phaser.Geom.Intersects.RectangleToRectangle(
            this.sperm.getBounds(),
            this.meta.getBounds()
        )) {
            this.music.stop();
            this.scene.start('VictoryScene');
        }
    }

    actualizarCorazones() {
        for (let i = 0; i < 3; i++) {
            this.corazones[i].setTexture(
                i < this.vidas ? 'corazon_lleno' : 'corazon_vacio'
            );
        }
    }

    generarLaberinto(x, y) {
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        Phaser.Utils.Array.Shuffle(dirs);
        for (const [dx, dy] of dirs) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (
                nx > 0 && nx < this.COLUMNAS &&
                ny > 0 && ny < this.FILAS &&
                this.mapa[ny][nx] === 1
            ) {
                this.mapa[ny][nx] = 0;
                this.mapa[y + dy][x + dx] = 0;
                this.generarLaberinto(nx, ny);
            }
        }
    }
}
