import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnaceMisInputComponent } from './furnace-mis-input.component';

describe('FurnaceMisInputComponent', () => {
  let component: FurnaceMisInputComponent;
  let fixture: ComponentFixture<FurnaceMisInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FurnaceMisInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnaceMisInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
