import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingPackageMasterComponent } from './hearing-package-master.component';

describe('HearingPackageMasterComponent', () => {
  let component: HearingPackageMasterComponent;
  let fixture: ComponentFixture<HearingPackageMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingPackageMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingPackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
