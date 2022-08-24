import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodReceiveDetailsComponent } from './good-receive-details.component';

describe('GoodReceiveDetailsComponent', () => {
  let component: GoodReceiveDetailsComponent;
  let fixture: ComponentFixture<GoodReceiveDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodReceiveDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodReceiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
