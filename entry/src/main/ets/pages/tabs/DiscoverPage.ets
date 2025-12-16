import { Song, PlaylistBrief, getRecommendPlaylists, getTopPlaylists } from '../../service/ApiService';
import { SearchResultPage, SearchResultPageCallbacks } from '../SearchResultPage';
import { PlaylistPage, PlaylistPageCallbacks } from '../PlaylistPage';
import { playSong } from '../../service/AudioPlayerService';

const MAX_HOME_PLAYLISTS: number = 9;

export interface DiscoverPageCallbacks {
  onGoPlayerTab: () => void;
}

@Component
export struct DiscoverPage {
  // ✅ 不用 callbacks!，给默认值，避免运行时 undefined
  @Prop callbacks: DiscoverPageCallbacks = {
    onGoPlayerTab: () => {}
  };

  @State keyword: string = '';

  @State recommendList: Array<PlaylistBrief> = [];
  @State loadingRecommend: boolean = false;

  @State topList: Array<PlaylistBrief> = [];
  @State loadingTop: boolean = false;

  @State currentView: string = 'home'; // home/search/playlist
  @State searchKeyword: string = '';

  @State currentPlaylistId: number = 0;
  @State currentPlaylistName: string = '';

  aboutToAppear() {
    this.loadRecommend();
    this.loadTopList();
  }

  private async loadRecommend(): Promise<void> {
    this.loadingRecommend = true;
    try {
      const list = await getRecommendPlaylists();
      this.recommendList = list.slice(0, MAX_HOME_PLAYLISTS);
    } catch (e) {
      this.recommendList = [];
    } finally {
      this.loadingRecommend = false;
    }
  }

  private async loadTopList(): Promise<void> {
    this.loadingTop = true;
    try {
      this.topList = await getTopPlaylists(10);
    } catch (e) {
      this.topList = [];
    } finally {
      this.loadingTop = false;
    }
  }

  private openSearch(): void {
    const kw = this.keyword.trim();
    if (!kw) return;
    this.searchKeyword = kw;
    this.currentView = 'search';
  }

  private openPlaylist(item: PlaylistBrief): void {
    this.currentPlaylistId = item.id;
    this.currentPlaylistName = item.name;
    this.currentView = 'playlist';
  }

  private backToHome(): void {
    this.currentView = 'home';
  }

  private async handlePlaySong(song: Song): Promise<void> {
    try {
      await playSong(song);
      // ✅ 增加日志，便于你确认是否执行到这里
      console.info('[DiscoverPage] playSong ok, go player tab');
      // this.callbacks.onGoPlayerTab();
    } catch (e) {
      console.error('[DiscoverPage] playSong error: ' + (e as Error).message);
    }
  }

  private getSearchCallbacks(): SearchResultPageCallbacks {
    return {
      onBack: () => this.backToHome(),
      onPlaySong: (song: Song) => this.handlePlaySong(song)
    };
  }

  private getPlaylistCallbacks(): PlaylistPageCallbacks {
    return {
      onBack: () => this.backToHome(),
      onPlaySong: (song: Song) => this.handlePlaySong(song)
    };
  }

  @Builder
  private buildSearchBar() {
    Row() {
      TextInput({ text: this.keyword, placeholder: '搜索歌曲（使用网易云 API）' })
        .onChange((v: string) => this.keyword = v)
        .onSubmit(() => this.openSearch())
        .height(40)
        .backgroundColor('#F2F2F2')
        .borderRadius(18)
        .padding({ left: 16, right: 16 })
        .layoutWeight(1);

      Text('搜索')
        .fontSize(14)
        .fontColor(0x2955FF)
        .padding({ left: 8 })
        .onClick(() => this.openSearch());
    }
    .padding({ left: 16, right: 16, top: 20 });
  }

  @Builder
  private buildBanner() {
    Swiper() {
      Image($r('app.media.gedan1'))
        .width('100%')
        .height('100%')
        .borderRadius(10)
        .objectFit(ImageFit.Cover);
      Image($r('app.media.gedan2'))
        .width('100%')
        .height('100%')
        .borderRadius(10)
        .objectFit(ImageFit.Cover);
    }
    .height(140)
    .indicator(true)
    .margin({ top: 10 })
    .padding({ left: 16, right: 16 });
  }

  @Builder
  private buildRecommendSection() {
    Column() {
      Row() { Text('推荐歌单').fontSize(18).fontWeight(FontWeight.Bold); }
      .padding({ left: 16, right: 16, top: 16, bottom: 8 });

      if (this.loadingRecommend) {
        Text('加载中...').fontSize(13).fontColor(Color.Grey).padding({ left: 16, top: 4 });
      } else if (this.recommendList.length === 0) {
        Text('暂时没有推荐数据').fontSize(13).fontColor(Color.Grey).padding({ left: 16, top: 4 });
      } else {
        GridRow({ columns: 3 }) {
          ForEach(this.recommendList, (item: PlaylistBrief) => {
            GridCol() {
              Column() {
                if (item.coverUrl && item.coverUrl.length > 0) {
                  Image(item.coverUrl)
                    .width('100%')
                    .aspectRatio(1)
                    .borderRadius(8)
                    .objectFit(ImageFit.Cover);
                } else {
                  Blank()
                    .width('100%')
                    .aspectRatio(1)
                    .backgroundColor('#EEEEEE')
                    .borderRadius(8);
                }
                Text(item.name).fontSize(12).maxLines(2).margin({ top: 4 });
              }
              .onClick(() => this.openPlaylist(item));
            };
          }, (item: PlaylistBrief) => item.id.toString());
        }
        .padding({ left: 16, right: 16, bottom: 16 });
      }
    }
  }

  @Builder
  private buildTopSection() {
    Column() {
      Row() { Text('排行榜').fontSize(18).fontWeight(FontWeight.Bold); }
      .padding({ left: 16, right: 16, top: 8, bottom: 8 });

      if (this.loadingTop) {
        Text('加载中...')
          .fontSize(13)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 4, bottom: 12 });
      } else if (this.topList.length === 0) {
        Text('暂时没有排行榜数据')
          .fontSize(13)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 4, bottom: 12 });
      } else {
        Column() {
          ForEach(this.topList, (item: PlaylistBrief, index?: number) => {
            Row() {
              Text(((index ?? 0) + 1).toString())
                .fontSize(16)
                .fontColor(((index ?? 0) + 1) <= 3 ? 0xFF5252 : 0x888888)
                .width(24);

              Row() {
                if (item.coverUrl && item.coverUrl.length > 0) {
                  Image(item.coverUrl)
                    .width(40)
                    .height(40)
                    .borderRadius(6)
                    .objectFit(ImageFit.Cover);
                } else {
                  Blank()
                    .width(40)
                    .height(40)
                    .backgroundColor('#EEEEEE')
                    .borderRadius(6);
                }

                Text(item.name)
                  .fontSize(14)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                  .padding({ left: 8 })
                  .layoutWeight(1);
              }
              .layoutWeight(1);

              Text('>')
                .fontSize(12)
                .fontColor(Color.Grey)
                .padding({ left: 8 });
            }
            .padding({ left: 16, right: 16, top: 6, bottom: 6 })
            .onClick(() => this.openPlaylist(item));
          }, (item: PlaylistBrief) => 'top-' + item.id.toString());
        }
      }
    }
  }

  @Builder
  private buildHomeRoot() {
    Scroll() {
      Column() {
        this.buildSearchBar();
        this.buildBanner();
        this.buildRecommendSection();
        this.buildTopSection();
      }
      .width('100%');
    }
  }

  build() {
    Column() {
      if (this.currentView === 'home') {
        this.buildHomeRoot();
      } else if (this.currentView === 'search') {
        SearchResultPage({
          keyword: this.searchKeyword,
          callbacks: this.getSearchCallbacks()
        });
      } else if (this.currentView === 'playlist') {
        PlaylistPage({
          playlistId: this.currentPlaylistId,
          playlistName: this.currentPlaylistName,
          callbacks: this.getPlaylistCallbacks()
        });
      }
    }
    .width('100%')
    .height('100%');
  }
}