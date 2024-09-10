import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var YT: any;

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private player: any;
  private currentSongIndex = 0;
  private playlist: any[] = [];
  private isPlayerReady = false;

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<any>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  initializePlayer(elementId: string) {
    if (!this.isPlayerReady) {
      this.player = new YT.Player(elementId, {
        height: '0',
        width: '0',
        events: {
          'onReady': () => {
            this.isPlayerReady = true;
          },
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
    }
  }

  setPlaylist(playlist: any[]) {
    this.playlist = playlist;
  }

  play(index?: number) {
    if (index !== undefined) {
      this.currentSongIndex = index;
    }
    if (this.playlist[this.currentSongIndex]) {
      if (this.isPlayerReady) {
        this.player.loadVideoById(this.playlist[this.currentSongIndex].id.videoId);
        this.startTimeUpdate();
      } else {
        const checkPlayerReady = setInterval(() => {
          if (this.isPlayerReady) {
            clearInterval(checkPlayerReady);
            this.player.loadVideoById(this.playlist[this.currentSongIndex].id.videoId);
            this.startTimeUpdate();
          }
        }, 100);
      }
      this.currentSongSubject.next(this.playlist[this.currentSongIndex]);
    }
  }

  pause() {
    if (this.isPlayerReady) {
      this.player.pauseVideo();
    }
  }

  resume() {
    if (this.isPlayerReady) {
      this.player.playVideo();
    }
  }

  next() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.play();
  }

  previous() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    this.play();
  }

  setShuffle(isShuffleOn: boolean) {
    // Implementar lógica de shuffle
  }

  setRepeatMode(mode: string) {
    // Implementar lógica de repetición
  }

  private onPlayerStateChange(event: any) {
    this.isPlayingSubject.next(event.data === YT.PlayerState.PLAYING);
  }

  private startTimeUpdate() {
    setInterval(() => {
      if (this.isPlayerReady && this.player.getCurrentTime) {
        this.currentTimeSubject.next(this.player.getCurrentTime());
        this.durationSubject.next(this.player.getDuration());
      }
    }, 1000);
  }
}
