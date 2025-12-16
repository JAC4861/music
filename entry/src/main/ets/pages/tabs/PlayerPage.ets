import { Song } from '../../service/ApiService';
import {
  PLAYER_SONG_KEY,
  PLAYER_PLAYING_KEY,
  PLAYER_POSITION_MS_KEY,
  PLAYER_DURATION_MS_KEY,
  PLAYER_SPEED_KEY,
  PLAYERBAR_VISIBLE_KEY
} from '../../service/PlayerState';
import {
  PLAYER_LOADING_KEY,
  seekTo,
  toggleFavorite,
  togglePlayPause,
  playPrev,
  playNext,
  setPlaybackRate
} from '../../service/AudioPlayerService';
import { PreferencesStore } from '../../service/PreferencesStore';

// ✅ 公用 UI 按钮（图片资源 + 可改尺寸）
import { PlayerBtnLeft, PlayerBtnRight, PlayerBtnBegin, PlayerBtnEnd } from '../../common/UI';

@Component
export struct PlayerPage {
  @StorageLink(PLAYER_SONG_KEY) currentSong: Song | undefined = undefined;
  @StorageLink(PLAYER_PLAYING_KEY) isPlaying: boolean = false;
  @StorageLink(PLAYER_POSITION_MS_KEY) positionMs: number = 0;
  @StorageLink(PLAYER_DURATION_MS_KEY) durationMs: number = 0;
  @StorageLink(PLAYER_LOADING_KEY) isLoading: boolean = false;
  @StorageLink(PLAYER_SPEED_KEY) playRate: number = 1.0;

  @State dragging: boolean = false;
  @State dragValue: number = 0;

  @State isFavorite: boolean = false;
  @State lastSongId: number = -1;

  private get isSongPlayable(): boolean {
    return !!this.currentSong && !!this.currentSong.url && this.currentSong.url.length > 0;
  }

  private fmt(ms: number): string {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(v, max));
  }

  async aboutToAppear() {
    // ✅ 进入 PlayerPage：隐藏底部 PlayerBar
    AppStorage.SetOrCreate<boolean>(PLAYERBAR_VISIBLE_KEY, true);
    AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, false);

    await this.refreshFavoriteIfNeeded(true);
    AppStorage.SetOrCreate<number>(PLAYER_SPEED_KEY, 1.0);
  }

  aboutToDisappear() {
    // ✅ 离开 PlayerPage：恢复 PlayerBar
    AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, true);
  }

  async aboutToRender() {
    await this.refreshFavoriteIfNeeded(false);
  }

  private async refreshFavoriteIfNeeded(force: boolean): Promise<void> {
    if (!this.currentSong) return;
    const id = this.currentSong.id ?? -1;
    if (!force && id === this.lastSongId) return;
    this.lastSongId = id;

    try {
      this.isFavorite = await PreferencesStore.isFavorite(id);
    } catch (_) {
      // ignore
    }
  }

  private async onToggleFavorite(): Promise<void> {
    if (!this.currentSong || this.isLoading) return;
    await toggleFavorite(this.currentSong);
    await this.refreshFavoriteIfNeeded(true);
  }

  build() {
    Stack() {
      Column() {}
      .width('100%')
      .height('100%')
      .backgroundColor(0xF6F7FB);

      Column() {
        // 顶部
        Row() {
          Column({ space: 4 }) {
            Text('正在播放').fontSize(14).fontColor(0x6B7280);
            Text('播放器').fontSize(22).fontWeight(FontWeight.Bold).fontColor(0x111827);
          }
          Blank().layoutWeight(1);

          if (this.isLoading) {
            Text('加载中')
              .fontSize(12).fontColor(0x111827)
              .padding({ left: 10, right: 10, top: 6, bottom: 6 })
              .backgroundColor(0xEEF2FF).borderRadius(999);
          } else if (this.isPlaying) {
            Text('播放中')
              .fontSize(12).fontColor(0x111827)
              .padding({ left: 10, right: 10, top: 6, bottom: 6 })
              .backgroundColor(0xECFDF5).borderRadius(999);
          } else {
            Text('已暂停')
              .fontSize(12).fontColor(0x111827)
              .padding({ left: 10, right: 10, top: 6, bottom: 6 })
              .backgroundColor(0xF3F4F6).borderRadius(999);
          }
        }
        .width('100%')
        .padding({ left: 18, right: 18, top: 18 });

        if (!this.currentSong) {
          Column({ space: 10 }) {
            Text('暂无正在播放的歌曲').fontSize(16).fontWeight(FontWeight.Medium).fontColor(0x111827);
            Text('请在“发现”页点击歌曲开始播放').fontSize(13).fontColor(0x6B7280);
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
          .padding({ left: 18, right: 18, top: 26, bottom: 18 });

          Blank().layoutWeight(1);
        } else {
          // 封面 + 信息
          Column({ space: 12 }) {
            if (this.currentSong.coverUrl && this.currentSong.coverUrl.length > 0) {
              Image(this.currentSong.coverUrl)
                .width(240).height(240).borderRadius(20)
                .objectFit(ImageFit.Cover)
                .shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 });
            } else {
              Stack() {
                Column() {}
                .width(240).height(240).borderRadius(20)
                .backgroundColor(0xEEF2FF)
                .shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 });
                Text('No Cover').fontSize(14).fontColor(0x6B7280);
              }
            }

            Column({ space: 6 }) {
              Text(this.currentSong.name)
                .fontSize(20).fontWeight(FontWeight.Bold).fontColor(0x111827)
                .maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
                .textAlign(TextAlign.Center);

              Text(this.currentSong.artistName)
                .fontSize(14).fontColor(0x6B7280)
                .maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
                .textAlign(TextAlign.Center);
            }
            .width('100%')
            .padding({ left: 18, right: 18 });
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
          .padding({ top: 18 });

          // 进度条
          // 进度条
          Column({ space: 8 }) {
            Slider({
              value: this.dragging ? this.dragValue : this.positionMs,
              min: 0,
              max: this.durationMs > 0 ? this.durationMs : 1
            })
              .height(36)
              .enabled(this.isSongPlayable && !this.isLoading)
              .onChange((v: number) => {
                if (!this.isSongPlayable || this.isLoading) return;

                // ✅ 拖动过程中只更新 UI，不要频繁 seek
                this.dragging = true;
                this.dragValue = v;
              })
              .onTouch((e: TouchEvent) => {
                if (!this.isSongPlayable || this.isLoading) return;

                if (e.type === TouchType.Down) {
                  this.dragging = true;
                  this.dragValue = this.positionMs;
                } else if (e.type === TouchType.Up || e.type === TouchType.Cancel) {
                  const max = this.durationMs > 0 ? this.durationMs : this.dragValue;
                  const target = this.clamp(this.dragValue, 0, max);
                  this.dragging = false;

                  // ✅ 松手才真正 seek
                  seekTo(target);
                }
              });

            Row() {
              Text(this.fmt(this.dragging ? this.dragValue : this.positionMs)).fontSize(12).fontColor(0x6B7280);
              Blank().layoutWeight(1);
              Text(this.fmt(this.durationMs)).fontSize(12).fontColor(0x6B7280);
            }
            .width('100%');
          }
          .width('100%')
          .padding({ left: 18, right: 18, top: 18 });

          // ===== 上一首 / 播放暂停 / 下一首：统一图片图标按钮 =====
          Row({ space: 14 }) {
            // 你可以通过 size 参数重写大小：{ btn: 62, icon: 22 } 等
            PlayerBtnLeft(!this.isLoading, () => { playPrev(); }, $r('app.media.left'), { btn: 62, icon: 22 }, 0xEEF2FF, 23);

            if (this.isPlaying) {
              // 暂停（主按钮）
              PlayerBtnEnd(this.isSongPlayable && !this.isLoading, () => { togglePlayPause(); },
                $r('app.media.guanbi'), { btn: 70, icon: 24 }, 0x2955FF, 23);
            } else {
              // 播放（主按钮）
              PlayerBtnBegin(this.isSongPlayable && !this.isLoading, () => { togglePlayPause(); },
                $r('app.media.bofang'), { btn: 70, icon: 24 }, 0x2955FF, 23);
            }

            PlayerBtnRight(!this.isLoading, () => { playNext(); }, $r('app.media.right'), { btn: 62, icon: 22 }, 0xEEF2FF, 23);
          }
          .padding({ left: 18, right: 18, top: 14 });

          // ===== 倍速选择 =====
          Column({ space: 10 }) {
            Row() {
              Text('倍速').fontSize(13).fontColor(0x6B7280);
              Blank().layoutWeight(1);
              Text(`${this.playRate}x`).fontSize(13).fontColor(0x111827);
            }

            Row({ space: 10 }) {
              Button('0.75x')
                .enabled(!this.isLoading)
                .onClick(async () => { await setPlaybackRate(0.75); })
                .layoutWeight(1)
                .height(40).borderRadius(20)
                .backgroundColor(this.playRate === 0.75 ? 0x2955FF : 0xF3F4F6)
                .fontColor(this.playRate === 0.75 ? Color.White : 0x111827);

              Button('1.0x')
                .enabled(!this.isLoading)
                .onClick(async () => { await setPlaybackRate(1.0); })
                .layoutWeight(1)
                .height(40).borderRadius(20)
                .backgroundColor(this.playRate === 1.0 ? 0x2955FF : 0xF3F4F6)
                .fontColor(this.playRate === 1.0 ? Color.White : 0x111827);

              Button('1.25x')
                .enabled(!this.isLoading)
                .onClick(async () => { await setPlaybackRate(1.25); })
                .layoutWeight(1)
                .height(40).borderRadius(20)
                .backgroundColor(this.playRate === 1.25 ? 0x2955FF : 0xF3F4F6)
                .fontColor(this.playRate === 1.25 ? Color.White : 0x111827);

              Button('1.75x')
                .enabled(!this.isLoading)
                .onClick(async () => { await setPlaybackRate(1.75); })
                .layoutWeight(1)
                .height(40).borderRadius(20)
                .backgroundColor(this.playRate === 1.75 ? 0x2955FF : 0xF3F4F6)
                .fontColor(this.playRate === 1.75 ? Color.White : 0x111827);

              Button('2.0x')
                .enabled(!this.isLoading)
                .onClick(async () => { await setPlaybackRate(2.0); })
                .layoutWeight(1)
                .height(40).borderRadius(20)
                .backgroundColor(this.playRate === 2.0 ? 0x2955FF : 0xF3F4F6)
                .fontColor(this.playRate === 2.0 ? Color.White : 0x111827);
            }
          }
          .padding({ left: 18, right: 18, top: 14 });

          // 收藏：你如果有两张图标（空心/实心），也可以在这里换成图片按钮
          Row({ space: 12 }) {
            Button() {
              Row({ space: 8 }) {
                // 默认示例资源名：ic_heart_outline / ic_heart_filled，你改成你的
                if (this.isFavorite) {
                  Image($r('app.media.youxin')).width(18).height(18).objectFit(ImageFit.Contain);
                  Text('已收藏').fontSize(16).fontWeight(FontWeight.Medium).fontColor(0x2955FF);
                } else {
                  Image($r('app.media.wuxin')).width(18).height(18).objectFit(ImageFit.Contain);
                  Text('收藏').fontSize(16).fontWeight(FontWeight.Medium).fontColor(0x2955FF);
                }
              }
              .alignItems(VerticalAlign.Center);
            }
            .enabled(!this.isLoading)
            .onClick(async () => { await this.onToggleFavorite(); })
            .layoutWeight(1)
            .height(46).borderRadius(23)
            .backgroundColor(0xEEF2FF);
          }
          .padding({ left: 18, right: 18, top: 14, bottom: 18 });

          Blank().layoutWeight(1);
        }
      }
      .width('100%')
      .height('92%')
      .backgroundColor(Color.White)
      .borderRadius(22)
      .padding({ bottom: 16 })
      .shadow({ radius: 18, color: 0x22000000, offsetX: 0, offsetY: 10 })
      .alignSelf(ItemAlign.Center);
    }
    .width('100%')
    .height('100%')
    .padding({ bottom: 28 });
  }
}