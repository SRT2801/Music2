import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit, OnDestroy {
  isPlaying = false;
  currentSong: any;
  currentTime = '0:00';
  duration = '0:00';
  progress = 0;
  isShuffleOn = false;
  repeatMode = 'off'; // 'off', 'all', 'one'
  private subscriptions: Subscription[] = [];

  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.musicService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
      }),
      this.musicService.currentSong$.subscribe(song => {
        this.currentSong = song;
        this.resetPlaybackInfo();
      }),
      this.musicService.currentTime$.subscribe(time => {
        this.currentTime = this.formatTime(time);
        this.updateProgress();
      }),
      this.musicService.duration$.subscribe(duration => {
        this.duration = this.formatTime(duration);
        this.updateProgress();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.musicService.pause();
    } else {
      this.musicService.resume();
    }
  }

  previous() {
    this.musicService.previous();
  }

  next() {
    this.musicService.next();
  }

  shuffle() {
    this.isShuffleOn = !this.isShuffleOn;
    this.musicService.setShuffle(this.isShuffleOn);
  }

  toggleRepeat() {
    switch (this.repeatMode) {
      case 'off':
        this.repeatMode = 'all';
        break;
      case 'all':
        this.repeatMode = 'one';
        break;
      case 'one':
        this.repeatMode = 'off';
        break;
    }
    this.musicService.setRepeatMode(this.repeatMode);
  }

  private resetPlaybackInfo() {
    this.currentTime = '0:00';
    this.duration = '0:00';
    this.progress = 0;
  }

  private updateProgress() {
    const currentSeconds = this.timeToSeconds(this.currentTime);
    const totalSeconds = this.timeToSeconds(this.duration);
    this.progress = totalSeconds > 0 ? currentSeconds / totalSeconds : 0;
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private timeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }
}
