import { Scene, GameObjects, Input } from 'phaser';
import {
    Category,
    CATEGORIES,
    CATEGORY_LABELS,
    CATEGORY_DEFAULTS,
    CLOTHING,
    itemKey,
} from '../clothing';

interface PlacedItem {
    sprite: GameObjects.Image;
    category: Category;
    filename: string;
}

const CHRIS_X = 310;
const CHRIS_Y = 400;
const CHRIS_TARGET_H = 600;

const SIDEBAR_X = 640;
const SIDEBAR_W = 1024 - SIDEBAR_X;
const TAB_Y = 80;
const GRID_Y = 140;
const THUMB_SIZE = 96;
const THUMB_GAP = 14;

export class Game extends Scene
{
    chris!: GameObjects.Image;
    chrisW = 0;
    chrisH = 0;

    activeCategory: Category = 'tops';
    tabBgs: Partial<Record<Category, GameObjects.Rectangle>> = {};
    thumbnailLayer!: GameObjects.Container;

    placed: PlacedItem[] = [];
    selected: PlacedItem | null = null;
    nextSpawnDepth = 100;

    selectionGfx!: GameObjects.Graphics;
    controls!: GameObjects.Container;
    controlSet: GameObjects.GameObject[] = [];

    constructor() { super('Game'); }

    init() {
        this.placed = [];
        this.selected = null;
        this.activeCategory = 'tops';
        this.tabBgs = {};
        this.nextSpawnDepth = 100;
        this.controlSet = [];
    }

    create() {
        this.add.image(512, 384, 'background').setAlpha(0.35).setDepth(-100);

        this.add.text(CHRIS_X, 36, 'Christomize Chris', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        // Mannequin
        this.chris = this.add.image(CHRIS_X, CHRIS_Y, 'chris').setDepth(0);
        const fit = CHRIS_TARGET_H / this.chris.height;
        this.chris.setScale(fit);
        this.chrisW = this.chris.displayWidth;
        this.chrisH = this.chris.displayHeight;

        // Sidebar background
        this.add.rectangle(SIDEBAR_X + SIDEBAR_W / 2, 384, SIDEBAR_W - 12, 720, 0x000000, 0.35)
            .setStrokeStyle(2, 0xffffff, 0.4)
            .setDepth(-50);

        this.buildTabs();
        this.buildThumbnails();

        // Bottom controls
        const clearBtn = this.add.rectangle(110, 730, 180, 50, 0x4488ff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 730, 'Clear All', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        clearBtn.on('pointerdown', () => this.clearAll());

        this.add.text(CHRIS_X, 738, 'click an item to dress  ·  drag to move  ·  scroll to resize  ·  ✕ to undress', {
            fontFamily: 'Arial', fontSize: 13, color: '#ffd6f0',
        }).setOrigin(0.5);

        // Selection visuals
        this.selectionGfx = this.add.graphics().setDepth(9000);
        this.controls = this.add.container(0, 0).setDepth(9001).setVisible(false);
        this.buildControls();

        // Deselect when clicking truly empty canvas
        this.input.on('pointerdown', (_p: Input.Pointer, objs: GameObjects.GameObject[]) => {
            if (objs.length === 0) this.setSelected(null);
        });

        // Mouse wheel resizes the currently selected item
        this.input.on('wheel', (_p: Input.Pointer, _objs: GameObjects.GameObject[], _dx: number, dy: number) => {
            if (!this.selected) return;
            const factor = dy > 0 ? 1 / 1.08 : 1.08;
            this.resize(this.selected, factor);
        });

        const kb = this.input.keyboard;
        if (kb) {
            kb.on('keydown-DELETE',    () => { if (this.selected) this.remove(this.selected); });
            kb.on('keydown-BACKSPACE', () => { if (this.selected) this.remove(this.selected); });
            kb.on('keydown-ESC',       () => this.setSelected(null));
        }
    }

    buildTabs() {
        const tabW = (SIDEBAR_W - 24) / CATEGORIES.length;
        CATEGORIES.forEach((cat, i) => {
            const x = SIDEBAR_X + 12 + tabW * (i + 0.5);
            const bg = this.add.rectangle(x, TAB_Y, tabW - 6, 44, 0x444466)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            this.add.text(x, TAB_Y, CATEGORY_LABELS[cat], {
                fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
                stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5);
            this.tabBgs[cat] = bg;
            bg.on('pointerdown', () => {
                this.activeCategory = cat;
                this.refreshTabs();
                this.buildThumbnails();
            });
        });
        this.refreshTabs();
    }

    refreshTabs() {
        for (const cat of CATEGORIES) {
            const bg = this.tabBgs[cat];
            if (bg) bg.setFillStyle(cat === this.activeCategory ? 0xff3399 : 0x444466);
        }
    }

    buildThumbnails() {
        if (this.thumbnailLayer) this.thumbnailLayer.destroy();
        this.thumbnailLayer = this.add.container(0, 0);

        const files = CLOTHING[this.activeCategory];
        if (files.length === 0) {
            const t = this.add.text(
                SIDEBAR_X + SIDEBAR_W / 2,
                GRID_Y + 90,
                `No ${CATEGORY_LABELS[this.activeCategory].toLowerCase()} yet.\n\nDrop a PNG into\npublic/assets/${this.activeCategory}/\nand list its filename in\nsrc/game/clothing.ts`,
                {
                    fontFamily: 'Arial', fontSize: 14, color: '#cccccc', align: 'center',
                }
            ).setOrigin(0.5);
            this.thumbnailLayer.add(t);
            return;
        }

        const cols = 3;
        files.forEach((file, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = SIDEBAR_X + 24 + col * (THUMB_SIZE + THUMB_GAP) + THUMB_SIZE / 2;
            const y = GRID_Y + row * (THUMB_SIZE + THUMB_GAP) + THUMB_SIZE / 2;

            const frame = this.add.rectangle(x, y, THUMB_SIZE, THUMB_SIZE, 0xffffff, 0.08)
                .setStrokeStyle(2, 0xffffff, 0.6);
            const img = this.add.image(x, y, itemKey(this.activeCategory, file));
            const m = Math.max(img.width, img.height) || 1;
            img.setScale((THUMB_SIZE - 12) / m);

            const hit = this.add.rectangle(x, y, THUMB_SIZE, THUMB_SIZE, 0xffffff, 0.001)
                .setInteractive({ useHandCursor: true });
            hit.on('pointerdown', () => this.spawn(this.activeCategory, file));
            hit.on('pointerover', () => frame.setStrokeStyle(3, 0xff66cc));
            hit.on('pointerout',  () => frame.setStrokeStyle(2, 0xffffff, 0.6));

            this.thumbnailLayer.add([frame, img, hit]);
        });
    }

    spawn(category: Category, filename: string) {
        const defaults = CATEGORY_DEFAULTS[category];
        const x = CHRIS_X;
        const y = CHRIS_Y + defaults.dyFrac * this.chrisH;

        const sprite = this.add.image(x, y, itemKey(category, filename))
            .setOrigin(0.5)
            .setDepth(defaults.depth + this.nextSpawnDepth++);

        const targetScale = (defaults.widthFrac * this.chrisW) / Math.max(sprite.width, 1);

        sprite.setInteractive({ useHandCursor: true, draggable: true });
        this.input.setDraggable(sprite);

        const item: PlacedItem = { sprite, category, filename };
        this.placed.push(item);

        sprite.on('pointerdown', () => this.setSelected(item));
        sprite.on('drag', (_p: Input.Pointer, dragX: number, dragY: number) => {
            sprite.setPosition(dragX, dragY);
            if (this.selected === item) this.refreshSelectionVisuals();
        });

        sprite.setScale(0);
        this.tweens.add({ targets: sprite, scale: targetScale, ease: 'Back.Out', duration: 240 });

        this.setSelected(item);
    }

    setSelected(item: PlacedItem | null) {
        this.selected = item;
        if (!item) {
            this.selectionGfx.clear();
            this.controls.setVisible(false);
            return;
        }
        // Bring selected to top
        item.sprite.setDepth(this.nextSpawnDepth++ + 1000);
        this.refreshSelectionVisuals();
    }

    refreshSelectionVisuals() {
        const item = this.selected;
        if (!item) return;

        const s = item.sprite;
        const w = s.displayWidth;
        const h = s.displayHeight;
        const x = s.x - w / 2;
        const y = s.y - h / 2;

        this.selectionGfx.clear();
        this.selectionGfx.lineStyle(3, 0xffcc33, 0.95);
        this.selectionGfx.strokeRect(x - 4, y - 4, w + 8, h + 8);

        // Anchor the +/-/X bar above the item, but keep it on-screen.
        const barY = Math.max(28, y - 28);
        const barX = Math.min(Math.max(60, s.x), SIDEBAR_X - 60);
        this.controls.setPosition(barX, barY);
        this.controls.setVisible(true);
    }

    buildControls() {
        const button = (offset: number, label: string, color: number, onClick: () => void) => {
            const bg = this.add.rectangle(offset, 0, 36, 36, color)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            const t = this.add.text(offset, 0, label, {
                fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5);
            bg.on('pointerdown', (_p: Input.Pointer, _x: number, _y: number, ev: { stopPropagation: () => void }) => {
                onClick();
                ev.stopPropagation();
            });
            return [bg, t] as GameObjects.GameObject[];
        };

        const minus = button(-46, '−', 0x4488ff, () => { if (this.selected) this.resize(this.selected, 1 / 1.12); });
        const plus  = button(  0, '+',      0x4488ff, () => { if (this.selected) this.resize(this.selected, 1.12); });
        const close = button( 46, '✕', 0xff3366, () => { if (this.selected) this.remove(this.selected); });

        this.controlSet = [...minus, ...plus, ...close];
        this.controls.add(this.controlSet);
    }

    resize(item: PlacedItem, factor: number) {
        const next = Math.max(0.05, Math.min(3.0, item.sprite.scaleX * factor));
        item.sprite.setScale(next);
        if (this.selected === item) this.refreshSelectionVisuals();
    }

    remove(item: PlacedItem) {
        item.sprite.destroy();
        this.placed = this.placed.filter(p => p !== item);
        if (this.selected === item) this.setSelected(null);
    }

    clearAll() {
        for (const item of [...this.placed]) item.sprite.destroy();
        this.placed = [];
        this.setSelected(null);
    }
}
