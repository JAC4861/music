// // entry/src/main/ets/pages/HomePage.ets
// import { Song, getRecommendPlaylists, getTopPlaylists, PlaylistBrief } from '../service/ApiService';
// import { SearchResultPage, SearchResultPageCallbacks } from './SearchResultPage';
// import { PlaylistPage, PlaylistPageCallbacks } from './PlaylistPage';
// import { PlayerBar, PlayerBarCallbacks } from './PlayerBar';
// import { PreferencesStore, StoredSong } from '../service/PreferencesStore';
//
// const MAX_HOME_PLAYLISTS: number = 9;
//
// @Component
// export struct HomePage {
//   // 搜索框内容
//   @State keyword: string = '';
//
//   // 推荐歌单数据
//   @State recommendList: Array<PlaylistBrief> = new Array<PlaylistBrief>();
//
//   // 推荐加载中
//   @State loadingRecommend: boolean = false;
//
//   // 排行榜歌单数据
//   @State topList: Array<PlaylistBrief> = new Array<PlaylistBrief>();
//
//   // 排行榜加载中
//   @State loadingTop: boolean = false;
//
//   /**
//    * 当前显示的子页面：
//    *  - 'home'    : 首页（搜索 + 推荐 + 排行榜）
//    *  - 'search'  : 搜索结果页
//    *  - 'playlist': 歌单详情页
//    */
//   @State currentView: string = 'home';
//
//   // 搜索结果页关键字
//   @State searchKeyword: string = '';
//
//   // 歌单详情页参数
//   @State currentPlaylistId: number = 0;
//   @State currentPlaylistName: string = '';
//
//   // 当前正在播放的歌曲 & 播放状态（给 PlayerBar 用）
//   @State currentSong?: Song = undefined;
//   @State isPlaying: boolean = false;
//
//   // ---------------- 生命周期 ----------------
//
//   aboutToAppear() {
//     // 首页出现时加载推荐 + 排行榜
//     this.loadRecommend();
//     this.loadTopList();
//   }
//
//   // ---------------- 数据加载 ----------------
//
//   private async loadRecommend(): Promise<void> {
//     this.loadingRecommend = true;
//     try {
//       const list: Array<PlaylistBrief> = await getRecommendPlaylists();
//
//       // 只取前 MAX_HOME_PLAYLISTS 个
//       this.recommendList = list.slice(0, MAX_HOME_PLAYLISTS);
//
//       console.info('[HomePage] loadRecommend success, total='
//         + list.length + ', show=' + this.recommendList.length);
//     } catch (e) {
//       console.error('[HomePage] loadRecommend error: ' + (e as Error).message);
//       this.recommendList = new Array<PlaylistBrief>();
//     } finally {
//       this.loadingRecommend = false;
//     }
//   }
//
//   private async loadTopList(): Promise<void> {
//     this.loadingTop = true;
//     console.info('[HomePage] loadTopList start');
//     try {
//       const list: Array<PlaylistBrief> = await getTopPlaylists(10);
//       this.topList = list;
//       console.info('[HomePage] loadTopList success, count=' + list.length);
//     } catch (e) {
//       console.error('[HomePage] loadTopList error: ' + (e as Error).message);
//       this.topList = new Array<PlaylistBrief>();
//     } finally {
//       this.loadingTop = false;
//     }
//   }
//
//   /** 触发搜索：切到搜索结果子页面 */
//   private openSearchResult(): void {
//     const kw: string = this.keyword.trim();
//     if (kw.length === 0) {
//       return;
//     }
//     this.searchKeyword = kw;
//     this.currentView = 'search';
//   }
//
//   /** 打开某个歌单详情页 */
//   private openPlaylist(item: PlaylistBrief): void {
//     this.currentPlaylistId = item.id;
//     this.currentPlaylistName = item.name;
//     this.currentView = 'playlist';
//   }
//
//   /** 搜索页 / 歌单页返回首页 */
//   private backToHome(): void {
//     this.currentView = 'home';
//   }
//
//   // ---------------- 播放 / 最近播放 / 收藏 统一处理 ----------------
//
//   /** 所有页面点击歌曲都走这里 */
//   private async handlePlaySong(song: Song): Promise<void> {
//     console.info('[HomePage] handlePlaySong id=' + song.id + ', name=' + song.name);
//
//     // 更新当前播放歌曲和状态
//     this.currentSong = song;
//     this.isPlaying = true;
//
//     // 写入最近播放
//     const stored: StoredSong = {
//       id: song.id,
//       name: song.name,
//       artistName: song.artistName,
//       coverUrl: song.coverUrl,
//       url: song.url
//     };
//
//     try {
//       await PreferencesStore.addRecentSong(stored);
//       console.info('[HomePage] addRecentSong success, id=' + song.id);
//     } catch (e) {
//       console.error('[HomePage] addRecentSong error: ' + (e as Error).message);
//     }
//   }
//
//   /** 播放/暂停切换：目前只是状态位，后面可以在这里接真正播放器 */
//   private handleTogglePlay(): void {
//     if (!this.currentSong) {
//       return;
//     }
//     this.isPlaying = !this.isPlaying;
//     console.info('[HomePage] handleTogglePlay, isPlaying=' + this.isPlaying);
//   }
//
//   /** 收藏/取消收藏 当前歌曲 */
//   private async handleToggleFavorite(): Promise<void> {
//     if (!this.currentSong) {
//       return;
//     }
//     const song: Song = this.currentSong;
//     const stored: StoredSong = {
//       id: song.id,
//       name: song.name,
//       artistName: song.artistName,
//       coverUrl: song.coverUrl,
//       url: song.url
//     };
//
//     try {
//       await PreferencesStore.toggleFavorite(stored);
//       console.info('[HomePage] toggleFavorite success, id=' + song.id);
//     } catch (e) {
//       console.error('[HomePage] toggleFavorite error: ' + (e as Error).message);
//     }
//   }
//
//   // ---------------- 回调对象生成（避免在 UI 树里写 const） ----------------
//
//   private getSearchCallbacks(): SearchResultPageCallbacks {
//     return {
//       onBack: () => {
//         this.backToHome();
//       },
//       onPlaySong: (song: Song) => {
//         this.handlePlaySong(song);
//       }
//     };
//   }
//
//   private getPlaylistCallbacks(): PlaylistPageCallbacks {
//     return {
//       onBack: () => {
//         this.backToHome();
//       }
//       // 以后 PlaylistPage 支持点击歌曲播放时，可以在接口里再加 onPlaySong
//     };
//   }
//
//   private getPlayerBarCallbacks(): PlayerBarCallbacks {
//     return {
//       onTogglePlay: () => {
//         this.handleTogglePlay();
//       },
//       onToggleFavorite: () => {
//         this.handleToggleFavorite();
//       }
//     };
//   }
//
//   // ---------------- UI 结构 ----------------
//
//   @Builder
//   private buildSearchBar() {
//     Row() {
//       TextInput({ text: this.keyword, placeholder: '搜索歌曲（使用网易云 API）' })
//         .onChange((v: string) => {
//           this.keyword = v;
//         })
//         .onSubmit(() => {
//           this.openSearchResult();
//         })
//         .height(40)
//         .backgroundColor('#F2F2F2')
//         .borderRadius(18)
//         .padding({ left: 16, right: 16 })
//         .layoutWeight(1);
//
//       Text('搜索')
//         .fontSize(14)
//         .fontColor(0x2955FF)
//         .padding({ left: 8 })
//         .onClick(() => {
//           this.openSearchResult();
//         });
//     }
//     .padding({ left: 16, right: 16, top: 20 });
//   }
//
//   @Builder
//   private buildBanner() {
//     Swiper() {
//       Image($r('app.media.gedan1'))
//         .width('100%')
//         .height('100%')
//         .borderRadius(10)
//         .objectFit(ImageFit.Cover);
//       Image($r('app.media.gedan2'))
//         .width('100%')
//         .height('100%')
//         .borderRadius(10)
//         .objectFit(ImageFit.Cover);
//     }
//     .height(140)
//     .indicator(true)
//     .margin({ top: 10 })
//     .padding({ left: 16, right: 16 });
//   }
//
//   // 推荐歌单
//   @Builder
//   private buildRecommendSection() {
//     Column() {
//       Row() {
//         Text('推荐歌单')
//           .fontSize(18)
//           .fontWeight(FontWeight.Bold);
//       }
//       .padding({ left: 16, right: 16, top: 16, bottom: 8 });
//
//       if (this.loadingRecommend) {
//         Text('加载中...')
//           .fontSize(13)
//           .fontColor(Color.Grey)
//           .padding({ left: 16, top: 4 });
//       } else if (this.recommendList.length === 0) {
//         Text('暂时没有推荐数据')
//           .fontSize(13)
//           .fontColor(Color.Grey)
//           .padding({ left: 16, top: 4 });
//       } else {
//         GridRow({ columns: 3 }) {
//           ForEach(this.recommendList, (item: PlaylistBrief) => {
//             GridCol() {
//               Column() {
//                 if (item.coverUrl && item.coverUrl.length > 0) {
//                   Image(item.coverUrl)
//                     .width('100%')
//                     .aspectRatio(1)
//                     .borderRadius(8)
//                     .objectFit(ImageFit.Cover);
//                 } else {
//                   Blank()
//                     .width('100%')
//                     .aspectRatio(1)
//                     .backgroundColor('#EEEEEE')
//                     .borderRadius(8);
//                 }
//
//                 Text(item.name)
//                   .fontSize(12)
//                   .maxLines(2)
//                   .margin({ top: 4 });
//               }
//               .onClick(() => {
//                 this.openPlaylist(item);
//               });
//             };
//           }, (item: PlaylistBrief) => item.id.toString());
//         }
//         .padding({ left: 16, right: 16, bottom: 16 });
//       }
//     }
//   }
//
//   // 排行榜区块
//   @Builder
//   private buildTopSection() {
//     Column() {
//       Row() {
//         Text('排行榜')
//           .fontSize(18)
//           .fontWeight(FontWeight.Bold);
//       }
//       .padding({ left: 16, right: 16, top: 8, bottom: 8 });
//
//       if (this.loadingTop) {
//         Text('加载中...')
//           .fontSize(13)
//           .fontColor(Color.Grey)
//           .padding({ left: 16, top: 4, bottom: 12 });
//       } else if (this.topList.length === 0) {
//         Text('暂时没有排行榜数据')
//           .fontSize(13)
//           .fontColor(Color.Grey)
//           .padding({ left: 16, top: 4, bottom: 12 });
//       } else {
//         Column() {
//           ForEach(this.topList, (item: PlaylistBrief, index?: number) => {
//             Row() {
//               // 排名序号
//               Text(((index ?? 0) + 1).toString())
//                 .fontSize(16)
//                 .fontColor(((index ?? 0) + 1) <= 3 ? 0xFF5252 : 0x888888)
//                 .width(24);
//
//               Row() {
//                 if (item.coverUrl && item.coverUrl.length > 0) {
//                   Image(item.coverUrl)
//                     .width(40)
//                     .height(40)
//                     .borderRadius(6)
//                     .objectFit(ImageFit.Cover);
//                 } else {
//                   Blank()
//                     .width(40)
//                     .height(40)
//                     .backgroundColor('#EEEEEE')
//                     .borderRadius(6);
//                 }
//
//                 Text(item.name)
//                   .fontSize(14)
//                   .maxLines(1)
//                   .textOverflow({ overflow: TextOverflow.Ellipsis })
//                   .padding({ left: 8 })
//                   .layoutWeight(1);
//               }
//               .layoutWeight(1);
//
//               Text('>')
//                 .fontSize(12)
//                 .fontColor(Color.Grey)
//                 .padding({ left: 8 });
//             }
//             .padding({ left: 16, right: 16, top: 6, bottom: 6 })
//             .onClick(() => {
//               this.openPlaylist(item);
//             });
//           }, (item: PlaylistBrief) => 'top-' + item.id.toString());
//         }
//       }
//     }
//   }
//
//   @Builder
//   private buildHomeRoot() {
//     Scroll() {
//       Column() {
//         this.buildSearchBar();
//         this.buildBanner();
//         this.buildRecommendSection();
//         this.buildTopSection();
//       }
//       .width('100%');
//     }
//   }
//
//   build() {
//     Column() {
//       if (this.currentView === 'home') {
//         this.buildHomeRoot();
//       } else if (this.currentView === 'search') {
//         SearchResultPage({
//           keyword: this.searchKeyword,
//           callbacks: this.getSearchCallbacks()
//         });
//       } else if (this.currentView === 'playlist') {
//         PlaylistPage({
//           playlistId: this.currentPlaylistId,
//           playlistName: this.currentPlaylistName,
//           callbacks: this.getPlaylistCallbacks()
//         });
//       }
//
//       // // 底部播放器条：有当前歌曲时才显示
//       // if (this.currentSong) {
//       //   PlayerBar({
//       //     song: this.currentSong as Song,
//       //     isPlaying: this.isPlaying,
//       //     callbacks: this.getPlayerBarCallbacks()
//       //   });
//       // }
//     }
//     .width('100%')
//     .height('100%');
//   }
// }
