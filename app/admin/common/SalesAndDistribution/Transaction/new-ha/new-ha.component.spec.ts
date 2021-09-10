import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHAComponent } from './new-ha.component';

describe('NewHAComponent', () => {
  let component: NewHAComponent;
  let fixture: ComponentFixture<NewHAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
