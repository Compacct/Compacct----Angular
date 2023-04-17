import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTransectionComponent } from './transfer-transection.component';

describe('TransferTransectionComponent', () => {
  let component: TransferTransectionComponent;
  let fixture: ComponentFixture<TransferTransectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTransectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTransectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
