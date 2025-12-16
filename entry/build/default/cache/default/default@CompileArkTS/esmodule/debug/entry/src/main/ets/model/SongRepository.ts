import type { Song } from './Song';
export class SongRepository {
    async getRecommendedSongs(): Promise<Song[]> {
        // 模拟网络延迟
        await new Promise<void>(resolve => setTimeout(resolve, 600));
        return [
            { id: 1, title: '无名的人', artist: '毛不易' },
            { id: 2, title: '一程山路', artist: '毛不易' },
            { id: 3, title: '像我这样的人', artist: '毛不易' },
            { id: 4, title: '呓语', artist: '毛不易' },
            { id: 5, title: '消愁', artist: '毛不易' },
            { id: 6, title: '平凡的一天', artist: '毛不易' },
        ];
    }
    // [!! 1. 添加“获取最近播放”方法 !!]
    async getRecentSongs(): Promise<Song[]> {
        // 模拟网络延迟
        await new Promise<void>(resolve => setTimeout(resolve, 100)); // 快一点
        // 模拟只返回了1首歌
        return [
            { id: 101, title: 'Shape of You', artist: 'Ed Sheeran' },
        ];
    }
    // [!! 2. 添加“获取我的收藏”方法 !!]
    async getFavoriteSongs(): Promise<Song[]> {
        // 模拟网络延迟
        await new Promise<void>(resolve => setTimeout(resolve, 100)); // 快一点
        // 模拟返回了2首歌
        return [
            { id: 201, title: 'Blinding Lights', artist: 'The Weeknd' },
            { id: 202, title: 'As It Was', artist: 'Harry Styles' },
        ];
    }
}
