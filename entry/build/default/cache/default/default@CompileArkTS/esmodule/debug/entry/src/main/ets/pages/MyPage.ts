if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MyPage_Params {
    callbacks?: MyPageCallbacks;
    profile?: UserProfile;
    nicknameInput?: string;
    signatureInput?: string;
    recentSongs?: Array<StoredSong>;
    favoriteSongs?: Array<StoredSong>;
    loading?: boolean;
}
import { PreferencesStore } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
import type { UserProfile, StoredSong } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
import { playSong } from "@normalized:N&&&entry/src/main/ets/service/AudioPlayerService&";
import type { Song } from '../service/ApiService';
export interface MyPageCallbacks {
    onGoPlayerTab?: () => void;
}
export class MyPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__callbacks = new SynchedPropertyObjectOneWayPU(params.callbacks, this, "callbacks");
        this.__profile = new ObservedPropertyObjectPU({ username: '', nickname: '', signature: '' }, this, "profile");
        this.__nicknameInput = new ObservedPropertySimplePU('', this, "nicknameInput");
        this.__signatureInput = new ObservedPropertySimplePU('', this, "signatureInput");
        this.__recentSongs = new ObservedPropertyObjectPU([], this, "recentSongs");
        this.__favoriteSongs = new ObservedPropertyObjectPU([], this, "favoriteSongs");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MyPage_Params) {
        if (params.callbacks === undefined) {
            this.__callbacks.set({});
        }
        if (params.profile !== undefined) {
            this.profile = params.profile;
        }
        if (params.nicknameInput !== undefined) {
            this.nicknameInput = params.nicknameInput;
        }
        if (params.signatureInput !== undefined) {
            this.signatureInput = params.signatureInput;
        }
        if (params.recentSongs !== undefined) {
            this.recentSongs = params.recentSongs;
        }
        if (params.favoriteSongs !== undefined) {
            this.favoriteSongs = params.favoriteSongs;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
    }
    updateStateVars(params: MyPage_Params) {
        this.__callbacks.reset(params.callbacks);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__callbacks.purgeDependencyOnElmtId(rmElmtId);
        this.__profile.purgeDependencyOnElmtId(rmElmtId);
        this.__nicknameInput.purgeDependencyOnElmtId(rmElmtId);
        this.__signatureInput.purgeDependencyOnElmtId(rmElmtId);
        this.__recentSongs.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteSongs.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__callbacks.aboutToBeDeleted();
        this.__profile.aboutToBeDeleted();
        this.__nicknameInput.aboutToBeDeleted();
        this.__signatureInput.aboutToBeDeleted();
        this.__recentSongs.aboutToBeDeleted();
        this.__favoriteSongs.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __callbacks: SynchedPropertySimpleOneWayPU<MyPageCallbacks>;
    get callbacks() {
        return this.__callbacks.get();
    }
    set callbacks(newValue: MyPageCallbacks) {
        this.__callbacks.set(newValue);
    }
    private __profile: ObservedPropertyObjectPU<UserProfile>;
    get profile() {
        return this.__profile.get();
    }
    set profile(newValue: UserProfile) {
        this.__profile.set(newValue);
    }
    private __nicknameInput: ObservedPropertySimplePU<string>;
    get nicknameInput() {
        return this.__nicknameInput.get();
    }
    set nicknameInput(newValue: string) {
        this.__nicknameInput.set(newValue);
    }
    private __signatureInput: ObservedPropertySimplePU<string>;
    get signatureInput() {
        return this.__signatureInput.get();
    }
    set signatureInput(newValue: string) {
        this.__signatureInput.set(newValue);
    }
    private __recentSongs: ObservedPropertyObjectPU<Array<StoredSong>>;
    get recentSongs() {
        return this.__recentSongs.get();
    }
    set recentSongs(newValue: Array<StoredSong>) {
        this.__recentSongs.set(newValue);
    }
    private __favoriteSongs: ObservedPropertyObjectPU<Array<StoredSong>>;
    get favoriteSongs() {
        return this.__favoriteSongs.get();
    }
    set favoriteSongs(newValue: Array<StoredSong>) {
        this.__favoriteSongs.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    aboutToAppear() {
        this.reloadAll();
    }
    private async reloadAll(): Promise<void> {
        this.loading = true;
        try {
            const p: UserProfile | undefined = await PreferencesStore.loadUserProfile();
            if (p) {
                this.profile = p;
                this.nicknameInput = p.nickname;
                this.signatureInput = p.signature ? p.signature : '';
            }
            this.recentSongs = await PreferencesStore.getRecentSongs();
            this.favoriteSongs = await PreferencesStore.getFavoriteSongs();
            console.info('[MyPage] recent=' + this.recentSongs.length + ', fav=' + this.favoriteSongs.length);
        }
        catch (_) {
            console.error('[MyPage] reloadAll error');
        }
        finally {
            this.loading = false;
        }
    }
    private async saveProfile(): Promise<void> {
        const newProfile: UserProfile = {
            username: this.profile.username,
            nickname: this.nicknameInput.trim().length > 0 ? this.nicknameInput.trim() : this.profile.username,
            signature: this.signatureInput,
            avatar: this.profile.avatar
        };
        await PreferencesStore.saveUserProfile(newProfile);
        this.profile = newProfile;
    }
    private async playStored(item: StoredSong): Promise<void> {
        const song: Song = {
            id: item.id,
            name: item.name,
            artistName: item.artistName,
            coverUrl: item.coverUrl,
            durationSec: item.durationSec ?? 0,
            url: item.url ?? ''
        };
        await playSong(song);
        // 播放后立刻刷新最近播放
        this.recentSongs = await PreferencesStore.getRecentSongs();
    }
    private buildSongRow(item: StoredSong, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor(Color.White);
            Row.borderRadius(12);
            Row.onClick(() => this.playStored(item));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.coverUrl && item.coverUrl.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(item.coverUrl);
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
            Text.create(item.name);
            Text.fontSize(16);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.artistName);
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
            Image.width(22);
            Image.height(22);
        }, Image);
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(0xF6F7FB);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header
            Row.create({ space: 12 });
            // Header
            Row.padding({ left: 16, right: 16, top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
            Image.width(56);
            Image.height(56);
            Image.borderRadius(28);
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.profile.nickname.length > 0 ? this.profile.nickname : (this.profile.username || '未登录'));
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.profile.signature && this.profile.signature.length > 0 ? this.profile.signature : '点击下方可以修改个人签名');
            Text.fontSize(12);
            Text.fontColor(Color.Grey);
        }, Text);
        Text.pop();
        Column.pop();
        // Header
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人信息');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('刷新');
            Text.fontSize(14);
            Text.fontColor(0x2955FF);
            Text.onClick(() => this.reloadAll());
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('修改昵称');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.nicknameInput, placeholder: '请输入昵称' });
            TextInput.onChange((v: string) => this.nicknameInput = v);
            TextInput.height(38);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('修改个性签名');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.signatureInput, placeholder: '这个人很懒，还没有写签名~' });
            TextInput.onChange((v: string) => this.signatureInput = v);
            TextInput.height(40);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存资料');
            Button.width('100%');
            Button.height(40);
            Button.backgroundColor(0x2955FF);
            Button.fontColor(Color.White);
            Button.borderRadius(20);
            Button.onClick(() => this.saveProfile());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ====== 列表区：用 Scroll 包 Column（不嵌 List）=====
            Scroll.create();
            // ====== 列表区：用 Scroll 包 Column（不嵌 List）=====
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 最近播放
            Row.create();
            // 最近播放
            Row.padding({ left: 16, right: 16, top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最近播放');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.recentSongs.length}`);
            Text.fontSize(12);
            Text.fontColor(0x6B7280);
        }, Text);
        Text.pop();
        // 最近播放
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.recentSongs.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, bottom: 6 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.padding({ left: 12, right: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.buildSongRow.bind(this)(item);
                        };
                        this.forEachUpdateFunction(elmtId, this.recentSongs, forEachItemGenFunction, (item: StoredSong) => `recent-${item.id}`, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收藏
            Row.create();
            // 收藏
            Row.padding({ left: 16, right: 16, top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收藏');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.favoriteSongs.length}`);
            Text.fontSize(12);
            Text.fontColor(0x6B7280);
        }, Text);
        Text.pop();
        // 收藏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.favoriteSongs.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.fontSize(13);
                        Text.fontColor(Color.Grey);
                        Text.padding({ left: 16, bottom: 40 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.padding({ left: 12, right: 12, bottom: 120 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.buildSongRow.bind(this)(item);
                        };
                        this.forEachUpdateFunction(elmtId, this.favoriteSongs, forEachItemGenFunction, (item: StoredSong) => `fav-${item.id}`, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        // ====== 列表区：用 Scroll 包 Column（不嵌 List）=====
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
