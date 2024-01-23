import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdbComponent } from './rdb.component';

describe('RdbComponent', () => {
  let component: RdbComponent;
  let fixture: ComponentFixture<RdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
