import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoCashConfirmComponent } from './tuto-cash-confirm.component';

describe('TutoCashConfirmComponent', () => {
  let component: TutoCashConfirmComponent;
  let fixture: ComponentFixture<TutoCashConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoCashConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoCashConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
