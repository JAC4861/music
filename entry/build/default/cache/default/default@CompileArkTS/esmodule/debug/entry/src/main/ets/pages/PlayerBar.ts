if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlayerBar_Params {
    visible?: boolean;
    durationMs?: number;
    isLoading?: boolean;
    currentSong?: Song | undefined;
    isPlaying?: boolean;
    positionMs?: number;
    callbacks?: PlayerBarCallbacks;
    dragging?: boolean;
    dragValue?: number;
}
import type { Song } from '../service/ApiService';
import { PLAYER_SONG_KEY, PLAYER_PLAYING_KEY, PLAYER_POSITION_MS_KEY, PLAYER_DURATION_MS_KEY, PLAYERBAR_VISIBLE_KEY } from "@normalized:N&&&entry/src/main/ets/service/PlayerState&";
import { seekTo, togglePlayPause, playPrev, playNext, PLAYER_LOADING_KEY } from "@normalized:N&&&entry/src/main/ets/service/AudioPlayerService&";
import { PlayerBtnLeft, PlayerBtnRight, PlayerBtnBegin, PlayerBtnEnd } from "@normalized:N&&&entry/src/main/ets/common/UI&";
export interface PlayerBarCallbacks {
    onOpenPlayerPage?: () => void;
}
export class PlayerBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__visible = this.createStorageLink(PLAYERBAR_VISIBLE_KEY, true, "visible");
        this.__durationMs = this.createStorageLink(PLAYER_DURATION_MS_KEY, 0, "durationMs");
        this.__isLoading = this.createStorageLink(PLAYER_LOADING_KEY, false, "isLoading");
        this.__currentSong = this.createStorageLink(PLAYER_SONG_KEY, undefined, "currentSong");
        this.__isPlaying = this.createStorageLink(PLAYER_PLAYING_KEY, false, "isPlaying");
        this.__positionMs = this.createStorageLink(PLAYER_POSITION_MS_KEY, 0, "positionMs");
        this.__callbacks = new SynchedPropertyObjectOneWayPU(params.callbacks, this, "callbacks");
        this.__dragging = new ObservedPropertySimplePU(false, this, "dragging");
        this.__dragValue = new ObservedPropertySimplePU(0, this, "dragValue");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlayerBar_Params) {
        if (params.callbacks === undefined) {
            this.__callbacks.set({});
        }
        if (params.dragging !== undefined) {
            this.dragging = params.dragging;
        }
        if (params.dragValue !== undefined) {
            this.dragValue = params.dragValue;
        }
    }
    updateStateVars(params: PlayerBar_Params) {
        this.__callbacks.reset(params.callbacks);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__visible.purgeDependencyOnElmtId(rmElmtId);
        this.__durationMs.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__currentSong.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
        this.__positionMs.purgeDependencyOnElmtId(rmElmtId);
        this.__callbacks.purgeDependencyOnElmtId(rmElmtId);
        this.__dragging.purgeDependencyOnElmtId(rmElmtId);
        this.__dragValue.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__visible.aboutToBeDeleted();
        this.__durationMs.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__currentSong.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        this.__positionMs.aboutToBeDeleted();
        this.__callbacks.aboutToBeDeleted();
        this.__dragging.aboutToBeDeleted();
        this.__dragValue.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __visible: ObservedPropertyAbstractPU<boolean>;
    get visible() {
        return this.__visible.get();
    }
    set visible(newValue: boolean) {
        this.__visible.set(newValue);
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
    private __callbacks: SynchedPropertySimpleOneWayPU<PlayerBarCallbacks>;
    get callbacks() {
        return this.__callbacks.get();
    }
    set callbacks(newValue: PlayerBarCallbacks) {
        this.__callbacks.set(newValue);
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
    private clamp(v: number, min: number, max: number): number {
        return Math.max(min, Math.min(v, max));
    }
    private fmt(ms: number): string {
        const sec = Math.floor(ms / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    }
    private hideBar() {
        AppStorage.SetOrCreate<boolean>(PLAYERBAR_VISIBLE_KEY, true);
        AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, false);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.visible && this.currentSong) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('100%');
                        Column.padding({ left: 12, right: 12, bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.padding({ left: 12, right: 12, top: 12, bottom: 10 });
                        Row.backgroundColor(Color.White);
                        Row.borderRadius(18);
                        Row.shadow({ radius: 14, color: 0x22000000, offsetX: 0, offsetY: 6 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 封面
                        if (this.currentSong.coverUrl && this.currentSong.coverUrl.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.currentSong.coverUrl);
                                    Image.width(46);
                                    Image.height(46);
                                    Image.borderRadius(12);
                                    Image.objectFit(ImageFit.Cover);
                                    Image.shadow({ radius: 10, color: 0x18000000, offsetX: 0, offsetY: 4 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Stack.create();
                                    Stack.shadow({ radius: 10, color: 0x18000000, offsetX: 0, offsetY: 4 });
                                }, Stack);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width(46);
                                    Column.height(46);
                                    Column.borderRadius(12);
                                    Column.backgroundColor(0xEEF2FF);
                                }, Column);
                                Column.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('♪');
                                    Text.fontSize(18);
                                    Text.fontColor(0x2955FF);
                                }, Text);
                                Text.pop();
                                Stack.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 信息区：按你需求“点一下就消失”
                        Column.create({ space: 4 });
                        // 信息区：按你需求“点一下就消失”
                        Column.layoutWeight(1);
                        // 信息区：按你需求“点一下就消失”
                        Column.alignItems(HorizontalAlign.Start);
                        // 信息区：按你需求“点一下就消失”
                        Column.onClick(() => {
                            // 点击就隐藏 bar
                            this.hideBar();
                            // 如果你想改成“点击打开 PlayerPage”，用下面这一句替换上面 hideBar：
                            // this.callbacks.onOpenPlayerPage?.();
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentSong.name);
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(0x111827);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentSong.artistName);
                        Text.fontSize(12);
                        Text.fontColor(0x6B7280);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    // 信息区：按你需求“点一下就消失”
                    Column.pop();
                    // 按钮：图标资源版
                    PlayerBtnLeft.bind(this)(this.isPlayable, () => { playPrev(); });
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isPlaying) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                PlayerBtnEnd.bind(this)(this.isPlayable, () => { togglePlayPause(); });
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                PlayerBtnBegin.bind(this)(this.isPlayable, () => { togglePlayPause(); });
                            });
                        }
                    }, If);
                    If.pop();
                    PlayerBtnRight.bind(this)(this.isPlayable, () => { playNext(); });
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 进度条（mini）
                        Slider.create({
                            value: this.dragging ? this.dragValue : this.positionMs,
                            min: 0,
                            max: this.durationMs > 0 ? this.durationMs : 1
                        });
                        // 进度条（mini）
                        Slider.height(28);
                        // 进度条（mini）
                        Slider.enabled(this.isPlayable && !this.isLoading);
                        // 进度条（mini）
                        Slider.onChange((v: number) => {
                            if (!this.isPlayable || this.isLoading)
                                return;
                            this.dragging = true;
                            this.dragValue = v;
                        });
                        // 进度条（mini）
                        Slider.onTouch((e: TouchEvent) => {
                            if (!this.isPlayable || this.isLoading)
                                return;
                            if (e.type === TouchType.Down) {
                                this.dragging = true;
                                this.dragValue = this.positionMs;
                            }
                            else if (e.type === TouchType.Up || e.type === TouchType.Cancel) {
                                const max = this.durationMs > 0 ? this.durationMs : this.dragValue;
                                const target = Math.max(0, Math.min(this.dragValue, max));
                                this.dragging = false;
                                seekTo(target);
                            }
                        });
                    }, Slider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.padding({ left: 6, right: 6 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.fmt(this.dragging ? this.dragValue : this.positionMs));
                        Text.fontSize(11);
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
                        Text.fontSize(11);
                        Text.fontColor(0x6B7280);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(0);
                    }, Column);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
