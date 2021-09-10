import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoWslkinleadComponent } from './tuto.wslkinlead.component';

describe('TutoWslkinleadComponent', () => {
  let component: TutoWslkinleadComponent;
  let fixture: ComponentFixture<TutoWslkinleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoWslkinleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoWslkinleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
