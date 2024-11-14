import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSessionCompleteComponent } from './package-session-complete.component';

describe('PackageSessionCompleteComponent', () => {
  let component: PackageSessionCompleteComponent;
  let fixture: ComponentFixture<PackageSessionCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSessionCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSessionCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
