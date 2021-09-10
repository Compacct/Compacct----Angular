import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cFactoryIndentAdvanceComponent } from './k4c-factory-indent-advance.component';

describe('K4cFactoryIndentAdvanceComponent', () => {
  let component: K4cFactoryIndentAdvanceComponent;
  let fixture: ComponentFixture<K4cFactoryIndentAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cFactoryIndentAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cFactoryIndentAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
