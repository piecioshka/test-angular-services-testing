import {
  TestBed,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
} from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppComponent } from "./app.component";
import { PhotosService } from "src/app/photos.service";
import { photosFactory } from "src/fixtures/photos.fixture";
import { environment } from "src/environments/environment";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [PhotosService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it("should load photos via Callbacks", () => {
    expect(component.photosFromCallback).toEqual(null);

    const photosService = TestBed.inject(PhotosService);
    spyOn(photosService, "fetchPhotosWithCallback").and.callFake((cb) =>
      cb(photosFactory())
    );
    component.setupPhotosFromCallback();

    expect(component.photosFromCallback).toEqual(jasmine.any(Array));
    expect(component.photosFromCallback.length).toEqual(3);
  });

  it("should load photos via Promises", async () => {
    expect(component.photosFromPromises).toEqual(null);

    const response = component.setupPhotosFromPromises();

    const httpMock = TestBed.inject(HttpTestingController);
    const testRequest = httpMock.expectOne(environment.photosUrl);
    testRequest.flush(photosFactory());

    await response;

    expect(component.photosFromPromises).toEqual(jasmine.any(Array));
    expect(component.photosFromPromises.length).toEqual(3);
  });

  it("should load photos via Observables", () => {
    expect(component.photosFromObservables).toEqual(null);

    component.setupPhotosFromObservables();

    const httpMock = TestBed.inject(HttpTestingController);
    const testRequest = httpMock.expectOne(environment.photosUrl);
    testRequest.flush(photosFactory());

    expect(component.photosFromObservables).toEqual(jasmine.any(Array));
    expect(component.photosFromObservables.length).toEqual(3);
  });
});
