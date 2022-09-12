import { Input, Scene } from 'phaser';

import { EVENTS_NAME, GameStatus } from '../consts';
import { Actor } from './actor';
import { Text } from './text';

export class Player extends Actor {
  private keys: any;
  private keySpace: Input.Keyboard.Key;
  private hpValue: Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'king');

    // KEYS
    this.keys = this.scene.input.keyboard.addKeys('W, A, S, D, LEFT,RIGHT,UP,DOWN');
    this.keySpace = this.scene.input.keyboard.addKey(32);
    this.keySpace.on('down', (event: KeyboardEvent) => {
      this.anims.play('attack', true);
      this.scene.game.events.emit(EVENTS_NAME.attack);
    });

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.8, 0.5);

    // PHYSICS
    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);

    // ANIMATIONS
    this.initAnimations();

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  update(): void {
    const W = this.keys.W?.isDown || this.keys.UP?.isDown;
    const A = this.keys.A?.isDown || this.keys.LEFT?.isDown;
    const S = this.keys.S?.isDown || this.keys.DOWN?.isDown;
    const D = this.keys.D?.isDown || this.keys.RIGHT?.isDown;
    this.getBody().setVelocity(0);

    if (W) {
      this.body.velocity.y = -110;
      !this.anims.isPlaying && this.anims.play('run', true);
    }

    if (A) {
      this.body.velocity.x = -110;
      this.checkFlip();
      this.getBody().setOffset(48, 15);
      !this.anims.isPlaying && this.anims.play('run', true);
    }

    if (S) {
      this.body.velocity.y = 110;
      !this.anims.isPlaying && this.anims.play('run', true);
    }

    if (D) {
      this.body.velocity.x = 110;
      this.checkFlip();
      this.getBody().setOffset(15, 15);
      !this.anims.isPlaying && this.anims.play('run', true);
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    this.hpValue.setOrigin(0.8, 0.5);
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'run-',
        end: 7,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'attack-',
        end: 2,
      }),
      frameRate: 8,
    });
  }

  public getDamage(value?: number): void {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
    }
  }
}
