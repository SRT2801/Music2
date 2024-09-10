import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playlist: any[] = [];

  constructor() {}

  // Método para añadir una canción a la playlist
  addSongToPlaylist(song: any): boolean {
    const songExists = this.playlist.some(item => item.id.videoId === song.id.videoId);
    if (!songExists) {
      this.playlist.push(song);
      return true;
    }
    return false;
  }

  // Método para obtener la playlist
  getPlaylist() {
    return this.playlist;
  }
}
