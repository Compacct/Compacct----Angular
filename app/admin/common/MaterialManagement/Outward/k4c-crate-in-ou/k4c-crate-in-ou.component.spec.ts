import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cCrateInOuComponent } from './k4c-crate-in-ou.component';

describe('K4cCrateInOuComponent', () => {
  let component: K4cCrateInOuComponent;
  let fixture: ComponentFixture<K4cCrateInOuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cCrateInOuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cCrateInOuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
