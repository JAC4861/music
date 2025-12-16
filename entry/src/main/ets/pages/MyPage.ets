import { PreferencesStore, UserProfile, StoredSong } from '../service/PreferencesStore';
import { playSong } from '../service/AudioPlayerService';
import { Song } from '../service/ApiService';

export interface MyPageCallbacks {
  onGoPlayerTab?: () => void;
}

@Component
export struct MyPage {
  @Prop callbacks: MyPageCallbacks = {};

  @State profile: UserProfile = { username: '', nickname: '', signature: '' };

  @State nicknameInput: string = '';
  @State signatureInput: string = '';
  @State recentSongs: Array<StoredSong> = [];
  @State favoriteSongs: Array<StoredSong> = [];
  @State loading: boolean = false;

  aboutToAppear() {
    this.reloadAll();
  }

  private async reloadAll(): Promise<void> {
    this.loading = true;
    try {
      const p: UserProfile | undefined = await PreferencesStore.loadUserProfile();
      if (p) {
        this.profile = p;
        this.nicknameInput = p.nickname;
        this.signatureInput = p.signature ? p.signature : '';
      }
      this.recentSongs = await PreferencesStore.getRecentSongs();
      this.favoriteSongs = await PreferencesStore.getFavoriteSongs();

      console.info('[MyPage] recent=' + this.recentSongs.length + ', fav=' + this.favoriteSongs.length);
    } catch (_) {
      console.error('[MyPage] reloadAll error');
    } finally {
      this.loading = false;
    }
  }

  private async saveProfile(): Promise<void> {
    const newProfile: UserProfile = {
      username: this.profile.username,
      nickname: this.nicknameInput.trim().length > 0 ? this.nicknameInput.trim() : this.profile.username,
      signature: this.signatureInput,
      avatar: this.profile.avatar
    };
    await PreferencesStore.saveUserProfile(newProfile);
    this.profile = newProfile;
  }

  private async playStored(item: StoredSong): Promise<void> {
    const song: Song = {
      id: item.id,
      name: item.name,
      artistName: item.artistName,
      coverUrl: item.coverUrl,
      durationSec: item.durationSec ?? 0,
      url: item.url ?? ''
    };
    await playSong(song);

    // 播放后立刻刷新最近播放
    this.recentSongs = await PreferencesStore.getRecentSongs();
  }

  @Builder
  private buildSongRow(item: StoredSong) {
    Row() {
      if (item.coverUrl && item.coverUrl.length > 0) {
        Image(item.coverUrl)
          .width(48).height(48)
          .borderRadius(6)
          .objectFit(ImageFit.Cover);
      } else {
        Blank()
          .width(48).height(48)
          .backgroundColor('#EEEEEE')
          .borderRadius(6);
      }

      Column({ space: 4 }) {
        Text(item.name)
          .fontSize(16)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });

        Text(item.artistName)
          .fontSize(12)
          .fontColor(Color.Grey)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis });
      }
      .padding({ left: 10 })
      .layoutWeight(1);

      Image($r('app.media.bofang'))
        .width(22)
        .height(22);
    }
    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    .backgroundColor(Color.White)
    .borderRadius(12)
    .onClick(() => this.playStored(item));
  }

  build() {
    Column() {
      // Header
      Row({ space: 12 }) {
        Image($r('app.media.avatar'))
          .width(56)
          .height(56)
          .borderRadius(28)
          .objectFit(ImageFit.Cover);

        Column({ space: 4 }) {
          Text(this.profile.nickname.length > 0 ? this.profile.nickname : (this.profile.username || '未登录'))
            .fontSize(20)
            .fontWeight(FontWeight.Bold);

          Text(this.profile.signature && this.profile.signature.length > 0 ? this.profile.signature : '点击下方可以修改个人签名')
            .fontSize(12)
            .fontColor(Color.Grey);
        }
      }
      .padding({ left: 16, right: 16, top: 10 });

      Column({ space: 10 }) {
        Row() {
          Text('个人信息').fontSize(16).fontWeight(FontWeight.Medium);
          Blank().layoutWeight(1);
          Text('刷新')
            .fontSize(14)
            .fontColor(0x2955FF)
            .onClick(() => this.reloadAll());
        }

        Text('修改昵称')
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .alignSelf(ItemAlign.Start);

        TextInput({ text: this.nicknameInput, placeholder: '请输入昵称' })
          .onChange((v: string) => this.nicknameInput = v)
          .height(38)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 10, right: 10 });

        Text('修改个性签名')
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .alignSelf(ItemAlign.Start)
          .margin({ top: 10 });

        TextInput({ text: this.signatureInput, placeholder: '这个人很懒，还没有写签名~' })
          .onChange((v: string) => this.signatureInput = v)
          .height(40)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 10, right: 10 });

        Button('保存资料')
          .width('100%')
          .height(40)
          .backgroundColor(0x2955FF)
          .fontColor(Color.White)
          .borderRadius(20)
          .onClick(() => this.saveProfile());
      }
      .padding({ left: 16, right: 16, top: 8, bottom: 8 });

      // ====== 列表区：用 Scroll 包 Column（不嵌 List）=====
      Scroll() {
        Column({ space: 12 }) {
          // 最近播放
          Row() {
            Text('最近播放').fontSize(18).fontWeight(FontWeight.Bold);
            Blank().layoutWeight(1);
            Text(`${this.recentSongs.length}`).fontSize(12).fontColor(0x6B7280);
          }
          .padding({ left: 16, right: 16, top: 12 });

          if (this.recentSongs.length === 0) {
            Text('暂无数据')
              .fontSize(13)
              .fontColor(Color.Grey)
              .padding({ left: 16, bottom: 6 });
          } else {
            Column({ space: 8 }) {
              ForEach(this.recentSongs, (item: StoredSong) => {
                this.buildSongRow(item);
              }, (item: StoredSong) => `recent-${item.id}`);
            }
            .padding({ left: 12, right: 12 });
          }

          // 收藏
          Row() {
            Text('收藏').fontSize(18).fontWeight(FontWeight.Bold);
            Blank().layoutWeight(1);
            Text(`${this.favoriteSongs.length}`).fontSize(12).fontColor(0x6B7280);
          }
          .padding({ left: 16, right: 16, top: 12 });

          if (this.favoriteSongs.length === 0) {
            Text('暂无数据')
              .fontSize(13)
              .fontColor(Color.Grey)
              .padding({ left: 16, bottom: 40 });
          } else {
            Column({ space: 8 }) {
              ForEach(this.favoriteSongs, (item: StoredSong) => {
                this.buildSongRow(item);
              }, (item: StoredSong) => `fav-${item.id}`);
            }
            .padding({ left: 12, right: 12, bottom: 120 }); // ✅ 留出底部空间，避免被 PlayerBar 盖住
          }
        }
        .width('100%');
      }
      .layoutWeight(1);
    }
    .width('100%')
    .height('100%')
    .backgroundColor(0xF6F7FB);
  }
}