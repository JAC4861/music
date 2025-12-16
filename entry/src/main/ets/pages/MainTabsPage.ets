import { initPlayerStateIfNeeded } from '../service/PlayerState';
import { DiscoverPage, DiscoverPageCallbacks } from './tabs/DiscoverPage';
import { PlayerPage } from './tabs/PlayerPage';
import { MyPage } from './MyPage';
import { PlayerBar, PlayerBarCallbacks } from './PlayerBar';

@Component
export struct MainTabsPage {
  @State currentTab: number = 0; // 0发现 1播放 2我的

  aboutToAppear() {
    initPlayerStateIfNeeded();
  }

  private getDiscoverCallbacks(): DiscoverPageCallbacks {
    return {
      onGoPlayerTab: () => {
        this.currentTab = 1;
      }
    };
  }

  private getPlayerBarCallbacks(): PlayerBarCallbacks {
    return {
      onOpenPlayerPage: () => {
        this.currentTab = 1;
      }
    };
  }

  build() {
    Column() {
      Tabs({ index: this.currentTab }) {
        TabContent() {
          DiscoverPage({ callbacks: this.getDiscoverCallbacks() })
        }.tabBar('发现')

        TabContent() {
          PlayerPage()
        }.tabBar('播放')

        TabContent() {
          MyPage()
        }.tabBar('我的')
      }
      .barPosition(BarPosition.End)
      .onChange((i: number) => this.currentTab = i)
      .layoutWeight(1);

      // 全局迷你播放器条
      PlayerBar({ callbacks: this.getPlayerBarCallbacks() });
    }
    .width('100%')
    .height('100%');
  }
}