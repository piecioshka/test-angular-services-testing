import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Photos } from 'src/app/photos.interface';
import { SaveResponse } from 'src/app/response.interface';
import { environment } from 'src/environments/environment';
import { photosFactory } from 'src/fixtures/photos.fixture';

const ONE_SECOND = 1000;
const TEN_SECOND = ONE_SECOND * 10;

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(
    private http: HttpClient
  ) { }

  getPhotos(): Photos {
    return photosFactory();
  }

  getPhotosCallback(cb: (photos: Photos) => void) {
    cb(photosFactory());
  }

  getPhotosPromise(): Promise<Photos> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(photosFactory());
      }, TEN_SECOND);
    });
  }

  getPhotosObservable() {
    return of(photosFactory()).pipe(
      delay(TEN_SECOND)
    );
  }

  fetchPhotosWithCallback(cb: (photos: Photos) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', environment.photosUrl, true);
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      cb(response);
    });
    xhr.send();
  }

  fetchPhotosWithPromise(): Promise<Photos> {
    return this.http.get<Photos>(environment.photosUrl).toPromise();
  }

  fetchPhotosWithObservables(): Observable<Photos> {
    return this.http.get<Photos>(environment.photosUrl);
  }

  sendPhotosWithCallback(photos: Photos, cb: (res: SaveResponse) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', environment.photosUrl, true);
    xhr.addEventListener('load', () => {
      cb({ status: true });
    });
    xhr.send(JSON.stringify(photos));
  }

  sendPhotosWithPromise(photos: Photos): Promise<SaveResponse> {
    return this.http.post<SaveResponse>(environment.photosUrl, {
        body: JSON.stringify(photos)
    }).toPromise();
  }

  sendPhotosWithObservables(photos: Photos): Observable<SaveResponse> {
    return this.http.post<SaveResponse>(environment.photosUrl, {
        body: JSON.stringify(photos)
    });
  }
}
