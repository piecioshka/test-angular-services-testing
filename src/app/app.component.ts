import { Component, OnInit } from '@angular/core';
import { Photos } from 'src/app/photos.interface';
import { PhotosService } from 'src/app/photos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  photosFromCallback: Photos = null;
  photosFromPromises: Photos = null;
  photosFromObservables: Photos = null;

  constructor(
    private photos: PhotosService
  ) { }

  ngOnInit() {
    this.setupPhotosFromCallback();
    this.setupPhotosFromPromises();
    this.setupPhotosFromObservables();
  }

  setupPhotosFromCallback() {
    this.photos.fetchPhotosWithCallback((response) => {
      this.photosFromCallback = response;
    });
  }

  async setupPhotosFromPromises() {
    this.photosFromPromises = await this.photos.fetchPhotosWithPromise();
  }

  setupPhotosFromObservables() {
    this.photos.fetchPhotosWithObservables()
      .subscribe({
        next: (response) => {
          this.photosFromObservables = response;
        }
      });
  }
}
