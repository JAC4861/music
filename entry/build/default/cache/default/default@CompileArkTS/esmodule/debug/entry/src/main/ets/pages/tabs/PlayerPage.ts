if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlayerPage_Params {
    currentSong?: Song | undefined;
    isPlaying?: boolean;
    positionMs?: number;
    durationMs?: number;
    isLoading?: boolean;
    playRate?: number;
    dragging?: boolean;
    dragValue?: number;
    isFavorite?: boolean;
    lastSongId?: number;
}
import type { Song } from '../../service/ApiService';
import { PLAYER_SONG_KEY, PLAYER_PLAYING_KEY, PLAYER_POSITION_MS_KEY, PLAYER_DURATION_MS_KEY, PLAYER_SPEED_KEY, PLAYERBAR_VISIBLE_KEY } from "@normalized:N&&&entry/src/main/ets/service/PlayerState&";
import { PLAYER_LOADING_KEY, seekTo, toggleFavorite, togglePlayPause, playPrev, playNext, setPlaybackRate } from "@normalized:N&&&entry/src/main/ets/service/AudioPlayerService&";
import { PreferencesStore } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
import { PlayerBtnLeft, PlayerBtnRight, PlayerBtnBegin, PlayerBtnEnd } from "@normalized:N&&&entry/src/main/ets/common/UI&";
export class PlayerPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentSong = this.createStorageLink(PLAYER_SONG_KEY, undefined, "currentSong");
        this.__isPlaying = this.createStorageLink(PLAYER_PLAYING_KEY, false, "isPlaying");
        this.__positionMs = this.createStorageLink(PLAYER_POSITION_MS_KEY, 0, "positionMs");
        this.__durationMs = this.createStorageLink(PLAYER_DURATION_MS_KEY, 0, "durationMs");
        this.__isLoading = this.createStorageLink(PLAYER_LOADING_KEY, false, "isLoading");
        this.__playRate = this.createStorageLink(PLAYER_SPEED_KEY, 1.0, "playRate");
        this.__dragging = new ObservedPropertySimplePU(false, this, "dragging");
        this.__dragValue = new ObservedPropertySimplePU(0, this, "dragValue");
        this.__isFavorite = new ObservedPropertySimplePU(false, this, "isFavorite");
        this.__lastSongId = new ObservedPropertySimplePU(-1, this, "lastSongId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlayerPage_Params) {
        if (params.dragging !== undefined) {
            this.dragging = params.dragging;
        }
        if (params.dragValue !== undefined) {
            this.dragValue = params.dragValue;
        }
        if (params.isFavorite !== undefined) {
            this.isFavorite = params.isFavorite;
        }
        if (params.lastSongId !== undefined) {
            this.lastSongId = params.lastSongId;
        }
    }
    updateStateVars(params: PlayerPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentSong.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
        this.__positionMs.purgeDependencyOnElmtId(rmElmtId);
        this.__durationMs.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__playRate.purgeDependencyOnElmtId(rmElmtId);
        this.__dragging.purgeDependencyOnElmtId(rmElmtId);
        this.__dragValue.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorite.purgeDependencyOnElmtId(rmElmtId);
        this.__lastSongId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentSong.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        this.__positionMs.aboutToBeDeleted();
        this.__durationMs.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__playRate.aboutToBeDeleted();
        this.__dragging.aboutToBeDeleted();
        this.__dragValue.aboutToBeDeleted();
        this.__isFavorite.aboutToBeDeleted();
        this.__lastSongId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentSong: ObservedPropertyAbstractPU<Song | undefined>;
    get currentSong() {
        return this.__currentSong.get();
    }
    set currentSong(newValue: Song | undefined) {
        this.__currentSong.set(newValue);
    }
    private __isPlaying: ObservedPropertyAbstractPU<boolean>;
    get isPlaying() {
        return this.__isPlaying.get();
    }
    set isPlaying(newValue: boolean) {
        this.__isPlaying.set(newValue);
    }
    private __positionMs: ObservedPropertyAbstractPU<number>;
    get positionMs() {
        return this.__positionMs.get();
    }
    set positionMs(newValue: number) {
        this.__positionMs.set(newValue);
    }
    private __durationMs: ObservedPropertyAbstractPU<number>;
    get durationMs() {
        return this.__durationMs.get();
    }
    set durationMs(newValue: number) {
        this.__durationMs.set(newValue);
    }
    private __isLoading: ObservedPropertyAbstractPU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __playRate: ObservedPropertyAbstractPU<number>;
    get playRate() {
        return this.__playRate.get();
    }
    set playRate(newValue: number) {
        this.__playRate.set(newValue);
    }
    private __dragging: ObservedPropertySimplePU<boolean>;
    get dragging() {
        return this.__dragging.get();
    }
    set dragging(newValue: boolean) {
        this.__dragging.set(newValue);
    }
    private __dragValue: ObservedPropertySimplePU<number>;
    get dragValue() {
        return this.__dragValue.get();
    }
    set dragValue(newValue: number) {
        this.__dragValue.set(newValue);
    }
    private __isFavorite: ObservedPropertySimplePU<boolean>;
    get isFavorite() {
        return this.__isFavorite.get();
    }
    set isFavorite(newValue: boolean) {
        this.__isFavorite.set(newValue);
    }
    private __lastSongId: ObservedPropertySimplePU<number>;
    get lastSongId() {
        return this.__lastSongId.get();
    }
    set lastSongId(newValue: number) {
        this.__lastSongId.set(newValue);
    }
    private fmt(ms: number): string {
        const sec = Math.floor(ms / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    }
    private clamp(v: number, min: number, max: number): number {
        return Math.max(min, Math.min(v, max));
    }
    async aboutToAppear() {
        // ✅ 进入 PlayerPage：隐藏底部 PlayerBar
        AppStorage.SetOrCreate<boolean>(PLAYERBAR_VISIBLE_KEY, true);
        AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, false);
        await this.refreshFavoriteIfNeeded(true);
        AppStorage.SetOrCreate<number>(PLAYER_SPEED_KEY, 1.0);
    }
    aboutToDisappear() {
        // ✅ 离开 PlayerPage：恢复 PlayerBar
        AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, true);
    }
    async aboutToRender() {
        await this.refreshFavoriteIfNeeded(false);
    }
    private async refreshFavoriteIfNeeded(force: boolean): Promise<void> {
        if (!this.currentSong)
            return;
        const id = this.currentSong.id ?? -1;
        if (!force && id === this.lastSongId)
            return;
        this.lastSongId = id;
        try {
            this.isFavorite = await PreferencesStore.isFavorite(id);
        }
        catch (_) {
            // ignore
        }
    }
    private async onToggleFavorite(): Promise<void> {
        if (!this.currentSong || this.isLoading)
            return;
        await toggleFavorite(this.currentSong);
        await this.refreshFavoriteIfNeeded(true);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.padding({ bottom: 28 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(0xF6F7FB);
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('92%');
            Column.backgroundColor(Color.White);
            Column.borderRadius(22);
            Column.padding({ bottom: 16 });
            Column.shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 });
            Column.alignSelf(ItemAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部
            Row.create();
            // 顶部
            Row.width('100%');
            // 顶部
            Row.padding({ left: 18, right: 18, top: 18 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('正在播放');
            Text.fontSize(14);
            Text.fontColor(0x6B7280);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('播放器');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(0x111827);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中');
                        Text.fontSize(12);
                        Text.fontColor(0x111827);
                        Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                        Text.backgroundColor(0xEEF2FF);
                        Text.borderRadius(999);
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.isPlaying) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('播放中');
                        Text.fontSize(12);
                        Text.fontColor(0x111827);
                        Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                        Text.backgroundColor(0xECFDF5);
                        Text.borderRadius(999);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('已暂停');
                        Text.fontSize(12);
                        Text.fontColor(0x111827);
                        Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                        Text.backgroundColor(0xF3F4F6);
                        Text.borderRadius(999);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // 顶部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.currentSong) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                        Column.padding({ left: 18, right: 18, top: 26, bottom: 18 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无正在播放的歌曲');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(0x111827);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请在“发现”页点击歌曲开始播放');
                        Text.fontSize(13);
                        Text.fontColor(0x6B7280);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.layoutWeight(1);
                    }, Blank);
                    Blank.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 封面 + 信息
                        Column.create({ space: 12 });
                        // 封面 + 信息
                        Column.width('100%');
                        // 封面 + 信息
                        Column.alignItems(HorizontalAlign.Center);
                        // 封面 + 信息
                        Column.padding({ top: 18 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentSong.coverUrl && this.currentSong.coverUrl.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.currentSong.coverUrl);
                                    Image.width(240);
                                    Image.height(240);
                                    Image.borderRadius(20);
                                    Image.objectFit(ImageFit.Cover);
                                    Image.shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Stack.create();
                                }, Stack);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width(240);
                                    Column.height(240);
                                    Column.borderRadius(20);
                                    Column.backgroundColor(0xEEF2FF);
                                    Column.shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 });
                                }, Column);
                                Column.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('No Cover');
                                    Text.fontSize(14);
                                    Text.fontColor(0x6B7280);
                                }, Text);
                                Text.pop();
                                Stack.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('100%');
                        Column.padding({ left: 18, right: 18 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentSong.name);
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(0x111827);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentSong.artistName);
                        Text.fontSize(14);
                        Text.fontColor(0x6B7280);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 封面 + 信息
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 进度条
                        // 进度条
                        Column.create({ space: 8 });
                        // 进度条
                        // 进度条
                        Column.width('100%');
                        // 进度条
                        // 进度条
                        Column.padding({ left: 18, right: 18, top: 18 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({
                            value: this.dragging ? this.dragValue : this.positionMs,
                            min: 0,
                            max: this.durationMs > 0 ? this.durationMs : 1
                        });
                        Slider.height(36);
                        Slider.enabled(this.isSongPlayable && !this.isLoading);
                        Slider.onChange((v: number) => {
                            if (!this.isSongPlayable || this.isLoading)
                                return;
                            // ✅ 拖动过程中只更新 UI，不要频繁 seek
                            this.dragging = true;
                            this.dragValue = v;
                        });
                        Slider.onTouch((e: TouchEvent) => {
                            if (!this.isSongPlayable || this.isLoading)
                                return;
                            if (e.type === TouchType.Down) {
                                this.dragging = true;
                                this.dragValue = this.positionMs;
                            }
                            else if (e.type === TouchType.Up || e.type === TouchType.Cancel) {
                                const max = this.durationMs > 0 ? this.durationMs : this.dragValue;
                                const target = this.clamp(this.dragValue, 0, max);
                                this.dragging = false;
                                // ✅ 松手才真正 seek
                                seekTo(target);
                            }
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fmt(this.dragging ? this.dragValue : this.positionMs));
                        Text.fontSize(12);
                        Text.fontColor(0x6B7280);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.layoutWeight(1);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fmt(this.durationMs));
                        Text.fontSize(12);
                        Text.fontColor(0x6B7280);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 进度条
                    // 进度条
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 上一首 / 播放暂停 / 下一首：统一图片图标按钮 =====
                        Row.create({ space: 14 });
                        // ===== 上一首 / 播放暂停 / 下一首：统一图片图标按钮 =====
                        Row.padding({ left: 18, right: 18, top: 14 });
                    }, Row);
                    // 你可以通过 size 参数重写大小：{ btn: 62, icon: 22 } 等
                    PlayerBtnLeft.bind(this)(!this.isLoading, () => { playPrev(); }, { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, { btn: 62, icon: 22 }, 0xEEF2FF, 23);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isPlaying) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                // 暂停（主按钮）
                                PlayerBtnEnd.bind(this)(this.isSongPlayable && !this.isLoading, () => { togglePlayPause(); }, { "id": 16777241, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, { btn: 70, icon: 24 }, 0x2955FF, 23);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                // 播放（主按钮）
                                PlayerBtnBegin.bind(this)(this.isSongPlayable && !this.isLoading, () => { togglePlayPause(); }, { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, { btn: 70, icon: 24 }, 0x2955FF, 23);
                            });
                        }
                    }, If);
                    If.pop();
                    PlayerBtnRight.bind(this)(!this.isLoading, () => { playNext(); }, { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, { btn: 62, icon: 22 }, 0xEEF2FF, 23);
                    // ===== 上一首 / 播放暂停 / 下一首：统一图片图标按钮 =====
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 倍速选择 =====
                        Column.create({ space: 10 });
                        // ===== 倍速选择 =====
                        Column.padding({ left: 18, right: 18, top: 14 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('倍速');
                        Text.fontSize(13);
                        Text.fontColor(0x6B7280);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.layoutWeight(1);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.playRate}x`);
                        Text.fontSize(13);
                        Text.fontColor(0x111827);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('0.75x');
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await setPlaybackRate(0.75); });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.borderRadius(20);
                        Button.backgroundColor(this.playRate === 0.75 ? 0x2955FF : 0xF3F4F6);
                        Button.fontColor(this.playRate === 0.75 ? Color.White : 0x111827);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('1.0x');
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await setPlaybackRate(1.0); });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.borderRadius(20);
                        Button.backgroundColor(this.playRate === 1.0 ? 0x2955FF : 0xF3F4F6);
                        Button.fontColor(this.playRate === 1.0 ? Color.White : 0x111827);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('1.25x');
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await setPlaybackRate(1.25); });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.borderRadius(20);
                        Button.backgroundColor(this.playRate === 1.25 ? 0x2955FF : 0xF3F4F6);
                        Button.fontColor(this.playRate === 1.25 ? Color.White : 0x111827);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('1.75x');
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await setPlaybackRate(1.75); });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.borderRadius(20);
                        Button.backgroundColor(this.playRate === 1.75 ? 0x2955FF : 0xF3F4F6);
                        Button.fontColor(this.playRate === 1.75 ? Color.White : 0x111827);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('2.0x');
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await setPlaybackRate(2.0); });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.borderRadius(20);
                        Button.backgroundColor(this.playRate === 2.0 ? 0x2955FF : 0xF3F4F6);
                        Button.fontColor(this.playRate === 2.0 ? Color.White : 0x111827);
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // ===== 倍速选择 =====
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 收藏：你如果有两张图标（空心/实心），也可以在这里换成图片按钮
                        Row.create({ space: 12 });
                        // 收藏：你如果有两张图标（空心/实心），也可以在这里换成图片按钮
                        Row.padding({ left: 18, right: 18, top: 14, bottom: 18 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.enabled(!this.isLoading);
                        Button.onClick(async () => { await this.onToggleFavorite(); });
                        Button.layoutWeight(1);
                        Button.height(46);
                        Button.borderRadius(23);
                        Button.backgroundColor(0xEEF2FF);
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 默认示例资源名：ic_heart_outline / ic_heart_filled，你改成你的
                        if (this.isFavorite) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
                                    Image.width(18);
                                    Image.height(18);
                                    Image.objectFit(ImageFit.Contain);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('已收藏');
                                    Text.fontSize(16);
                                    Text.fontWeight(FontWeight.Medium);
                                    Text.fontColor(0x2955FF);
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777242, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
                                    Image.width(18);
                                    Image.height(18);
                                    Image.objectFit(ImageFit.Contain);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('收藏');
                                    Text.fontSize(16);
                                    Text.fontWeight(FontWeight.Medium);
                                    Text.fontColor(0x2955FF);
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                    Button.pop();
                    // 收藏：你如果有两张图标（空心/实心），也可以在这里换成图片按钮
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.layoutWeight(1);
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
