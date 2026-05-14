import { Scene, GameObjects } from 'phaser';

type Slot = 'head' | 'face' | 'body' | 'legs' | 'hands';

type ItemOption =
    | { kind: 'none' }
    | { kind: 'emoji';  emoji: string; size: number; dxFrac: number; dyFrac: number; depth: number; label: string }
    | { kind: 'sprite'; key: string;   widthFrac: number; dxFrac: number; dyFrac: number; depth: number; label: string };

interface SlotConfig {
    label: string;
    options: ItemOption[];
}

const CHRIS_X = 320;
const CHRIS_Y = 410;
const CHRIS_SCALE = 0.42;
const EMOJI_FONT = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Arial';

const D_BODY  = 4;
const D_LEGS  = 4;
const D_HEAD  = 6;
const D_FACE  = 7;
const D_HANDS = 7;

const SLOTS: Record<Slot, SlotConfig> = {
    head: {
        label: 'Tête',
        options: [
            { kind: 'none' },
            { kind: 'sprite', key: 'item-beret', widthFrac: 0.50, dxFrac: 0, dyFrac: -0.42, depth: D_HEAD, label: 'Pink beret' },
            { kind: 'sprite', key: 'item-bunny', widthFrac: 0.30, dxFrac: 0, dyFrac: -0.45, depth: D_HEAD, label: 'Bunny hat' },
            { kind: 'emoji', emoji: '🎩', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Top hat' },
            { kind: 'emoji', emoji: '👑', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Crown' },
            { kind: 'emoji', emoji: '🥐', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Croissant' },
            { kind: 'emoji', emoji: '🍕', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Pizza' },
            { kind: 'emoji', emoji: '🤠', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Cowboy' },
            { kind: 'emoji', emoji: '🎓', size: 80, dxFrac: 0, dyFrac: -0.46, depth: D_HEAD, label: 'Grad cap' },
        ],
    },
    face: {
        label: 'Visage',
        options: [
            { kind: 'none' },
            { kind: 'emoji', emoji: '🕶️', size: 60, dxFrac: 0, dyFrac: -0.34, depth: D_FACE, label: 'Shades' },
            { kind: 'emoji', emoji: '🥸', size: 60, dxFrac: 0, dyFrac: -0.34, depth: D_FACE, label: 'Disguise' },
            { kind: 'emoji', emoji: '🤿', size: 60, dxFrac: 0, dyFrac: -0.34, depth: D_FACE, label: 'Snorkel' },
            { kind: 'emoji', emoji: '😷', size: 60, dxFrac: 0, dyFrac: -0.34, depth: D_FACE, label: 'Mask' },
            { kind: 'emoji', emoji: '🧐', size: 60, dxFrac: 0, dyFrac: -0.34, depth: D_FACE, label: 'Monocle' },
        ],
    },
    body: {
        label: 'Corps',
        options: [
            { kind: 'none' },
            { kind: 'sprite', key: 'item-tshirt', widthFrac: 0.55, dxFrac: 0, dyFrac: -0.10, depth: D_BODY, label: 'Emoji tee' },
            { kind: 'emoji', emoji: '🦺', size: 90, dxFrac: 0, dyFrac: -0.08, depth: D_BODY, label: 'Hi-vis' },
            { kind: 'emoji', emoji: '👔', size: 90, dxFrac: 0, dyFrac: -0.08, depth: D_BODY, label: 'Tie' },
            { kind: 'emoji', emoji: '🎺', size: 80, dxFrac: 0, dyFrac: -0.08, depth: D_BODY, label: 'Trumpet' },
            { kind: 'emoji', emoji: '📿', size: 70, dxFrac: 0, dyFrac: -0.16, depth: D_BODY, label: 'Beads' },
        ],
    },
    legs: {
        label: 'Jambes',
        options: [
            { kind: 'none' },
            { kind: 'sprite', key: 'item-pants', widthFrac: 0.70, dxFrac: 0, dyFrac: 0.15, depth: D_LEGS, label: 'Pink pants' },
        ],
    },
    hands: {
        label: 'Mains',
        options: [
            { kind: 'none' },
            { kind: 'emoji', emoji: '🥖', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Baguette' },
            { kind: 'emoji', emoji: '🍌', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Banana' },
            { kind: 'emoji', emoji: '🎤', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Mic' },
            { kind: 'emoji', emoji: '🍷', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Wine' },
            { kind: 'emoji', emoji: '🪄', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Wand' },
            { kind: 'emoji', emoji: '🐠', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Fish' },
            { kind: 'emoji', emoji: '🥐', size: 50, dxFrac: 0.18, dyFrac: 0.12, depth: D_HANDS, label: 'Croissant' },
        ],
    },
};

const SLOT_ORDER: Slot[] = ['head', 'face', 'body', 'legs', 'hands'];

export class Game extends Scene
{
    chris: GameObjects.Image;
    chrisW = 0;
    chrisH = 0;
    overlays: Partial<Record<Slot, GameObjects.GameObject>> = {};
    panelDisplays: Partial<Record<Slot, GameObjects.GameObject>> = {};
    panelPositions: Partial<Record<Slot, { x: number; y: number }>> = {};
    selection: Record<Slot, number> = { head: 0, face: 0, body: 0, legs: 0, hands: 0 };
    feedback: GameObjects.Text;

    constructor() { super('Game'); }

    init() {
        this.selection = { head: 0, face: 0, body: 0, legs: 0, hands: 0 };
        this.overlays = {};
        this.panelDisplays = {};
        this.panelPositions = {};
    }

    create() {
        this.add.image(512, 384, 'background').setAlpha(0.4).setDepth(-1);

        this.add.text(320, 50, 'Christomize Chris', {
            fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(320, 90, 'Bonjour. Habillez-vous.', {
            fontFamily: 'Arial', fontSize: 20, color: '#ffd6f0',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        this.chris = this.add.image(CHRIS_X, CHRIS_Y, 'chris-swimsuit').setScale(CHRIS_SCALE).setDepth(0);
        this.chrisW = this.chris.displayWidth;
        this.chrisH = this.chris.displayHeight;
        this.tweens.add({
            targets: this.chris,
            y: CHRIS_Y - 6,
            ease: 'Sine.InOut',
            duration: 1800,
            yoyo: true,
            repeat: -1
        });

        const panelX = 800;
        SLOT_ORDER.forEach((slot, i) => {
            const y = 155 + i * 92;
            this.panelPositions[slot] = { x: panelX, y };

            this.add.text(panelX - 200, y, SLOTS[slot].label, {
                fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
                stroke: '#000000', strokeThickness: 4
            }).setOrigin(0, 0.5);

            const leftBtn = this.add.text(panelX - 90, y, '◀', {
                fontFamily: 'Arial Black', fontSize: 36, color: '#ff66cc',
                stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            leftBtn.on('pointerdown', () => this.cycle(slot, -1));

            this.refreshPanel(slot);

            const rightBtn = this.add.text(panelX + 90, y, '▶', {
                fontFamily: 'Arial Black', fontSize: 36, color: '#ff66cc',
                stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            rightBtn.on('pointerdown', () => this.cycle(slot, 1));
        });

        // Buttons row — Random on the left, Strut on the right, no overlap.
        const buttonY = 670;
        const rand = this.add.rectangle(690, buttonY, 180, 54, 0x4488ff)
            .setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true });
        this.add.text(690, buttonY, '🎲 Random', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        rand.on('pointerdown', () => this.randomize());

        const strut = this.add.rectangle(900, buttonY, 180, 60, 0xff3399)
            .setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
        const strutLabel = this.add.text(900, buttonY, 'STRUT!', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);
        this.tweens.add({
            targets: [strut, strutLabel],
            scale: 1.06,
            ease: 'Sine.InOut',
            duration: 700,
            yoyo: true,
            repeat: -1
        });
        strut.on('pointerdown', () => {
            const items = SLOT_ORDER.map(s => SLOTS[s].options[this.selection[s]]);
            this.scene.start('GameOver', { items });
        });

        this.feedback = this.add.text(320, 740, '', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffcc33',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);
    }

    cycle(slot: Slot, dir: number) {
        const opts = SLOTS[slot].options;
        const n = opts.length;
        this.selection[slot] = ((this.selection[slot] + dir) % n + n) % n;
        this.refreshPanel(slot);
        this.renderSlot(slot);
        this.checkEasterEggs(slot);
    }

    refreshPanel(slot: Slot) {
        const pos = this.panelPositions[slot]!;
        const old = this.panelDisplays[slot];
        if (old) old.destroy();

        const opt = SLOTS[slot].options[this.selection[slot]];
        let obj: GameObjects.GameObject;
        if (opt.kind === 'none') {
            obj = this.add.text(pos.x, pos.y, '—', {
                fontFamily: 'Arial', fontSize: 44, color: '#888888'
            }).setOrigin(0.5);
        } else if (opt.kind === 'emoji') {
            obj = this.add.text(pos.x, pos.y, opt.emoji, {
                fontFamily: EMOJI_FONT, fontSize: 42
            }).setOrigin(0.5);
        } else {
            const img = this.add.image(pos.x, pos.y, opt.key);
            const sourceMax = Math.max(img.width, img.height);
            img.setScale(64 / sourceMax);
            obj = img;
        }
        this.panelDisplays[slot] = obj;
    }

    renderSlot(slot: Slot) {
        const old = this.overlays[slot];
        if (old) {
            old.destroy();
            delete this.overlays[slot];
        }
        const opt = SLOTS[slot].options[this.selection[slot]];
        if (opt.kind === 'none') return;

        const x = CHRIS_X + opt.dxFrac * this.chrisW;
        const y = CHRIS_Y + opt.dyFrac * this.chrisH;

        let obj: GameObjects.Image | GameObjects.Text;
        let finalScale: number;
        if (opt.kind === 'emoji') {
            obj = this.add.text(x, y, opt.emoji, {
                fontFamily: EMOJI_FONT, fontSize: opt.size
            }).setOrigin(0.5).setDepth(opt.depth);
            finalScale = 1;
        } else {
            const img = this.add.image(x, y, opt.key).setOrigin(0.5).setDepth(opt.depth);
            finalScale = (opt.widthFrac * this.chrisW) / img.width;
            obj = img;
        }
        this.overlays[slot] = obj;

        obj.setScale(0);
        this.tweens.add({
            targets: obj,
            scale: finalScale,
            ease: 'Back.Out',
            duration: 280
        });
    }

    randomize() {
        SLOT_ORDER.forEach(slot => {
            const opts = SLOTS[slot].options;
            this.selection[slot] = Math.floor(Math.random() * opts.length);
            this.refreshPanel(slot);
            this.renderSlot(slot);
        });
        this.showFeedback('🎲 Surprise!');
    }

    checkEasterEggs(slot: Slot) {
        const opt = SLOTS[slot].options[this.selection[slot]];
        if (slot === 'head' && opt.kind === 'sprite' && opt.key === 'item-beret') {
            this.showFeedback('Magnifique! Très français.');
        }
    }

    showFeedback(msg: string) {
        this.feedback.setText(msg);
        this.feedback.setAlpha(1);
        this.tweens.killTweensOf(this.feedback);
        this.tweens.add({
            targets: this.feedback,
            alpha: 0,
            duration: 1800,
            ease: 'Sine.In'
        });
    }
}
