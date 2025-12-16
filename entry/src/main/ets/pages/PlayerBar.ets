import type { Song } from '../service/ApiService';
import {
  PLAYER_SONG_KEY,
  PLAYER_PLAYING_KEY,
  PLAYER_POSITION_MS_KEY,
  PLAYER_DURATION_MS_KEY,
  PLAYERBAR_VISIBLE_KEY
} from '../service/PlayerState';
import { seekTo, togglePlayPause, playPrev, playNext, PLAYER_LOADING_KEY } from '../service/AudioPlayerService';


import { PlayerBtnLeft, PlayerBtnRight, PlayerBtnBegin, PlayerBtnEnd } from '../common/UI';

export interface PlayerBarCallbacks {
  onOpenPlayerPage?: () => void;
}

@Component
export struct PlayerBar {
  @StorageLink(PLAYERBAR_VISIBLE_KEY) visible: boolean = true;
  @StorageLink(PLAYER_DURATION_MS_KEY) durationMs: number = 0;
  @StorageLink(PLAYER_LOADING_KEY) isLoading: boolean = false;
  @StorageLink(PLAYER_SONG_KEY) currentSong: Song | undefined = undefined;
  @StorageLink(PLAYER_PLAYING_KEY) isPlaying: boolean = false;
  @StorageLink(PLAYER_POSITION_MS_KEY) positionMs: number = 0;

  @Prop callbacks: PlayerBarCallbacks = {};

  @State dragging: boolean = false;
  @State dragValue: number = 0;

  private get isPlayable(): boolean {
    return !!this.currentSong && !!this.currentSong.url && this.currentSong.url.length > 0;
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(v, max));
  }

  private fmt(ms: number): string {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  private hideBar() {
    AppStorage.SetOrCreate<boolean>(PLAYERBAR_VISIBLE_KEY, true);
    AppStorage.Set<boolean>(PLAYERBAR_VISIBLE_KEY, false);
  }

  build() {
    Column() {
      if (this.visible && this.currentSong) {
        Column({ space: 8 }) {
          Row({ space: 10 }) {
            // 封面
            if (this.currentSong.coverUrl && this.currentSong.coverUrl.length > 0) {
              Image(this.currentSong.coverUrl)
                .width(46).height(46).borderRadius(12).objectFit(ImageFit.Cover)
                .shadow({ radius: 10, color: 0x18000000, offsetX: 0, offsetY: 4 });
            } else {
              Stack() {
                Column() {}.width(46).height(46).borderRadius(12).backgroundColor(0xEEF2FF);
                Text('♪').fontSize(18).fontColor(0x2955FF);
              }
              .shadow({ radius: 10, color: 0x18000000, offsetX: 0, offsetY: 4 });
            }

            // 信息区：按你需求“点一下就消失”
            Column({ space: 4 }) {
              Text(this.currentSong.name)
                .fontSize(14).fontWeight(FontWeight.Medium).fontColor(0x111827)
                .maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis });

              Text(this.currentSong.artistName)
                .fontSize(12).fontColor(0x6B7280)
                .maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis });
            }
            .layoutWeight(1)
            .alignItems(HorizontalAlign.Start)
            .onClick(() => {
              // 点击就隐藏 bar
              this.hideBar();

              // 如果你想改成“点击打开 PlayerPage”，用下面这一句替换上面 hideBar：
              // this.callbacks.onOpenPlayerPage?.();
            });

            // 按钮：图标资源版
            PlayerBtnLeft(this.isPlayable, () => { playPrev(); });
            if (this.isPlaying) {
              PlayerBtnEnd(this.isPlayable, () => { togglePlayPause(); });
            } else {
              PlayerBtnBegin(this.isPlayable, () => { togglePlayPause(); });
            }
            PlayerBtnRight(this.isPlayable, () => { playNext(); });
          }
          .padding({ left: 12, right: 12, top: 12, bottom: 10 })
          .backgroundColor(Color.White)
          .borderRadius(18)
          .shadow({ radius: 14, color: 0x22000000, offsetX: 0, offsetY: 6 });

          // 进度条（mini）
          Slider({
            value: this.dragging ? this.dragValue : this.positionMs,
            min: 0,
            max: this.durationMs > 0 ? this.durationMs : 1
          })
            .height(28)
            .enabled(this.isPlayable && !this.isLoading)
            .onChange((v: number) => {
              if (!this.isPlayable || this.isLoading) return;
              this.dragging = true;
              this.dragValue = v;
            })
            .onTouch((e: TouchEvent) => {
              if (!this.isPlayable || this.isLoading) return;

              if (e.type === TouchType.Down) {
                this.dragging = true;
                this.dragValue = this.positionMs;
              } else if (e.type === TouchType.Up || e.type === TouchType.Cancel) {
                const max = this.durationMs > 0 ? this.durationMs : this.dragValue;
                const target = Math.max(0, Math.min(this.dragValue, max));
                this.dragging = false;
                seekTo(target);
              }
            });

            Row() {
              Text(this.fmt(this.dragging ? this.dragValue : this.positionMs)).fontSize(11).fontColor(0x6B7280);
              Blank().layoutWeight(1);
              Text(this.fmt(this.durationMs)).fontSize(11).fontColor(0x6B7280);
            }
            .padding({ left: 6, right: 6 });
          }
        .width('100%')
        .padding({ left: 12, right: 12, bottom: 10 });
      } else {
        Column() {}.width('100%').height(0);
      }
    }
    .width('100%');
  }
}