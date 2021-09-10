import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4CDispatchToOutletComponent } from './k4-c-dispatch-to-outlet.component';

describe('K4CDispatchToOutletComponent', () => {
  let component: K4CDispatchToOutletComponent;
  let fixture: ComponentFixture<K4CDispatchToOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4CDispatchToOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4CDispatchToOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
