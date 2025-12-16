import type { Song } from '../model/Song';
import { SongRepository } from "@normalized:N&&&entry/src/main/ets/model/SongRepository&";
export class MyPageViewModel {
    private songRepo: SongRepository = new SongRepository();
    public recommendedSongs: Song[] = [];
    public recentSongs: Song[] = []; // 新增
    public favoriteSongs: Song[] = []; // 新增
    public lastPlayedSong: Song | null = null;
    public firstFavoriteSong: Song | null = null;
    public isLoading: boolean = true;
    async loadPageData() {
        this.isLoading = true;
        try {
            const allData = await Promise.all([
                this.songRepo.getRecommendedSongs(),
                this.songRepo.getRecentSongs(),
                this.songRepo.getFavoriteSongs()
            ]);
            const recData = allData[0];
            const recentData = allData[1];
            const favData = allData[2];
            this.recommendedSongs = recData;
            this.recentSongs = recentData; // 新增
            this.favoriteSongs = favData; // 新增
            this.lastPlayedSong = recentData.length > 0 ? recentData[0] : null;
            this.firstFavoriteSong = favData.length > 0 ? favData[0] : null;
        }
        finally {
            this.isLoading = false;
        }
    }
}
