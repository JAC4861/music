if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchResultPage_Params {
    keyword?: string;
    callbacks?: SearchResultPageCallbacks;
    songs?: Array<Song>;
    loading?: boolean;
    lastKeyword?: string;
}
import { searchSongs } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
import type { Song } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
export interface SearchResultPageCallbacks {
    onBack?: () => void;
    onPlaySong?: (song: Song) => void;
}
export class SearchResultPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__keyword = new SynchedPropertySimpleOneWayPU(params.keyword, this, "keyword");
        this.__callbacks = new SynchedPropertyObjectOneWayPU(params.callbacks, this, "callbacks");
        this.__songs = new ObservedPropertyObjectPU(new Array<Song>(), this, "songs");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__lastKeyword = new ObservedPropertySimplePU('', this, "lastKeyword");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchResultPage_Params) {
        if (params.keyword === undefined) {
            this.__keyword.set('');
        }
        if (params.songs !== undefined) {
            this.songs = params.songs;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.lastKeyword !== undefined) {
            this.lastKeyword = params.lastKeyword;
        }
    }
    updateStateVars(params: SearchResultPage_Params) {
        this.__keyword.reset(params.keyword);
        this.__callbacks.reset(params.callbacks);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__keyword.purgeDependencyOnElmtId(rmElmtId);
        this.__callbacks.purgeDependencyOnElmtId(rmElmtId);
        this.__songs.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastKeyword.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__keyword.aboutToBeDeleted();
        this.__callbacks.aboutToBeDeleted();
        this.__songs.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__lastKeyword.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __keyword: SynchedPropertySimpleOneWayPU<string>;
    get keyword() {
        return this.__keyword.get();
    }
    set keyword(newValue: string) {
        this.__keyword.set(newValue);
    }
    private __callbacks?: SynchedPropertySimpleOneWayPU<SearchResultPageCallbacks>;
    get callbacks() {
        return this.__callbacks.get();
    }
    set callbacks(newValue: SearchResultPageCallbacks) {
        this.__callbacks.set(newValue);
    }
    private __songs: ObservedPropertyObjectPU<Array<Song>>;
    get songs() {
        return this.__songs.get();
    }
    set songs(newValue: Array<Song>) {
        this.__songs.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __lastKeyword: ObservedPropertySimplePU<string>;
    get lastKeyword() {
        return this.__lastKeyword.get();
    }
    set lastKeyword(newValue: string) {
        this.__lastKeyword.set(newValue);
    }
    private safeBack(): void {
        this.callbacks?.onBack?.();
    }
    private safePlay(song: Song): void {
        if (!song.url || song.url.length === 0) {
            console.warn('[SearchResultPage] song url empty: ' + song.name);
            return;
        }
        this.callbacks?.onPlaySong?.(song);
    }
    aboutToAppear() {
        // ✅ 进入页面时，如果 keyword 变了就重新搜
        const kw = (this.keyword ?? '').trim();
        if (kw.length === 0) {
            this.songs = [];
            this.lastKeyword = '';
            return;
        }
        if (kw !== this.lastKeyword) {
            this.lastKeyword = kw;
            this.fetchSongs(kw);
        }
    }
    private async fetchSongs(kw: string): Promise<void> {
        console.info('[SearchResultPage] fetchSongs start, kw=' + kw);
        this.loading = true;
        try {
            const list: Array<Song> = await searchSongs(kw);
            this.songs = list;
            console.info('[SearchResultPage] fetchSongs success, count=' + list.length);
            console.info('[SearchResultPage] first coverUrl=' + (list.length > 0 ? (list[0].coverUrl ?? '') : 'none'));
        }
        catch (e) {
            console.error('[SearchResultPage] fetchSongs error: ' + (e as Error).message);
            this.songs = [];
        }
        finally {
            this.loading = false;
        }
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
            Text.onClick(() => this.safeBack());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('搜索结果');
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
    private buildSongRow(song: Song, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 6, bottom: 6 });
            Row.onClick(() => this.safePlay(song));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (song.coverUrl && song.coverUrl.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(song.coverUrl);
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
            Text.create(song.name);
            Text.fontSize(16);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(song.artistName);
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!song.url || song.url.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无播放链接');
                        Text.fontSize(10);
                        Text.fontColor(0xFF5252);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Math.floor(song.durationSec).toString() + 's');
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
            Text.create('关键字：' + this.keyword);
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
            Text.padding({ left: 16, right: 16, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在搜索...');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.songs.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.padding({ left: 16, top: 10 });
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('没有找到相关歌曲');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('你可以换个关键词试试');
                        Text.fontSize(12);
                        Text.fontColor(Color.Grey);
                        Text.margin({ top: 6 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
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
                                    this.buildSongRow.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.songs, forEachItemGenFunction, (item: Song) => item.id.toString(), false, false);
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
