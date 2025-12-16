import media from '@ohos.multimedia.media';
import { Song } from './ApiService';
import { setCurrentSong, setPlaying, setPositionMs, setDurationMs, PLAYER_SPEED_KEY } from './PlayerState';
import { PreferencesStore, StoredSong } from './PreferencesStore';

export const PLAYER_LOADING_KEY = 'PLAYER_IS_LOADING';
export const PLAYER_QUEUE_KEY = 'PLAYER_QUEUE_KEY'; // UI 可读：只存 songId 列表（轻量）
export const PLAYER_INDEX_KEY = 'PLAYER_INDEX_KEY'; // UI 可读：当前 index

let opChain: Promise<void> = Promise.resolve();        // 重操作：playSong 切歌链路
let controlChain: Promise<void> = Promise.resolve();   // 轻操作：pause/resume/seek/speed

let avPlayer: media.AVPlayer | undefined = undefined;
let playerState: string = 'idle';
let playSeq: number = 0;

// 时间单位
let timeUnit: string = 'ms';

// ====== 播放队列（放内存里更稳） ======
let playQueue: Song[] = [];
let playIndex: number = 0;

function normalizeUrl(url: string): string {
  if (url.startsWith('http://')) return 'https://' + url.substring('http://'.length);
  return url;
}

function normalizeToMs(v: number): number {
  if (v > 10_000_000) {
    timeUnit = 'us';
    return Math.floor(v / 1000);
  }
  timeUnit = 'ms';
  return v;
}

function msToPlayerUnit(ms: number): number {
  if (timeUnit === 'us') return ms * 1000;
  return ms;
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((r) => setTimeout(() => r(), ms));
}

function enqueue(op: () => Promise<void>): Promise<void> {
  opChain = opChain.then(op).catch(() => {
    console.error('[AudioPlayerService] opChain error');
  });
  return opChain;
}

function enqueueControl(op: () => Promise<void>): Promise<void> {
  controlChain = controlChain.then(op).catch(() => {
    console.error('[AudioPlayerService] controlChain error');
  });
  return controlChain;
}

function setLoading(loading: boolean) {
  AppStorage.SetOrCreate<boolean>(PLAYER_LOADING_KEY, false);
  AppStorage.Set<boolean>(PLAYER_LOADING_KEY, loading);
}

function toStoredSong(song: Song, fixedUrl: string): StoredSong {
  return { id: song.id, name: song.name, artistName: song.artistName, coverUrl: song.coverUrl, url: fixedUrl };
}

function buildSongWithUrl(song: Song, fixedUrl: string): Song {
  return {
    id: song.id,
    name: song.name,
    artistName: song.artistName,
    coverUrl: song.coverUrl,
    durationSec: song.durationSec,
    url: fixedUrl
  };
}

async function createPlayer(): Promise<media.AVPlayer> {
  const p = await media.createAVPlayer();
  playerState = 'idle';

  p.on('durationUpdate', (d: number) => {
    console.info('[AudioPlayerService] durationUpdate raw=' + d);
    setDurationMs(normalizeToMs(d));
  });

  p.on('timeUpdate', (t: number) => {
    setPositionMs(normalizeToMs(t));
  });

  p.on('stateChange', (state: string) => {
    playerState = state;
    console.info('[AudioPlayerService] state=' + state + ', seq=' + playSeq);
  });

  avPlayer = p;
  return p;
}

async function releasePlayer(): Promise<void> {
  if (!avPlayer) return;

  try {
    if (playerState === 'playing') {
      await avPlayer.pause();
      await sleep(40);
    }
  } catch (_) {
    // ignore
  }

  try {
    await avPlayer.stop();
  } catch (_) {
    // ignore
  }

  try {
    await avPlayer.release();
  } catch (_) {
    // ignore
  }

  avPlayer = undefined;
  playerState = 'released';
}

async function recreatePlayerWithBackoff(): Promise<media.AVPlayer> {
  await releasePlayer();
  await sleep(350); // 关键退避
  return await createPlayer();
}

async function playOnFreshPlayer(url: string, seq: number): Promise<void> {
  const p = await recreatePlayerWithBackoff();
  if (seq !== playSeq) return;

  console.info('[AudioPlayerService] set url: ' + url);
  p.url = url;

  await sleep(120);
  if (seq !== playSeq) return;

  await p.prepare();
  if (seq !== playSeq) return;

  // 应用倍速（如果用户设置过）
  try {
    const rate = AppStorage.Get<number>(PLAYER_SPEED_KEY) ?? 1.0;
    await p.setSpeed(rateToPlaybackSpeed(rate));
  } catch (_) {
    // ignore
  }

  await p.play();
}

function syncQueueToAppStorage() {
  // AppStorage 里只存轻量信息，避免 Song[] 太大导致问题
  const ids: number[] = [];
  for (let i = 0; i < playQueue.length; i++) {
    ids.push(playQueue[i].id);
  }

  AppStorage.SetOrCreate<number[]>(PLAYER_QUEUE_KEY, [] as number[]);
  AppStorage.Set<number[]>(PLAYER_QUEUE_KEY, ids);

  AppStorage.SetOrCreate<number>(PLAYER_INDEX_KEY, 0);
  AppStorage.Set<number>(PLAYER_INDEX_KEY, playIndex);
}

// ====== 对外：播放一首（保留你现有逻辑） ======
export function playSong(song: Song): Promise<void> {
  return enqueue(async () => {
    const seq = ++playSeq;

    if (!song.url || song.url.length === 0) {
      setCurrentSong(song);
      setPlaying(false);
      return;
    }

    const finalUrl = normalizeUrl(song.url);

    console.info('[AudioPlayerService] playSong songId=' + song.id + ' url=' + finalUrl + ', seq=' + seq);

    setCurrentSong(buildSongWithUrl(song, finalUrl));
    setPositionMs(0);
    setDurationMs(0);

    // 若接口不给 durationUpdate，也能先显示时长（可选但建议）
    if (song.durationSec > 0) {
      setDurationMs(song.durationSec * 1000);
    }

    setLoading(true);
    try {
      try {
        await PreferencesStore.addRecentSong(toStoredSong(song, finalUrl));
      } catch (_) {
        console.error('[AudioPlayerService] addRecentSong error');
      }

      await playOnFreshPlayer(finalUrl, seq);

      if (seq === playSeq) setPlaying(true);
    } catch (_) {
      console.error('[AudioPlayerService] playSong failed');
      setPlaying(false);
    } finally {
      if (seq === playSeq) setLoading(false);
    }
  });
}

// ====== 控制类：不走 opChain，避免卡顿 ======
export function pause(): Promise<void> {
  return enqueueControl(async () => {
    if (!avPlayer) return;
    try {
      await avPlayer.pause();
      setPlaying(false);
    } catch (_) {
      console.error('[AudioPlayerService] pause failed');
    }
  });
}

export function resume(): Promise<void> {
  return enqueueControl(async () => {
    if (!avPlayer) return;
    try {
      await avPlayer.play();
      setPlaying(true);
    } catch (_) {
      console.error('[AudioPlayerService] resume failed');
      setPlaying(false);
    }
  });
}

export function seekTo(ms: number): Promise<void> {
  return enqueueControl(async () => {
    if (!avPlayer) return;

    if (!(playerState === 'prepared' || playerState === 'playing' || playerState === 'paused' || playerState === 'completed')) {
      console.warn('[AudioPlayerService] seek ignored in state=' + playerState);
      return;
    }

    try {
      const v = msToPlayerUnit(ms);
      await avPlayer.seek(v);
      setPositionMs(ms);
    } catch (_) {
      console.error('[AudioPlayerService] seek failed');
    }
  });
}

export async function togglePlayPause(): Promise<void> {
  const playingValue = AppStorage.Get<boolean>('PLAYER_IS_PLAYING');
  const playing: boolean = playingValue ?? false;
  if (playing) await pause();
  else await resume();
}

export function toggleFavorite(song: Song): Promise<boolean> {
  const fixedUrl = normalizeUrl(song.url);
  return PreferencesStore.toggleFavorite(toStoredSong(song, fixedUrl));
}

// ====== 队列：设置队列 & 当前索引 ======
export function setPlayQueue(queue: Song[], index: number): void {
  playQueue = queue;
  if (playQueue.length === 0) {
    playIndex = 0;
  } else {
    playIndex = Math.max(0, Math.min(index, playQueue.length - 1));
  }
  syncQueueToAppStorage();
}

// 可选：对外提供当前队列信息（给 UI 调试）
export function getPlayQueueLength(): number {
  return playQueue.length;
}

// ====== 上一首/下一首 ======
// 说明：常见音乐 App 默认循环队列；你如果不想循环，把 wrap 去掉即可
export async function playPrev(): Promise<void> {
  if (playQueue.length === 0) return;

  if (playIndex <= 0) playIndex = playQueue.length - 1;
  else playIndex -= 1;

  syncQueueToAppStorage();
  await playSong(playQueue[playIndex]);
}

export async function playNext(): Promise<void> {
  if (playQueue.length === 0) return;

  if (playIndex >= playQueue.length - 1) playIndex = 0;
  else playIndex += 1;

  syncQueueToAppStorage();
  await playSong(playQueue[playIndex]);
}

// ====== 倍速（你原有逻辑保留并修正 ArkTS catch） ======
function ensureSpeedKeyCreated() {
  AppStorage.SetOrCreate<number>(PLAYER_SPEED_KEY, 1.0);
}

function rateToPlaybackSpeed(rate: number): media.PlaybackSpeed {
  if (rate === 0.75) return media.PlaybackSpeed.SPEED_FORWARD_0_75_X;
  if (rate === 1.25) return media.PlaybackSpeed.SPEED_FORWARD_1_25_X;
  if (rate === 1.75) return media.PlaybackSpeed.SPEED_FORWARD_1_75_X;
  if (rate === 2.0) return media.PlaybackSpeed.SPEED_FORWARD_2_00_X;
  return media.PlaybackSpeed.SPEED_FORWARD_1_00_X;
}

export function setPlaybackRate(rate: number): Promise<void> {
  ensureSpeedKeyCreated();

  // 倍速属于控制类：走 controlChain
  return enqueueControl(async () => {
    AppStorage.Set<number>(PLAYER_SPEED_KEY, rate);
    if (!avPlayer) return;

    try {
      await avPlayer.setSpeed(rateToPlaybackSpeed(rate));
    } catch (_) {
      console.error('[AudioPlayerService] setPlaybackRate failed');
    }
  });
}