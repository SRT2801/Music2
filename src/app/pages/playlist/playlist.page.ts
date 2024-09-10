import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { MusicService } from '../../services/music.service';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
  playlist: any[] = [];

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private router: Router,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
    this.updatePlaylist();
    this.musicService.initializePlayer('youtube-player');
  }

  updatePlaylist() {
    this.playlist = this.playlistService.getPlaylist();
    this.musicService.setPlaylist(this.playlist);
    this.animateItems();
  }

  playSong(index: number) {
    this.musicService.play(index);
    this.router.navigate(['/player']);
  }

  private animateItems() {
    const animation = this.animationCtrl.create()
      .addElement(document.querySelectorAll('.song-item'))
      .duration(300)
      .easing('ease-out')
      .fromTo('opacity', 0, 1)
      .fromTo('transform', 'translateY(20px)', 'translateY(0)');

    animation.play();
  }
}
