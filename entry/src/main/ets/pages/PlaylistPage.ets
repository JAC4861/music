import { getPlaylistDetail, PlaylistDetail, PlaylistTrack, Song } from '../service/ApiService';

export interface PlaylistPageCallbacks {
  onBack?: () => void;
  onPlaySong?: (song: Song) => void;
}

@Component
export struct PlaylistPage {
  @Prop playlistId: number = 0;
  @Prop playlistName: string = '';
  @Prop callbacks: PlaylistPageCallbacks | undefined = undefined;

  @State loading: boolean = false;
  @State detail: PlaylistDetail | undefined = undefined;

  aboutToAppear() {
    this.loadDetail();
  }

  private async loadDetail(): Promise<void> {
    if (!this.playlistId) return;
    this.loading = true;
    try {
      this.detail = await getPlaylistDetail(this.playlistId);
      const count = this.detail?.tracks?.length ?? 0;
      console.info('[PlaylistPage] loadDetail ok, tracks=' + count);
    } catch (e) {
      console.error('[PlaylistPage] getPlaylistDetail error: ' + (e as Error).message);
      this.detail = undefined;
    } finally {
      this.loading = false;
    }
  }

  private onTrackClick(track: PlaylistTrack): void {
    const song: Song = {
      id: track.id,
      name: track.name,
      artistName: track.artistName,
      coverUrl: track.coverUrl,
      durationSec: track.durationSec,
      url: track.url
    };

    console.info('[PlaylistPage] onTrackClick id=' + song.id
      + ', hasOnPlaySong=' + (this.callbacks?.onPlaySong ? 'yes' : 'no')
      + ', urlLen=' + (song.url ? song.url.length : 0));

    // ✅ 最稳：可选调用，不存在就啥也不做，不会崩
    this.callbacks?.onPlaySong?.(song);
  }

  @Builder
  private buildHeader() {
    Row() {
      Text('< 返回')
        .fontSize(16)
        .fontColor(0x2955FF)
        .onClick(() => {
          console.info('[PlaylistPage] back click, hasOnBack=' + (this.callbacks?.onBack ? 'yes' : 'no'));
          this.callbacks?.onBack?.();
        });

      Text(this.playlistName || '歌单详情')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .margin({ left: 12 });

      Blank().layoutWeight(1);
    }
    .padding({ left: 16, right: 16, top: 16, bottom: 8 });
  }

  @Builder
  private buildTrackRow(track: PlaylistTrack) {
    Row() {
      if (track.coverUrl && track.coverUrl.length > 0) {
        Image(track.coverUrl)
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
        Text(track.name)
          .fontSize(16)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });

        Text(track.artistName)
          .fontSize(12)
          .fontColor(Color.Grey)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });
      }
      .padding({ left: 10 })
      .layoutWeight(1);

      Text(Math.floor(track.durationSec).toString() + 's')
        .fontSize(12)
        .fontColor(Color.Grey);
    }
    .padding({ left: 16, right: 16, top: 6, bottom: 6 })
    .onClick(() => this.onTrackClick(track));
  }

  build() {
    Column() {
      this.buildHeader();

      if (this.loading) {
        Text('加载中...')
          .fontSize(14)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 10 });
      } else if (!this.detail) {
        Text('暂时无法获取歌单信息')
          .fontSize(14)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 10 });
      } else if (this.detail.tracks.length === 0) {
        Text('歌单中暂时没有歌曲')
          .fontSize(14)
          .fontColor(Color.Grey)
          .padding({ left: 16, top: 10 });
      } else {
        List() {
          ForEach(this.detail.tracks, (item: PlaylistTrack) => {
            ListItem() {
              this.buildTrackRow(item);
            };
          }, (item: PlaylistTrack) => item.id.toString());
        }
        .width('100%')
        .layoutWeight(1);
      }
    }
    .width('100%')
    .height('100%');
  }
}