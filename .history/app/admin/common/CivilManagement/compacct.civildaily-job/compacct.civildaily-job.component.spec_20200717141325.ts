import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Compacct.CivildailyJobComponent } from './compacct.civildaily-job.component';

describe('Compacct.CivildailyJobComponent', () => {
  let component: Compacct.CivildailyJobComponent;
  let fixture: ComponentFixture<Compacct.CivildailyJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Compacct.CivildailyJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Compacct.CivildailyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
