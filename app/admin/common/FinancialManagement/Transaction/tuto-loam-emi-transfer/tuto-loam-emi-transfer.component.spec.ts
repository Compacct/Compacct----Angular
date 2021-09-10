import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoLoamEmiTransferComponent } from './tuto-loam-emi-transfer.component';

describe('TutoLoamEmiTransferComponent', () => {
  let component: TutoLoamEmiTransferComponent;
  let fixture: ComponentFixture<TutoLoamEmiTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoLoamEmiTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoLoamEmiTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
