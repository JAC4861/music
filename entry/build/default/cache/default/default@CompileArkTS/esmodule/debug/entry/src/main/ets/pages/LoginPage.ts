if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    repeatPassword?: string;
    isLoggedIn?: boolean;
    errorMsg?: string;
    isRegisterMode?: boolean;
}
import { MainPage } from "@normalized:N&&&entry/src/main/ets/pages/MainPage&";
import { PreferencesStore } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
import type { UserProfile } from "@normalized:N&&&entry/src/main/ets/service/PreferencesStore&";
export class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__repeatPassword = new ObservedPropertySimplePU('', this, "repeatPassword");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__isRegisterMode = new ObservedPropertySimplePU(false, this, "isRegisterMode");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.repeatPassword !== undefined) {
            this.repeatPassword = params.repeatPassword;
        }
        if (params.isLoggedIn !== undefined) {
            this.isLoggedIn = params.isLoggedIn;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.isRegisterMode !== undefined) {
            this.isRegisterMode = params.isRegisterMode;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__repeatPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__isRegisterMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__repeatPassword.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__isRegisterMode.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __repeatPassword: ObservedPropertySimplePU<string>;
    get repeatPassword() {
        return this.__repeatPassword.get();
    }
    set repeatPassword(newValue: string) {
        this.__repeatPassword.set(newValue);
    }
    private __isLoggedIn: ObservedPropertySimplePU<boolean>;
    get isLoggedIn() {
        return this.__isLoggedIn.get();
    }
    set isLoggedIn(newValue: boolean) {
        this.__isLoggedIn.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __isRegisterMode: ObservedPropertySimplePU<boolean>; // false: 登录；true: 注册
    get isRegisterMode() {
        return this.__isRegisterMode.get();
    }
    set isRegisterMode(newValue: boolean) {
        this.__isRegisterMode.set(newValue);
    }
    private validateInput(): boolean {
        if (this.username.trim().length === 0 || this.password.trim().length === 0) {
            this.errorMsg = '账号和密码不能为空';
            return false;
        }
        if (this.isRegisterMode && this.password !== this.repeatPassword) {
            this.errorMsg = '两次输入的密码不一致';
            return false;
        }
        this.errorMsg = '';
        return true;
    }
    private async doRegister(): Promise<void> {
        if (!this.validateInput()) {
            return;
        }
        // 简单起见：一个设备只保存一套账号
        await PreferencesStore.saveCredentials(this.username, this.password);
        const profile: UserProfile = {
            username: this.username.trim(),
            nickname: this.username.trim(),
            signature: '这个人很懒，还没有写签名~'
        };
        await PreferencesStore.saveUserProfile(profile);
        this.isLoggedIn = true;
    }
    private async doLogin(): Promise<void> {
        if (!this.validateInput()) {
            return;
        }
        const ok: boolean = await PreferencesStore.checkCredentials(this.username, this.password);
        if (!ok) {
            this.errorMsg = '账号或密码错误，请先注册或重新输入';
            return;
        }
        this.errorMsg = '';
        this.isLoggedIn = true;
    }
    private async initFromStorage(): Promise<void> {
        const hasCred: boolean = await PreferencesStore.hasCredentials();
        if (hasCred) {
            const profile: UserProfile | undefined = await PreferencesStore.loadUserProfile();
            if (profile) {
                this.username = profile.username;
            }
        }
    }
    aboutToAppear() {
        // 启动时，如果本地已有账号，就把用户名带出来
        this.initFromStorage();
    }
    private buildLoginForm(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('网络音乐播放器');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 80 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 账号
            Column.create({ space: 6 });
            // 账号
            Column.width('80%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号');
            Text.fontSize(14);
            Text.fontColor(Color.Grey);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.username, placeholder: '请输入账号' });
            TextInput.onChange((value: string) => {
                this.username = value;
            });
            TextInput.height(40);
            TextInput.backgroundColor(0xF5F5F5);
            TextInput.borderRadius(8);
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        // 账号
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码
            Column.create({ space: 6 });
            // 密码
            Column.width('80%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.fontSize(14);
            Text.fontColor(Color.Grey);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.password, placeholder: '请输入密码' });
            TextInput.type(InputType.Password);
            TextInput.onChange((value: string) => {
                this.password = value;
            });
            TextInput.height(40);
            TextInput.backgroundColor(0xF5F5F5);
            TextInput.borderRadius(8);
            TextInput.padding({ left: 10, right: 10 });
        }, TextInput);
        // 密码
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 注册模式下再多一个“确认密码”
            if (this.isRegisterMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.width('80%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认密码');
                        Text.fontSize(14);
                        Text.fontColor(Color.Grey);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.repeatPassword, placeholder: '请再次输入密码' });
                        TextInput.type(InputType.Password);
                        TextInput.onChange((value: string) => {
                            this.repeatPassword = value;
                        });
                        TextInput.height(40);
                        TextInput.backgroundColor(0xF5F5F5);
                        TextInput.borderRadius(8);
                        TextInput.padding({ left: 10, right: 10 });
                    }, TextInput);
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontSize(13);
                        Text.fontColor(Color.Red);
                        Text.width('80%');
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isRegisterMode ? '注册并登录' : '登录');
            Button.width('80%');
            Button.height(44);
            Button.backgroundColor(0x2955FF);
            Button.fontColor(Color.White);
            Button.borderRadius(22);
            Button.onClick(() => {
                if (this.isRegisterMode) {
                    this.doRegister();
                }
                else {
                    this.doLogin();
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isRegisterMode ? '已有账号？去登录' : '没有账号？去注册');
            Button.width('80%');
            Button.height(40);
            Button.backgroundColor(Color.White);
            Button.fontColor(0x2955FF);
            Button.borderRadius(20);
            Button.border({ width: 1, color: 0x2955FF });
            Button.onClick(() => {
                this.isRegisterMode = !this.isRegisterMode;
                this.errorMsg = '';
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isLoggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildLoginForm.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MainPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/LoginPage.ets", line: 181, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "MainPage" });
                    }
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.example.music_classs", moduleName: "entry", pagePath: "pages/LoginPage", pageFullPath: "entry/src/main/ets/pages/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
