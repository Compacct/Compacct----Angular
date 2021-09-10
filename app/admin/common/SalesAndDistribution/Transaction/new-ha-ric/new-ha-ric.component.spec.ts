import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHaRicComponent } from './new-ha-ric.component';

describe('NewHaRicComponent', () => {
  let component: NewHaRicComponent;
  let fixture: ComponentFixture<NewHaRicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHaRicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHaRicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
