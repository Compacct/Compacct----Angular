import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cCreateStartProductionComponent } from './k4c-create-start-production.component';

describe('K4cCreateStartProductionComponent', () => {
  let component: K4cCreateStartProductionComponent;
  let fixture: ComponentFixture<K4cCreateStartProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cCreateStartProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cCreateStartProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
