import { Song } from './ApiService';

/**
 * ===== 原有全局 Key（保留）=====
 */
export const PLAYER_SONG_KEY = 'PLAYER_CURRENT_SONG';
export const PLAYER_PLAYING_KEY = 'PLAYER_IS_PLAYING';
export const PLAYER_SPEED_KEY = 'PLAYER_SPEED_KEY';
export const PLAYERBAR_VISIBLE_KEY = 'PLAYERBAR_VISIBLE_KEY';
/**
 * ===== 新增：进度/时长 Key（用于进度条）=====
 * 单位：毫秒
 */
export const PLAYER_POSITION_MS_KEY = 'PLAYER_POSITION_MS';
export const PLAYER_DURATION_MS_KEY = 'PLAYER_DURATION_MS';

export function initPlayerStateIfNeeded() {
  AppStorage.SetOrCreate<Song | undefined>(PLAYER_SONG_KEY, undefined);
  AppStorage.SetOrCreate<boolean>(PLAYER_PLAYING_KEY, false);

  AppStorage.SetOrCreate<number>(PLAYER_POSITION_MS_KEY, 0);
  AppStorage.SetOrCreate<number>(PLAYER_DURATION_MS_KEY, 0);
}

export function setCurrentSong(song: Song) {
  AppStorage.Set<Song | undefined>(PLAYER_SONG_KEY, song);
  AppStorage.Set<boolean>(PLAYER_PLAYING_KEY, true);

  // 切歌时把进度置 0
  AppStorage.Set<number>(PLAYER_POSITION_MS_KEY, 0);
}

export function setPlaying(playing: boolean) {
  AppStorage.Set<boolean>(PLAYER_PLAYING_KEY, playing);
}

export function togglePlaying() {
  const playing = AppStorage.Get<boolean>(PLAYER_PLAYING_KEY) ?? false;
  AppStorage.Set<boolean>(PLAYER_PLAYING_KEY, !playing);
}

export function setPositionMs(ms: number) {
  AppStorage.Set<number>(PLAYER_POSITION_MS_KEY, ms);
}

export function setDurationMs(ms: number) {
  AppStorage.Set<number>(PLAYER_DURATION_MS_KEY, ms);
}

