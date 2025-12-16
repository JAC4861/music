import { searchSongs, Song } from '../service/ApiService';

export interface SearchResultPageCallbacks {
  onBack?: () => void;
  onPlaySong?: (song: Song) => void;
}

@Component
export struct SearchResultPage {
  @Prop keyword: string = '';
  @Prop callbacks?: SearchResultPageCallbacks;

  @State songs: Array<Song> = new Array<Song>();
  @State loading: boolean = false;
  @State lastKeyword: string = '';

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
    } catch (e) {
      console.error('[SearchResultPage] fetchSongs error: ' + (e as Error).message);
      this.songs = [];
    } finally {
      this.loading = false;
    }
  }

  @Builder
  private buildHeader() {
    Row() {
      Text('< 返回')
        .fontSize(16)
        .fontColor(0x2955FF)
        .onClick(() => this.safeBack());

      Text('搜索结果')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .margin({ left: 12 });

      Blank().layoutWeight(1);
    }
    .padding({ left: 16, right: 16, top: 16, bottom: 8 });
  }

  @Builder
  private buildSongRow(song: Song) {
    Row() {
      if (song.coverUrl && song.coverUrl.length > 0) {
        Image(song.coverUrl)
          .width(48)
          .height(48)
          .borderRadius(6)
          .objectFit(ImageFit.Cover);
      } else {
        Blank()
          .width(48)
          .height(48)
          .backgroundColor('#EEEEEE')
          .borderRadius(6);
      }

      Column({ space: 4 }) {
        Text(song.name)
          .fontSize(16)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });

        Text(song.artistName)
          .fontSize(12)
          .fontColor(Color.Grey)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });

        if (!song.url || song.url.length === 0) {
          Text('暂无播放链接')
            .fontSize(10)
            .fontColor(0xFF5252);
        }
      }
      .padding({ left: 10 })
      .layoutWeight(1);

      Text(Math.floor(song.durationSec).toString() + 's')
        .fontSize(12)
        .fontColor(Color.Grey);
    }
    .padding({ left: 16, right: 16, top: 6, bottom: 6 })
    .onClick(() => this.safePlay(song));
  }

  build() {
    Column() {
      this.buildHeader();

      Text('关键字：' + this.keyword)
        .fontSize(12)
        .fontColor(Color.Grey)
        .padding({ left: 16, right: 16, bottom: 8 });

      if (this.loading) {
        Text('正在搜索...')
          .fontSize(14)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 10 });
      } else if (this.songs.length === 0) {
        Column() {
          Text('没有找到相关歌曲')
            .fontSize(14)
            .fontColor(Color.Grey);

          Text('你可以换个关键词试试')
            .fontSize(12)
            .fontColor(Color.Grey)
            .margin({ top: 6 });
        }
        .padding({ left: 16, top: 10 })
        .alignItems(HorizontalAlign.Start);
      } else {
        List() {
          ForEach(this.songs, (item: Song) => {
            ListItem() { this.buildSongRow(item); };
          }, (item: Song) => item.id.toString());
        }
        .width('100%')
        .layoutWeight(1);
      }
    }
    .width('100%')
    .height('100%');
  }
}