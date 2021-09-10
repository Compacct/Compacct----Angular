import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoDsBillComponent } from './tuto-ds-bill.component';

describe('TutoDsBillComponent', () => {
  let component: TutoDsBillComponent;
  let fixture: ComponentFixture<TutoDsBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoDsBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoDsBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
