if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlaylistPage_Params {
    playlistId?: number;
    playlistName?: string;
    callbacks?: PlaylistPageCallbacks | undefined;
    loading?: boolean;
    detail?: PlaylistDetail | undefined;
}
import { getPlaylistDetail } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
import type { PlaylistDetail, PlaylistTrack, Song } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
export interface PlaylistPageCallbacks {
    onBack?: () => void;
    onPlaySong?: (song: Song) => void;
}
export class PlaylistPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__playlistId = new SynchedPropertySimpleOneWayPU(params.playlistId, this, "playlistId");
        this.__playlistName = new SynchedPropertySimpleOneWayPU(params.playlistName, this, "playlistName");
        this.__callbacks = new SynchedPropertyObjectOneWayPU(params.callbacks, this, "callbacks");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__detail = new ObservedPropertyObjectPU(undefined, this, "detail");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlaylistPage_Params) {
        if (params.playlistId === undefined) {
            this.__playlistId.set(0);
        }
        if (params.playlistName === undefined) {
            this.__playlistName.set('');
        }
        if (params.callbacks === undefined) {
            this.__callbacks.set(undefined);
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.detail !== undefined) {
            this.detail = params.detail;
        }
    }
    updateStateVars(params: PlaylistPage_Params) {
        this.__playlistId.reset(params.playlistId);
        this.__playlistName.reset(params.playlistName);
        this.__callbacks.reset(params.callbacks);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__playlistId.purgeDependencyOnElmtId(rmElmtId);
        this.__playlistName.purgeDependencyOnElmtId(rmElmtId);
        this.__callbacks.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__detail.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__playlistId.aboutToBeDeleted();
        this.__playlistName.aboutToBeDeleted();
        this.__callbacks.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__detail.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __playlistId: SynchedPropertySimpleOneWayPU<number>;
    get playlistId() {
        return this.__playlistId.get();
    }
    set playlistId(newValue: number) {
        this.__playlistId.set(newValue);
    }
    private __playlistName: SynchedPropertySimpleOneWayPU<string>;
    get playlistName() {
        return this.__playlistName.get();
    }
    set playlistName(newValue: string) {
        this.__playlistName.set(newValue);
    }
    private __callbacks: SynchedPropertySimpleOneWayPU<PlaylistPageCallbacks | undefined>;
    get callbacks() {
        return this.__callbacks.get();
    }
    set callbacks(newValue: PlaylistPageCallbacks | undefined) {
        this.__callbacks.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __detail: ObservedPropertyObjectPU<PlaylistDetail | undefined>;
    get detail() {
        return this.__detail.get();
    }
    set detail(newValue: PlaylistDetail | undefined) {
        this.__detail.set(newValue);
    }
    aboutToAppear() {
        this.loadDetail();
    }
    private async loadDetail(): Promise<void> {
        if (!this.playlistId)
            return;
        this.loading = true;
        try {
            this.detail = await getPlaylistDetail(this.playlistId);
            const count = this.detail?.tracks?.length ?? 0;
            console.info('[PlaylistPage] loadDetail ok, tracks=' + count);
        }
        catch (e) {
            console.error('[PlaylistPage] getPlaylistDetail error: ' + (e as Error).message);
            this.detail = undefined;
        }
        finally {
            this.loading = false;
        }
    }
    private onTrackClick(track: PlaylistTrack): void {
        const song: Song = {
            id: track.id,
            name: track.name,
            artistName: track.artistName,
            coverUrl: track.coverUrl,
            durationSec: track.durationSec,
            url: track.url
        };
        console.info('[PlaylistPage] onTrackClick id=' + song.id
            + ', hasOnPlaySong=' + (this.callbacks?.onPlaySong ? 'yes' : 'no')
            + ', urlLen=' + (song.url ? song.url.length : 0));
        // ✅ 最稳：可选调用，不存在就啥也不做，不会崩
        this.callbacks?.onPlaySong?.(song);
    }
    private buildHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('< 返回');
            Text.fontSize(16);
            Text.fontColor(0x2955FF);
            Text.onClick(() => {
                console.info('[PlaylistPage] back click, hasOnBack=' + (this.callbacks?.onBack ? 'yes' : 'no'));
                this.callbacks?.onBack?.();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.playlistName || '歌单详情');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    private buildTrackRow(track: PlaylistTrack, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 6, bottom: 6 });
            Row.onClick(() => this.onTrackClick(track));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (track.coverUrl && track.coverUrl.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(track.coverUrl);
                        Image.width(48);
                        Image.height(48);
                        Image.borderRadius(6);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.width(48);
                        Blank.height(48);
                        Blank.backgroundColor('#EEEEEE');
                        Blank.borderRadius(6);
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.padding({ left: 10 });
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(track.name);
            Text.fontSize(16);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(track.artistName);
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Math.floor(track.durationSec).toString() + 's');
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.buildHeader.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (!this.detail) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂时无法获取歌单信息');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.detail.tracks.length === 0) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('歌单中暂时没有歌曲');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.width('100%');
                        List.layoutWeight(1);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.buildTrackRow.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.detail.tracks, forEachItemGenFunction, (item: PlaylistTrack) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
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
