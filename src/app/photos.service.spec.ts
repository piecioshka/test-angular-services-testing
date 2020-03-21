import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import 'jasmine-ajax';
import { PhotosService } from './photos.service';
import { environment } from 'src/environments/environment';
import { photosMock } from 'src/fixtures/photos.mock';

describe('PhotosService', () => {
  let photosService: PhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HttpClient
      ]
    });
    photosService = TestBed.inject(PhotosService);
  });

  describe('Spy methods', () => {
    it('should use XMLHttpRequest', () => {
      spyOn(XMLHttpRequest.prototype, 'send');
      photosService.fetchPhotosWithCallback(() => null);
      expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
      expect(XMLHttpRequest.prototype.send).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith();
    });
  });

  describe('Get Photos', () => {
    describe('via basic return', () => {
      it('should returns photos', () => {
        const photos = photosService.getPhotos();
        expect(photos.length).toEqual(3);
      });
    });

    describe('via Callbacks', () => {
      it('should return photos', (done) => {
        photosService.getPhotosCallback((photos) => {
          expect(photos.length).toEqual(3);
          done();
        });
      });
    });

    describe('via Promises', () => {
      it('should return photos', (done) => {
        const _clock_ = jasmine.clock();
        _clock_.install();
        photosService.getPhotosPromise()
          .then((photos) => {
            expect(photos.length).toEqual(3);
            done();
          });
        _clock_.tick(10 * 1000);
        _clock_.uninstall();
      });
    });

    describe('via Observables', () => {
      it('should return photos', (done) => {
        const _clock_ = jasmine.clock();
        _clock_.install();
        _clock_.mockDate(new Date(0)); // Is needed for delay() operator
        photosService.getPhotosObservable()
          .subscribe({
            next: (photos) => {
              expect(photos.length).toEqual(3);
              done();
            }
          });
        _clock_.tick(10 * 1000);
        _clock_.uninstall();
      });
    });
  });

  describe('Fetch Photos', () => {
    describe('via Callbacks', () => {
      it('should fetch photos', (done) => {
        jasmine.Ajax.install();

        photosService.fetchPhotosWithCallback((photos) => {
          expect(photos).toEqual(jasmine.any(Array));
          expect(photos.length).toBeGreaterThan(1);
          done();
          jasmine.Ajax.uninstall();
        });

        const request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({
          responseText: JSON.stringify(photosMock)
        });
      });
    });

    describe('via Promises', () => {
      it('should fetch photos', async () => {
        // 0. Before
        const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

        // 1. Register to make HTTP request
        const response = photosService.fetchPhotosWithPromise();

        // 2. Mocking & flushing response
        const backend = httpMock.expectOne(environment.photosUrl);
        backend.flush(photosMock);

        // 3. Receive response
        const photos = await response;

        // 4. Assertion
        expect(photos.length).toEqual(3);
      });
    });

    describe('via Observables', () => {
      it('should fetch photos', () => {
        // 0. Before
        const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

        // 1. Register subscription (start listen)
        photosService.fetchPhotosWithObservables().subscribe({
          next: (photos) => {
            expect(photos.length).toEqual(3);
          }
        });

        // 2. Flushing with mocks data
        const testRequest = httpMock.expectOne(environment.photosUrl);
        testRequest.flush(photosMock);
      });
    });
  });
});
