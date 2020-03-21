import { TestBed, async, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { PhotosService } from 'src/app/photos.service';
import { photosMock } from 'src/fixtures/photos.mock';
import { environment } from 'src/environments/environment';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PhotosService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('should load photos via Callbacks', () => {
    expect(component.photosFromCallback).toEqual(null);

    const photosService = TestBed.inject(PhotosService);
    spyOn(photosService, 'fetchPhotosWithCallback').and.callFake((cb) => cb(photosMock));
    component.setupPhotosFromCallback();

    expect(component.photosFromCallback).toEqual(jasmine.any(Array));
    expect(component.photosFromCallback.length).toEqual(3);
  });

  it('should load photos via Promises', fakeAsync(() => {
    expect(component.photosFromPromises).toEqual(null);

    component.setupPhotosFromPromises();

    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);
    const testRequest = httpMock.expectOne(environment.photosUrl);
    testRequest.flush(photosMock);

    tick();

    expect(component.photosFromPromises).toEqual(jasmine.any(Array));
    expect(component.photosFromPromises.length).toEqual(3);
  }));

  it('should load photos via Observables', () => {
    expect(component.photosFromObservables).toEqual(null);

    component.setupPhotosFromObservables();

    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);
    const testRequest = httpMock.expectOne(environment.photosUrl);
    testRequest.flush(photosMock);

    expect(component.photosFromObservables).toEqual(jasmine.any(Array));
    expect(component.photosFromObservables.length).toEqual(3);
  });
});
