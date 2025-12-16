// entry/src/main/ets/pages/LoginPage.ets

import { MainPage } from './MainPage';
import { PreferencesStore, UserProfile } from '../service/PreferencesStore';

@Entry
@Component
export struct LoginPage {
  @State username: string = '';
  @State password: string = '';
  @State repeatPassword: string = '';
  @State isLoggedIn: boolean = false;
  @State errorMsg: string = '';
  @State isRegisterMode: boolean = false; // false: 登录；true: 注册

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

  @Builder
  private buildLoginForm() {
    Column({ space: 20 }) {
      Text('网络音乐播放器')
        .fontSize(26)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 80 });

      // 账号
      Column({ space: 6 }) {
        Text('账号')
          .fontSize(14)
          .fontColor(Color.Grey);
        TextInput({ text: this.username, placeholder: '请输入账号' })
          .onChange((value: string) => {
            this.username = value;
          })
          .height(40)
          .backgroundColor(0xF5F5F5)
          .borderRadius(8)
          .padding({ left: 10, right: 10 });
      }
      .width('80%');

      // 密码
      Column({ space: 6 }) {
        Text('密码')
          .fontSize(14)
          .fontColor(Color.Grey);
        TextInput({ text: this.password, placeholder: '请输入密码' })
          .type(InputType.Password)
          .onChange((value: string) => {
            this.password = value;
          })
          .height(40)
          .backgroundColor(0xF5F5F5)
          .borderRadius(8)
          .padding({ left: 10, right: 10 });
      }
      .width('80%');

      // 注册模式下再多一个“确认密码”
      if (this.isRegisterMode) {
        Column({ space: 6 }) {
          Text('确认密码')
            .fontSize(14)
            .fontColor(Color.Grey);
          TextInput({ text: this.repeatPassword, placeholder: '请再次输入密码' })
            .type(InputType.Password)
            .onChange((value: string) => {
              this.repeatPassword = value;
            })
            .height(40)
            .backgroundColor(0xF5F5F5)
            .borderRadius(8)
            .padding({ left: 10, right: 10 });
        }
        .width('80%');
      }

      if (this.errorMsg.length > 0) {
        Text(this.errorMsg)
          .fontSize(13)
          .fontColor(Color.Red)
          .width('80%');
      }

      Button(this.isRegisterMode ? '注册并登录' : '登录')
        .width('80%')
        .height(44)
        .backgroundColor(0x2955FF)
        .fontColor(Color.White)
        .borderRadius(22)
        .onClick(() => {
          if (this.isRegisterMode) {
            this.doRegister();
          } else {
            this.doLogin();
          }
        });

      Button(this.isRegisterMode ? '已有账号？去登录' : '没有账号？去注册')
        .width('80%')
        .height(40)
        .backgroundColor(Color.White)
        .fontColor(0x2955FF)
        .borderRadius(20)
        .border({ width: 1, color: 0x2955FF })
        .onClick(() => {
          this.isRegisterMode = !this.isRegisterMode;
          this.errorMsg = '';
        });

      Blank().layoutWeight(1);
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Start)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White);
  }

  build() {
    Column() {
      if (!this.isLoggedIn) {
        this.buildLoginForm();
      } else {
        MainPage();
      }
    }
    .width('100%')
    .height('100%');
  }
}
