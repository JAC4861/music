if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    keyword?: string;
    recommendList?: Array<PlaylistBrief>;
    loadingRecommend?: boolean;
    topList?: Array<PlaylistBrief>;
    loadingTop?: boolean;
    currentView?: string;
    searchKeyword?: string;
    currentPlaylistId?: number;
    currentPlaylistName?: string;
    currentSong?: Song;
    isPlaying?: boolean;
}
import { getRecommendPlaylists, getTopPlaylists } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
import type { Song, PlaylistBrief } from "@normalized:N&&&entry/src/main/ets/service/ApiService&";
import { SearchResultPage } from "@normalized:N&&&entry/src/main/ets/pages/SearchResultPage&";
import type { SearchResultPageCallbacks } from "@normalized:N&&&entry/src/main/ets/pages/SearchResultPage&";
import { PlaylistPage } from "@normalized:N&&&entry/src/main/ets/pages/PlaylistPage&";
import type { PlaylistPageCallbacks } from "@normalized:N&&&entry/src/main/ets/pages/PlaylistPage&";
import { PlayerBar } from "@normalized:N&&&entry/src/main/ets/pages/PlayerBar&";
import type { PlayerBarCallbacks } from "@normalized:N&&&entry/src/main/ets/pages/PlayerBar&";
import { PreferencesStore } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
import type { StoredSong } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
const MAX_HOME_PLAYLISTS: number = 9;
export class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__keyword = new ObservedPropertySimplePU('', this, "keyword");
        this.__recommendList = new ObservedPropertyObjectPU(new Array<PlaylistBrief>(), this, "recommendList");
        this.__loadingRecommend = new ObservedPropertySimplePU(false, this, "loadingRecommend");
        this.__topList = new ObservedPropertyObjectPU(new Array<PlaylistBrief>(), this, "topList");
        this.__loadingTop = new ObservedPropertySimplePU(false, this, "loadingTop");
        this.__currentView = new ObservedPropertySimplePU('home', this, "currentView");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__currentPlaylistId = new ObservedPropertySimplePU(0, this, "currentPlaylistId");
        this.__currentPlaylistName = new ObservedPropertySimplePU('', this, "currentPlaylistName");
        this.__currentSong = new ObservedPropertyObjectPU(undefined, this, "currentSong");
        this.__isPlaying = new ObservedPropertySimplePU(false, this, "isPlaying");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.keyword !== undefined) {
            this.keyword = params.keyword;
        }
        if (params.recommendList !== undefined) {
            this.recommendList = params.recommendList;
        }
        if (params.loadingRecommend !== undefined) {
            this.loadingRecommend = params.loadingRecommend;
        }
        if (params.topList !== undefined) {
            this.topList = params.topList;
        }
        if (params.loadingTop !== undefined) {
            this.loadingTop = params.loadingTop;
        }
        if (params.currentView !== undefined) {
            this.currentView = params.currentView;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.currentPlaylistId !== undefined) {
            this.currentPlaylistId = params.currentPlaylistId;
        }
        if (params.currentPlaylistName !== undefined) {
            this.currentPlaylistName = params.currentPlaylistName;
        }
        if (params.currentSong !== undefined) {
            this.currentSong = params.currentSong;
        }
        if (params.isPlaying !== undefined) {
            this.isPlaying = params.isPlaying;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__keyword.purgeDependencyOnElmtId(rmElmtId);
        this.__recommendList.purgeDependencyOnElmtId(rmElmtId);
        this.__loadingRecommend.purgeDependencyOnElmtId(rmElmtId);
        this.__topList.purgeDependencyOnElmtId(rmElmtId);
        this.__loadingTop.purgeDependencyOnElmtId(rmElmtId);
        this.__currentView.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPlaylistId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPlaylistName.purgeDependencyOnElmtId(rmElmtId);
        this.__currentSong.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__keyword.aboutToBeDeleted();
        this.__recommendList.aboutToBeDeleted();
        this.__loadingRecommend.aboutToBeDeleted();
        this.__topList.aboutToBeDeleted();
        this.__loadingTop.aboutToBeDeleted();
        this.__currentView.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__currentPlaylistId.aboutToBeDeleted();
        this.__currentPlaylistName.aboutToBeDeleted();
        this.__currentSong.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 搜索框内容
    private __keyword: ObservedPropertySimplePU<string>;
    get keyword() {
        return this.__keyword.get();
    }
    set keyword(newValue: string) {
        this.__keyword.set(newValue);
    }
    // 推荐歌单数据
    private __recommendList: ObservedPropertyObjectPU<Array<PlaylistBrief>>;
    get recommendList() {
        return this.__recommendList.get();
    }
    set recommendList(newValue: Array<PlaylistBrief>) {
        this.__recommendList.set(newValue);
    }
    // 推荐加载中
    private __loadingRecommend: ObservedPropertySimplePU<boolean>;
    get loadingRecommend() {
        return this.__loadingRecommend.get();
    }
    set loadingRecommend(newValue: boolean) {
        this.__loadingRecommend.set(newValue);
    }
    // 排行榜歌单数据
    private __topList: ObservedPropertyObjectPU<Array<PlaylistBrief>>;
    get topList() {
        return this.__topList.get();
    }
    set topList(newValue: Array<PlaylistBrief>) {
        this.__topList.set(newValue);
    }
    // 排行榜加载中
    private __loadingTop: ObservedPropertySimplePU<boolean>;
    get loadingTop() {
        return this.__loadingTop.get();
    }
    set loadingTop(newValue: boolean) {
        this.__loadingTop.set(newValue);
    }
    /**
     * 当前显示的子页面：
     *  - 'home'    : 首页（搜索 + 推荐 + 排行榜）
     *  - 'search'  : 搜索结果页
     *  - 'playlist': 歌单详情页
     */
    private __currentView: ObservedPropertySimplePU<string>;
    get currentView() {
        return this.__currentView.get();
    }
    set currentView(newValue: string) {
        this.__currentView.set(newValue);
    }
    // 搜索结果页关键字
    private __searchKeyword: ObservedPropertySimplePU<string>;
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    // 歌单详情页参数
    private __currentPlaylistId: ObservedPropertySimplePU<number>;
    get currentPlaylistId() {
        return this.__currentPlaylistId.get();
    }
    set currentPlaylistId(newValue: number) {
        this.__currentPlaylistId.set(newValue);
    }
    private __currentPlaylistName: ObservedPropertySimplePU<string>;
    get currentPlaylistName() {
        return this.__currentPlaylistName.get();
    }
    set currentPlaylistName(newValue: string) {
        this.__currentPlaylistName.set(newValue);
    }
    // 当前正在播放的歌曲 & 播放状态（给 PlayerBar 用）
    private __currentSong?: ObservedPropertyObjectPU<Song>;
    get currentSong() {
        return this.__currentSong.get();
    }
    set currentSong(newValue: Song) {
        this.__currentSong.set(newValue);
    }
    private __isPlaying: ObservedPropertySimplePU<boolean>;
    get isPlaying() {
        return this.__isPlaying.get();
    }
    set isPlaying(newValue: boolean) {
        this.__isPlaying.set(newValue);
    }
    // ---------------- 生命周期 ----------------
    aboutToAppear() {
        // 首页出现时加载推荐 + 排行榜
        this.loadRecommend();
        this.loadTopList();
    }
    // ---------------- 数据加载 ----------------
    private async loadRecommend(): Promise<void> {
        this.loadingRecommend = true;
        try {
            const list: Array<PlaylistBrief> = await getRecommendPlaylists();
            // 只取前 MAX_HOME_PLAYLISTS 个
            this.recommendList = list.slice(0, MAX_HOME_PLAYLISTS);
            console.info('[HomePage] loadRecommend success, total='
                + list.length + ', show=' + this.recommendList.length);
        }
        catch (e) {
            console.error('[HomePage] loadRecommend error: ' + (e as Error).message);
            this.recommendList = new Array<PlaylistBrief>();
        }
        finally {
            this.loadingRecommend = false;
        }
    }
    private async loadTopList(): Promise<void> {
        this.loadingTop = true;
        console.info('[HomePage] loadTopList start');
        try {
            const list: Array<PlaylistBrief> = await getTopPlaylists(10);
            this.topList = list;
            console.info('[HomePage] loadTopList success, count=' + list.length);
        }
        catch (e) {
            console.error('[HomePage] loadTopList error: ' + (e as Error).message);
            this.topList = new Array<PlaylistBrief>();
        }
        finally {
            this.loadingTop = false;
        }
    }
    /** 触发搜索：切到搜索结果子页面 */
    private openSearchResult(): void {
        const kw: string = this.keyword.trim();
        if (kw.length === 0) {
            return;
        }
        this.searchKeyword = kw;
        this.currentView = 'search';
    }
    /** 打开某个歌单详情页 */
    private openPlaylist(item: PlaylistBrief): void {
        this.currentPlaylistId = item.id;
        this.currentPlaylistName = item.name;
        this.currentView = 'playlist';
    }
    /** 搜索页 / 歌单页返回首页 */
    private backToHome(): void {
        this.currentView = 'home';
    }
    // ---------------- 播放 / 最近播放 / 收藏 统一处理 ----------------
    /** 所有页面点击歌曲都走这里 */
    private async handlePlaySong(song: Song): Promise<void> {
        console.info('[HomePage] handlePlaySong id=' + song.id + ', name=' + song.name);
        // 更新当前播放歌曲和状态
        this.currentSong = song;
        this.isPlaying = true;
        // 写入最近播放
        const stored: StoredSong = {
            id: song.id,
            name: song.name,
            artistName: song.artistName,
            coverUrl: song.coverUrl,
            url: song.url
        };
        try {
            await PreferencesStore.addRecentSong(stored);
            console.info('[HomePage] addRecentSong success, id=' + song.id);
        }
        catch (e) {
            console.error('[HomePage] addRecentSong error: ' + (e as Error).message);
        }
    }
    /** 播放/暂停切换：目前只是状态位，后面可以在这里接真正播放器 */
    private handleTogglePlay(): void {
        if (!this.currentSong) {
            return;
        }
        this.isPlaying = !this.isPlaying;
        console.info('[HomePage] handleTogglePlay, isPlaying=' + this.isPlaying);
    }
    /** 收藏/取消收藏 当前歌曲 */
    private async handleToggleFavorite(): Promise<void> {
        if (!this.currentSong) {
            return;
        }
        const song: Song = this.currentSong;
        const stored: StoredSong = {
            id: song.id,
            name: song.name,
            artistName: song.artistName,
            coverUrl: song.coverUrl,
            url: song.url
        };
        try {
            await PreferencesStore.toggleFavorite(stored);
            console.info('[HomePage] toggleFavorite success, id=' + song.id);
        }
        catch (e) {
            console.error('[HomePage] toggleFavorite error: ' + (e as Error).message);
        }
    }
    // ---------------- 回调对象生成（避免在 UI 树里写 const） ----------------
    private getSearchCallbacks(): SearchResultPageCallbacks {
        return {
            onBack: () => {
                this.backToHome();
            },
            onPlaySong: (song: Song) => {
                this.handlePlaySong(song);
            }
        };
    }
    private getPlaylistCallbacks(): PlaylistPageCallbacks {
        return {
            onBack: () => {
                this.backToHome();
            }
            // 以后 PlaylistPage 支持点击歌曲播放时，可以在接口里再加 onPlaySong
        };
    }
    private getPlayerBarCallbacks(): PlayerBarCallbacks {
        return {
            onTogglePlay: () => {
                this.handleTogglePlay();
            },
            onToggleFavorite: () => {
                this.handleToggleFavorite();
            }
        };
    }
    // ---------------- UI 结构 ----------------
    private buildSearchBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.keyword, placeholder: '搜索歌曲（使用网易云 API）' });
            TextInput.onChange((v: string) => {
                this.keyword = v;
            });
            TextInput.onSubmit(() => {
                this.openSearchResult();
            });
            TextInput.height(40);
            TextInput.backgroundColor('#F2F2F2');
            TextInput.borderRadius(18);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.layoutWeight(1);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('搜索');
            Text.fontSize(14);
            Text.fontColor(0x2955FF);
            Text.padding({ left: 8 });
            Text.onClick(() => {
                this.openSearchResult();
            });
        }, Text);
        Text.pop();
        Row.pop();
    }
    private buildBanner(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Swiper.create();
            Swiper.height(140);
            Swiper.indicator(true);
            Swiper.margin({ top: 10 });
            Swiper.padding({ left: 16, right: 16 });
        }, Swiper);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
            Image.borderRadius(10);
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
            Image.borderRadius(10);
            Image.objectFit(ImageFit.Cover);
        }, Image);
        Swiper.pop();
    }
    // 推荐歌单
    private buildRecommendSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('推荐歌单');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loadingRecommend) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.recommendList.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂时没有推荐数据');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        GridRow.create({ columns: 3 });
                        GridRow.padding({ left: 16, right: 16, bottom: 16 });
                    }, GridRow);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                GridCol.create();
                            }, GridCol);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.onClick(() => {
                                    this.openPlaylist(item);
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (item.coverUrl && item.coverUrl.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Image.create(item.coverUrl);
                                            Image.width('100%');
                                            Image.aspectRatio(1);
                                            Image.borderRadius(8);
                                            Image.objectFit(ImageFit.Cover);
                                        }, Image);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                            Blank.width('100%');
                                            Blank.aspectRatio(1);
                                            Blank.backgroundColor('#EEEEEE');
                                            Blank.borderRadius(8);
                                        }, Blank);
                                        Blank.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.name);
                                Text.fontSize(12);
                                Text.maxLines(2);
                                Text.margin({ top: 4 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            GridCol.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.recommendList, forEachItemGenFunction, (item: PlaylistBrief) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    GridRow.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 排行榜区块
    private buildTopSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('排行榜');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loadingTop) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 4, bottom: 12 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.topList.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂时没有排行榜数据');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, top: 4, bottom: 12 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index?: number) => {
                            const item = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.padding({ left: 16, right: 16, top: 6, bottom: 6 });
                                Row.onClick(() => {
                                    this.openPlaylist(item);
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 排名序号
                                Text.create(((index ?? 0) + 1).toString());
                                // 排名序号
                                Text.fontSize(16);
                                // 排名序号
                                Text.fontColor(((index ?? 0) + 1) <= 3 ? 0xFF5252 : 0x888888);
                                // 排名序号
                                Text.width(24);
                            }, Text);
                            // 排名序号
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.layoutWeight(1);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (item.coverUrl && item.coverUrl.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Image.create(item.coverUrl);
                                            Image.width(40);
                                            Image.height(40);
                                            Image.borderRadius(6);
                                            Image.objectFit(ImageFit.Cover);
                                        }, Image);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                            Blank.width(40);
                                            Blank.height(40);
                                            Blank.backgroundColor('#EEEEEE');
                                            Blank.borderRadius(6);
                                        }, Blank);
                                        Blank.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(item.name);
                                Text.fontSize(14);
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                Text.padding({ left: 8 });
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('>');
                                Text.fontSize(12);
                                Text.fontColor(Color.Grey);
                                Text.padding({ left: 8 });
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.topList, forEachItemGenFunction, (item: PlaylistBrief) => 'top-' + item.id.toString(), true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private buildHomeRoot(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.buildSearchBar.bind(this)();
        this.buildBanner.bind(this)();
        this.buildRecommendSection.bind(this)();
        this.buildTopSection.bind(this)();
        Column.pop();
        Scroll.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentView === 'home') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildHomeRoot.bind(this)();
                });
            }
            else if (this.currentView === 'search') {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new SearchResultPage(this, {
                                    keyword: this.searchKeyword,
                                    callbacks: this.getSearchCallbacks()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 395, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        keyword: this.searchKeyword,
                                        callbacks: this.getSearchCallbacks()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    keyword: this.searchKeyword,
                                    callbacks: this.getSearchCallbacks()
                                });
                            }
                        }, { name: "SearchResultPage" });
                    }
                });
            }
            else if (this.currentView === 'playlist') {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlaylistPage(this, {
                                    playlistId: this.currentPlaylistId,
                                    playlistName: this.currentPlaylistName,
                                    callbacks: this.getPlaylistCallbacks()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 400, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        playlistId: this.currentPlaylistId,
                                        playlistName: this.currentPlaylistName,
                                        callbacks: this.getPlaylistCallbacks()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    playlistId: this.currentPlaylistId,
                                    playlistName: this.currentPlaylistName,
                                    callbacks: this.getPlaylistCallbacks()
                                });
                            }
                        }, { name: "PlaylistPage" });
                    }
                });
            }
            // 底部播放器条：有当前歌曲时才显示
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 底部播放器条：有当前歌曲时才显示
            if (this.currentSong) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlayerBar(this, {
                                    song: this.currentSong as Song,
                                    isPlaying: this.isPlaying,
                                    callbacks: this.getPlayerBarCallbacks()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 409, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        song: this.currentSong as Song,
                                        isPlaying: this.isPlaying,
                                        callbacks: this.getPlayerBarCallbacks()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    song: this.currentSong as Song,
                                    isPlaying: this.isPlaying,
                                    callbacks: this.getPlayerBarCallbacks()
                                });
                            }
                        }, { name: "PlayerBar" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
