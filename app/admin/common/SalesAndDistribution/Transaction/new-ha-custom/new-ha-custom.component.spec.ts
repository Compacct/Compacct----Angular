import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHaCustomComponent } from './new-ha-custom.component';

describe('NewHaCustomComponent', () => {
  let component: NewHaCustomComponent;
  let fixture: ComponentFixture<NewHaCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHaCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHaCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
