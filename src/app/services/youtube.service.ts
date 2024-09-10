import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  apiKey = 'AIzaSyB5IeSi4T4VvwPUPxfwImXoP8QnZ32rrcM';  // Coloca aquí tu clave API de YouTube

  constructor(private http: HttpClient) { }

  // Método para buscar canciones en YouTube
  searchSongs(query: string): Observable<any> {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${this.apiKey}&type=video`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener detalles del video/canción
  getVideoDetails(videoId: string): Observable<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Un error ocurrió:', error.error.message);
    } else {
      console.error(
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error.error.message}`
      );
    }
    return throwError('Algo salió mal; por favor, inténtalo de nuevo más tarde.');
  }
}
