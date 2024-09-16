import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBatchNumberComponent } from './change-batch-number.component';

describe('ChangeBatchNumberComponent', () => {
  let component: ChangeBatchNumberComponent;
  let fixture: ComponentFixture<ChangeBatchNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeBatchNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBatchNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
