import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cFactoryReturnComponent } from './k4c-factory-return.component';

describe('K4cFactoryReturnComponent', () => {
  let component: K4cFactoryReturnComponent;
  let fixture: ComponentFixture<K4cFactoryReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cFactoryReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cFactoryReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
