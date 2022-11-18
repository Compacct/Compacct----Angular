import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JohValidationProcessComponent } from './joh-validation-process.component';

describe('JohValidationProcessComponent', () => {
  let component: JohValidationProcessComponent;
  let fixture: ComponentFixture<JohValidationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JohValidationProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JohValidationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
