// entry/src/main/ets/service/PreferencesStore.ets

import { preferences } from '@kit.ArkData';
import { GlobalContext } from '../common/GlobalContext';

/** 用户资料模型 */
export interface UserProfile {
  username: string;   // 账号
  nickname: string;   // 昵称
  signature?: string; // 个性签名
  avatar?: string;    // 头像资源名（可选）
}

/** 用于最近播放 / 收藏 的歌曲简要模型 */
export interface StoredSong {
  id: number;
  name: string;
  artistName: string;
  coverUrl: string;

  // 新增可选字段：方便播放器和榜单使用
  durationSec?: number; // 时长（秒）

  url?: string;         // 真正的播放地址
}

// ------- 内部单例 prefs，对外只通过 getPrefs 访问 -------

const STORE_NAME: string = 'music_local_store';
let prefsInstance: preferences.Preferences | undefined;

async function getPrefs(): Promise<preferences.Preferences> {
  if (prefsInstance) {
    return prefsInstance;
  }

  const ctx = GlobalContext.getInstance().getContext();

  // ✅ 关键：使用应用级 context，避免不同页面/ability 读写不一致
  const appCtx = ctx.getApplicationContext();

  prefsInstance = await preferences.getPreferences(appCtx, STORE_NAME);

  console.info('[PreferencesStore] prefs ready, store=' + STORE_NAME);
  return prefsInstance;
}

// ------- 内部工具函数：解析 / 序列化 歌曲列表 -------

function parseSongList(text: string): Array<StoredSong> {
  if (!text || text.length === 0) {
    return [];
  }
  try {
    const arr = JSON.parse(text) as Array<StoredSong>;
    if (!Array.isArray(arr)) {
      return [];
    }
    return arr;
  } catch (_) {
    console.error('parseSongList error');
    return [];
  }
}

function stringifySongList(list: Array<StoredSong>): string {
  return JSON.stringify(list);
}

// 容量限制
const MAX_RECENT: number = 10;
const MAX_FAVORITE: number = 200;

// ================== 对外导出的类 ==================

export class PreferencesStore {
  // ---------- 用户账号（账号 + 密码） ----------

  static async saveCredentials(username: string, password: string): Promise<void> {
    const prefs = await getPrefs();
    await prefs.put('login_username', username);
    await prefs.put('login_password', password);
    await prefs.flush();
  }

  static async checkCredentials(username: string, password: string): Promise<boolean> {
    const prefs = await getPrefs();

    const savedUserValue = await prefs.get('login_username', '');
    const savedPwdValue = await prefs.get('login_password', '');

    const savedUser = typeof savedUserValue === 'string' ? savedUserValue : '';
    const savedPwd = typeof savedPwdValue === 'string' ? savedPwdValue : '';

    return savedUser === username && savedPwd === password;
  }

  static async hasCredentials(): Promise<boolean> {
    const prefs = await getPrefs();
    const userValue = await prefs.get('login_username', '');
    const username = typeof userValue === 'string' ? userValue : '';
    return username.length > 0;
  }

  // ---------- 用户资料 ----------

  static async saveUserProfile(profile: UserProfile): Promise<void> {
    const prefs = await getPrefs();
    await prefs.put('user_profile', JSON.stringify(profile));
    await prefs.flush();
  }

  static async loadUserProfile(): Promise<UserProfile | undefined> {
    const prefs = await getPrefs();
    const textValue = await prefs.get('user_profile', '');
    const text = typeof textValue === 'string' ? textValue : '';

    if (!text || text.length === 0) {
      return undefined;
    }
    try {
      const profile = JSON.parse(text) as UserProfile;
      if (!profile.username || profile.username.length === 0) {
        return undefined;
      }
      // 兜底，避免 nickname 为空
      if (!profile.nickname || profile.nickname.length === 0) {
        profile.nickname = profile.username;
      }
      return profile;
    } catch (_) {
      console.error('loadUserProfile parse error');
      return undefined;
    }
  }

  // ---------- 最近播放 ----------

  static async addRecentSong(song: StoredSong): Promise<void> {
    const prefs = await getPrefs();

    const textValue = await prefs.get('recent_songs', '');
    const text = typeof textValue === 'string' ? textValue : '';
    let list = parseSongList(text);

    // 去重 + 插到最前面
    list = list.filter((s: StoredSong) => s.id !== song.id);
    list.unshift(song);

    // 只保留最近 10 条
    if (list.length > MAX_RECENT) {
      list = list.slice(0, MAX_RECENT);
    }

    await prefs.put('recent_songs', stringifySongList(list));
    await prefs.flush();
    console.info('[PreferencesStore] recent_songs size=' + list.length);
  }

  static async getRecentSongs(): Promise<Array<StoredSong>> {
    const prefs = await getPrefs();
    const textValue = await prefs.get('recent_songs', '');
    const text = typeof textValue === 'string' ? textValue : '';
    return parseSongList(text);
  }

  /** 清空最近播放（可选功能） */
  static async clearRecentSongs(): Promise<void> {
    const prefs = await getPrefs();
    await prefs.put('recent_songs', stringifySongList([]));
    await prefs.flush();
  }

  // ---------- 收藏 ----------

  static async getFavoriteSongs(): Promise<Array<StoredSong>> {
    const prefs = await getPrefs();
    const textValue = await prefs.get('favorite_songs', '');
    const text = typeof textValue === 'string' ? textValue : '';
    return parseSongList(text);
  }

  /** 切换收藏状态：返回新的是否收藏 */
  static async toggleFavorite(song: StoredSong): Promise<boolean> {
    const prefs = await getPrefs();
    const textValue = await prefs.get('favorite_songs', '');
    const text = typeof textValue === 'string' ? textValue : '';
    let list = parseSongList(text);

    const index = list.findIndex((s: StoredSong) => s.id === song.id);
    let isFavorite: boolean;

    if (index >= 0) {
      // 取消收藏
      list.splice(index, 1);
      isFavorite = false;
    } else {
      // 收藏：去重后置顶
      list = list.filter((s: StoredSong) => s.id !== song.id);
      list.unshift(song);
      isFavorite = true;

      // ✅ 收藏列表允许更多，但仍建议上限，避免无限增长
      if (list.length > MAX_FAVORITE) {
        list = list.slice(0, MAX_FAVORITE);
      }
    }

    await prefs.put('favorite_songs', stringifySongList(list));
    await prefs.flush();
    console.info('[PreferencesStore] favorite_songs size=' + list.length + ', nowFav=' + isFavorite);
    return isFavorite;

  }

  static async isFavorite(songId: number): Promise<boolean> {
    const prefs = await getPrefs();
    const textValue = await prefs.get('favorite_songs', '');
    const text = typeof textValue === 'string' ? textValue : '';
    const list = parseSongList(text);
    return list.some((s: StoredSong) => s.id === songId);
  }

  /** 清空收藏列表（可选功能） */
  static async clearFavoriteSongs(): Promise<void> {
    const prefs = await getPrefs();
    await prefs.put('favorite_songs', stringifySongList([]));
    await prefs.flush();
  }
}