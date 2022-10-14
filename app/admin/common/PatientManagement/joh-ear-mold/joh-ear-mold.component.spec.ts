import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JOHEarMoldComponent } from './joh-ear-mold.component';

describe('JOHEarMoldComponent', () => {
  let component: JOHEarMoldComponent;
  let fixture: ComponentFixture<JOHEarMoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JOHEarMoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JOHEarMoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
