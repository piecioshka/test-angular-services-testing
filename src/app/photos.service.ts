import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Photos } from 'src/app/photos.interface';
import { environment } from 'src/environments/environment';
import { photosMock } from 'src/fixtures/photos.mock';

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
    return photosMock;
  }

  getPhotosCallback(cb: (photos: Photos) => void) {
    cb(photosMock);
  }

  getPhotosPromise(): Promise<Photos> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(photosMock);
      }, TEN_SECOND);
    });
  }

  getPhotosObservable() {
    return of(photosMock).pipe(
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
}
