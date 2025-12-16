import http from '@ohos.net.http';

const BASE_URL: string = '';

// ================== 对外暴露的数据结构 ==================

export interface Song {
  id: number;
  name: string;
  artistName: string;
  coverUrl: string;
  durationSec: number;
  url: string;
}

export interface PlaylistBrief {
  id: number;
  name: string;
  coverUrl: string;
}

export interface PlaylistTrack {
  id: number;
  name: string;
  artistName: string;
  coverUrl: string;
  durationSec: number;
  url: string;
}

export interface PlaylistDetail {
  id: number;
  name: string;
  coverUrl: string;
  description: string;
  tracks: Array<PlaylistTrack>;
}

// ================== 内部 Netease 类型 ==================

interface NeteaseArtist {
  id: number;
  name: string;
}

interface NeteaseAlbum {
  id: number;
  name: string;
  picUrl?: string;
  blurPicUrl?: string;
}

interface NeteaseSongRaw {
  id: number;
  name: string;

  artists?: Array<NeteaseArtist>;
  album?: NeteaseAlbum;
  duration?: number;

  ar?: Array<NeteaseArtist>;
  al?: NeteaseAlbum;
  dt?: number;

  picUrl?: string;
  coverUrl?: string;
  coverImgUrl?: string;

  // 某些接口会套一层 song
  song?: NeteaseSongRaw;
}

interface NeteaseSearchResult {
  songs?: Array<NeteaseSongRaw>;
}

interface NeteaseSearchResponse {
  code: number;
  result: NeteaseSearchResult;
}

interface NeteasePlaylistBriefRaw {
  id: number;
  name: string;
  picUrl: string;
}

interface NeteaseRecommendResponseArray {
  code: number;
  result: Array<NeteasePlaylistBriefRaw>;
}

interface NeteaseRecommendResultObj {
  playlists?: Array<NeteasePlaylistBriefRaw>;
}

interface NeteaseRecommendResponseObject {
  code: number;
  result: NeteaseRecommendResultObj;
}

type NeteaseRecommendResponse = NeteaseRecommendResponseArray | NeteaseRecommendResponseObject;

interface NeteasePlaylistDetailSongRaw extends NeteaseSongRaw {}

interface NeteasePlaylistDetailPlaylist {
  id: number;
  name: string;
  description?: string;
  coverImgUrl: string;
  tracks: Array<NeteasePlaylistDetailSongRaw>;
}

interface NeteasePlaylistDetailResponse {
  code: number;
  playlist: NeteasePlaylistDetailPlaylist;
}

interface NeteaseSongUrlInfo {
  id: number;
  url: string | null;
}

interface NeteaseSongUrlResponse {
  code: number;
  data: Array<NeteaseSongUrlInfo>;
}

// ✅ song/detail 封面兜底：不能用对象字面量类型，要单独 interface
interface NeteaseSongDetailAlbum {
  picUrl?: string;
  blurPicUrl?: string;
}

interface NeteaseSongDetailSong {
  id: number;
  al?: NeteaseSongDetailAlbum;
  album?: NeteaseSongDetailAlbum;
}

interface NeteaseSongDetailResponse {
  code: number;
  songs?: Array<NeteaseSongDetailSong>;
}

// ================== 通用请求封装 ==================

async function getJson<T>(url: string): Promise<T> {
  const httpRequest: http.HttpRequest = http.createHttp();
  try {
    const response: http.HttpResponse = await httpRequest.request(url, {
      method: http.RequestMethod.GET,
      connectTimeout: 10000,
      readTimeout: 10000,
      expectDataType: http.HttpDataType.STRING
    });
    const body: string = response.result as string;
    return JSON.parse(body) as T;
  } finally {
    httpRequest.destroy();
  }
}

// ================== 映射工具 ==================

function toHttps(url: string): string {
  if (!url || url.length === 0) return '';
  if (url.startsWith('http://')) return 'https://' + url.substring(7);
  return url;
}

function unwrapSong(raw: NeteaseSongRaw): NeteaseSongRaw {
  return raw.song ? raw.song : raw;
}

function pickArtistName(raw: NeteaseSongRaw): string {
  const r: NeteaseSongRaw = unwrapSong(raw);
  const a1: Array<NeteaseArtist> = r.artists ?? [];
  const a2: Array<NeteaseArtist> = r.ar ?? [];
  if (a1.length > 0) return a1[0].name;
  if (a2.length > 0) return a2[0].name;
  return '';
}

function pickDurationSec(raw: NeteaseSongRaw): number {
  const r: NeteaseSongRaw = unwrapSong(raw);
  const ms: number = r.duration !== undefined ? r.duration : (r.dt !== undefined ? r.dt : 0);
  return Math.floor(ms / 1000);
}

function pickCoverUrl(raw: NeteaseSongRaw): string {
  const r: NeteaseSongRaw = unwrapSong(raw);
  const u: string =
    r.album?.picUrl ??
      r.al?.picUrl ??
    r.picUrl ??
    r.coverUrl ??
    r.coverImgUrl ??
      r.album?.blurPicUrl ??
      r.al?.blurPicUrl ??
      '';
  return toHttps(u);
}

function mapSong(raw: NeteaseSongRaw, playUrl: string): Song {
  const r: NeteaseSongRaw = unwrapSong(raw);
  const song: Song = {
    id: r.id,
    name: r.name,
    artistName: pickArtistName(raw),
    coverUrl: pickCoverUrl(raw),
    durationSec: pickDurationSec(raw),
    url: playUrl
  };
  return song;
}

async function getSongUrlMap(ids: Array<number>): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map<number, string>();
  const idParam: string = ids.join(',');
  const url: string = `${BASE_URL}/song/url?id=${idParam}`;
  const resp: NeteaseSongUrlResponse = await getJson<NeteaseSongUrlResponse>(url);

  const map: Map<number, string> = new Map<number, string>();
  resp.data.forEach((item: NeteaseSongUrlInfo) => {
    map.set(item.id, item.url ?? '');
  });
  return map;
}

async function getCoverMapBySongDetail(ids: Array<number>): Promise<Map<number, string>> {
  const map: Map<number, string> = new Map<number, string>();
  if (ids.length === 0) return map;

  const idParam: string = ids.join(',');
  const url: string = `${BASE_URL}/song/detail?ids=${idParam}`;
  try {
    const resp: NeteaseSongDetailResponse = await getJson<NeteaseSongDetailResponse>(url);
    const songs: Array<NeteaseSongDetailSong> = resp.songs ?? [];
    songs.forEach((s: NeteaseSongDetailSong) => {
      const cover: string = toHttps(
        s.al?.picUrl ?? s.album?.picUrl ?? s.al?.blurPicUrl ?? s.album?.blurPicUrl ?? ''
      );
      if (cover.length > 0) {
        map.set(s.id, cover);
      }
    });
  } catch (_) {
    console.error('[ApiService] getCoverMapBySongDetail failed');
  }
  return map;
}

// ================== 对外导出 API ==================

/** 搜索歌曲（封面一部到位：必要时 song/detail 兜底补齐） */
export async function searchSongs(keyword: string): Promise<Array<Song>> {
  const encodedKeyword: string = encodeURIComponent(keyword);
  const searchUrl: string = `${BASE_URL}/search?keywords=${encodedKeyword}`;
  const searchResp: NeteaseSearchResponse = await getJson<NeteaseSearchResponse>(searchUrl);

  const rawSongs: Array<NeteaseSongRaw> = searchResp.result.songs ?? [];
  const ids: Array<number> = rawSongs.map((raw: NeteaseSongRaw) => unwrapSong(raw).id);

  // 播放 URL
  let urlMap: Map<number, string> = new Map<number, string>();
  if (ids.length > 0) {
    urlMap = await getSongUrlMap(ids);
  }

  // 初次映射
  let songs: Array<Song> = rawSongs.map((raw: NeteaseSongRaw) => {
    const id: number = unwrapSong(raw).id;
    const playUrl: string = urlMap.get(id) ?? '';
    return mapSong(raw, playUrl);
  });

  // 兜底补封面
  const needCoverIds: Array<number> = [];
  songs.forEach((s: Song) => {
    if (!s.coverUrl || s.coverUrl.length === 0) {
      needCoverIds.push(s.id);
    }
  });

  if (needCoverIds.length > 0) {
    const coverMap: Map<number, string> = await getCoverMapBySongDetail(needCoverIds.slice(0, 50));

    const patched: Array<Song> = [];
    songs.forEach((s: Song) => {
      if (s.coverUrl && s.coverUrl.length > 0) {
        patched.push(s);
      } else {
        const cover: string = coverMap.get(s.id) ?? '';
        const ns: Song = {
          id: s.id,
          name: s.name,
          artistName: s.artistName,
          coverUrl: cover,
          durationSec: s.durationSec,
          url: s.url
        };
        patched.push(ns);
      }
    });
    songs = patched;
  }

  console.info('[searchSongs] mapped first coverUrl=' + (songs.length > 0 ? songs[0].coverUrl : ''));
  return songs;
}

/** 推荐歌单（首页） */
export async function getRecommendPlaylists(): Promise<Array<PlaylistBrief>> {
  const url: string = `${BASE_URL}/personalized?limit=30`;
  const resp: NeteaseRecommendResponse = await getJson<NeteaseRecommendResponse>(url);

  let rawList: Array<NeteasePlaylistBriefRaw> = [];

  if (Array.isArray((resp as NeteaseRecommendResponseArray).result)) {
    rawList = (resp as NeteaseRecommendResponseArray).result;
  } else {
    rawList = (resp as NeteaseRecommendResponseObject).result.playlists ?? [];
  }

  const list: Array<PlaylistBrief> = rawList.map((item: NeteasePlaylistBriefRaw) => {
    const brief: PlaylistBrief = {
      id: item.id,
      name: item.name,
      coverUrl: toHttps(item.picUrl)
    };
    return brief;
  });

  return list;
}

/** 歌单详情（包含歌曲列表） */
export async function getPlaylistDetail(playlistId: number): Promise<PlaylistDetail | undefined> {
  const detailUrl: string = `${BASE_URL}/playlist/detail?id=${playlistId}`;
  const detailResp: NeteasePlaylistDetailResponse = await getJson<NeteasePlaylistDetailResponse>(detailUrl);
  if (!detailResp.playlist) return undefined;

  const tracksRaw: Array<NeteasePlaylistDetailSongRaw> = detailResp.playlist.tracks ?? [];
  const trackIds: Array<number> = tracksRaw.map((item: NeteasePlaylistDetailSongRaw) => item.id);
  const urlMap: Map<number, string> = await getSongUrlMap(trackIds);

  const tracks: Array<PlaylistTrack> = tracksRaw.map((raw: NeteasePlaylistDetailSongRaw) => {
    const playUrl: string = urlMap.get(raw.id) ?? '';
    const s: Song = mapSong(raw, playUrl);

    const track: PlaylistTrack = {
      id: s.id,
      name: s.name,
      artistName: s.artistName,
      coverUrl: s.coverUrl,
      durationSec: s.durationSec,
      url: s.url
    };
    return track;
  });

  const detail: PlaylistDetail = {
    id: detailResp.playlist.id,
    name: detailResp.playlist.name,
    coverUrl: toHttps(detailResp.playlist.coverImgUrl),
    description: detailResp.playlist.description ?? '',
    tracks
  };
  return detail;
}

// ================== 排行榜歌单 ==================

interface NeteaseTopListDetailItem {
  id: number;
  name: string;
  coverImgUrl: string;
}

interface NeteaseTopListDetailResponse {
  code: number;
  list: Array<NeteaseTopListDetailItem>;
}

export async function getTopPlaylists(limit: number = 10): Promise<Array<PlaylistBrief>> {
  const url: string = `${BASE_URL}/toplist/detail`;
  const resp: NeteaseTopListDetailResponse = await getJson<NeteaseTopListDetailResponse>(url);

  const rawList: Array<NeteaseTopListDetailItem> = resp.list ?? [];
  const sliced: Array<NeteaseTopListDetailItem> = rawList.slice(0, limit);

  const list: Array<PlaylistBrief> = sliced.map((item: NeteaseTopListDetailItem) => {
    const brief: PlaylistBrief = {
      id: item.id,
      name: item.name,
      coverUrl: toHttps(item.coverImgUrl)
    };
    return brief;
  });

  return list;
}