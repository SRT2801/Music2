import { Component } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { PlaylistService } from '../../services/playlist.service';
import { MusicService } from '../../services/music.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var YT: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  query: string = '';
  searchResults: any[] = [];

  constructor(
    private youtubeService: YoutubeService,
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private toastController: ToastController,
    private router: Router
  ) {}

  // Método para buscar canciones cuando se ingresa una consulta
  searchSongs() {
    if (this.query.trim().length < 3) {
      this.searchResults = [];
      return;
    }

    this.youtubeService.searchSongs(this.query).subscribe(
      response => {
        this.searchResults = response.items;
      },
      error => {
        console.error('Error en la búsqueda:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    );
  }

  // Método para reproducir una canción
  playSong(song: any) {
    this.playlistService.addSongToPlaylist(song);
    const playlist = this.playlistService.getPlaylist();
    this.musicService.setPlaylist(playlist);
    this.musicService.play(playlist.length - 1);
    this.router.navigate(['/player']);
  }

  // Método para agregar una canción a la playlist
  async addToPlaylist(song: any) {
    const added = this.playlistService.addSongToPlaylist(song);
    if (added) {
      await this.presentToast('Canción agregada a la playlist correctamente');
    } else {
      await this.presentToast('Esta canción ya está en la playlist', 'warning');
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
