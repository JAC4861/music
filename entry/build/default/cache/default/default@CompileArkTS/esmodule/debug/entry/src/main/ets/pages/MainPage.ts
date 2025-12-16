if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainPage_Params {
    currentIndex?: number;
}
import { MyPage } from "@normalized:N&&&entry/src/main/ets/pages/MyPage&";
import { PlayerBar } from "@normalized:N&&&entry/src/main/ets/pages/PlayerBar&";
import { PlayerPage } from "@normalized:N&&&entry/src/main/ets/pages/tabs/PlayerPage&";
import { DiscoverPage } from "@normalized:N&&&entry/src/main/ets/pages/tabs/DiscoverPage&";
import type { DiscoverPageCallbacks } from "@normalized:N&&&entry/src/main/ets/pages/tabs/DiscoverPage&";
export class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>; // 0=发现 1=播放 2=我的
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private buildTabItem(index: number, text: string, icon: Resource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.opacity(this.currentIndex === index ? 1.0 : 0.6);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.width(24);
            Image.height(24);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.fontSize(12);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    private getDiscoverCallbacks(): DiscoverPageCallbacks {
        return {
            onGoPlayerTab: () => { this.currentIndex = 1; }
        };
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 1) 内容区：占满剩余空间 =====
            Column.create();
            // ===== 1) 内容区：占满剩余空间 =====
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DiscoverPage(this, { callbacks: this.getDiscoverCallbacks() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 30, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        callbacks: this.getDiscoverCallbacks()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    callbacks: this.getDiscoverCallbacks()
                                });
                            }
                        }, { name: "DiscoverPage" });
                    }
                });
            }
            else if (this.currentIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlayerPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 32, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "PlayerPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MyPage(this, {
                                    callbacks: {
                                        onGoPlayerTab: () => { this.currentIndex = 1; }
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 34, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        callbacks: {
                                            onGoPlayerTab: () => { this.currentIndex = 1; }
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    callbacks: {
                                        onGoPlayerTab: () => { this.currentIndex = 1; }
                                    }
                                });
                            }
                        }, { name: "MyPage" });
                    }
                });
            }
        }, If);
        If.pop();
        // ===== 1) 内容区：占满剩余空间 =====
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // ===== 2) 迷你播放条：固定高度，永远在 TabBar 上方 =====
                    PlayerBar(this, {
                        callbacks: {
                            onOpenPlayerPage: () => { this.currentIndex = 1; }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 44, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            callbacks: {
                                onOpenPlayerPage: () => { this.currentIndex = 1; }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        callbacks: {
                            onOpenPlayerPage: () => { this.currentIndex = 1; }
                        }
                    });
                }
            }, { name: "PlayerBar" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 3) TabBar：固定高度，最底 =====
            Row.create();
            // ===== 3) TabBar：固定高度，最底 =====
            Row.backgroundColor(0xF9F9F9);
            // ===== 3) TabBar：固定高度，最底 =====
            Row.border({ width: { top: 1 }, color: 0xF1F3F5 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.height(56);
            Column.onClick(() => this.currentIndex = 0);
        }, Column);
        this.buildTabItem.bind(this)(0, '发现', { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.height(56);
            Column.onClick(() => this.currentIndex = 1);
        }, Column);
        this.buildTabItem.bind(this)(1, '播放', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.height(56);
            Column.onClick(() => this.currentIndex = 2);
        }, Column);
        this.buildTabItem.bind(this)(2, '我的', { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" });
        Column.pop();
        // ===== 3) TabBar：固定高度，最底 =====
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
