import { MyPage } from './MyPage';
import { PlayerBar } from './PlayerBar';
import { PlayerPage } from './tabs/PlayerPage';
import { DiscoverPage, DiscoverPageCallbacks } from './tabs/DiscoverPage';

@Component
export struct MainPage {
  @State currentIndex: number = 0; // 0=发现 1=播放 2=我的

  @Builder
  private buildTabItem(index: number, text: string, icon: Resource) {
    Column() {
      Image(icon).width(24).height(24);
      Text(text).fontSize(12).margin({ top: 2 });
    }
    .opacity(this.currentIndex === index ? 1.0 : 0.6);
  }

  private getDiscoverCallbacks(): DiscoverPageCallbacks {
    return {
      onGoPlayerTab: () => { this.currentIndex = 1; }
    };
  }

  build() {
    Column() {
      // ===== 1) 内容区：占满剩余空间 =====
      Column() {
        if (this.currentIndex === 0) {
          DiscoverPage({ callbacks: this.getDiscoverCallbacks() });
        } else if (this.currentIndex === 1) {
          PlayerPage();
        } else {
          MyPage({
            callbacks: {
              onGoPlayerTab: () => { this.currentIndex = 1; }
            }
          });
        }
      }
      .layoutWeight(1);

      // ===== 2) 迷你播放条：固定高度，永远在 TabBar 上方 =====
      PlayerBar({
        callbacks: {
          onOpenPlayerPage: () => { this.currentIndex = 1; }
        }
      });

      // ===== 3) TabBar：固定高度，最底 =====
      Row() {
        Column() { this.buildTabItem(0, '发现', $r('app.media.shouye')); }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .height(56)
        .onClick(() => this.currentIndex = 0);

        Column() { this.buildTabItem(1, '播放', $r('app.media.bofang')); }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .height(56)
        .onClick(() => this.currentIndex = 1);

        Column() { this.buildTabItem(2, '我的', $r('app.media.my')); }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .height(56)
        .onClick(() => this.currentIndex = 2);
      }
      .backgroundColor(0xF9F9F9)
      .border({ width: { top: 1 }, color: 0xF1F3F5 });
    }
    .width('100%')
    .height('100%');
  }
}