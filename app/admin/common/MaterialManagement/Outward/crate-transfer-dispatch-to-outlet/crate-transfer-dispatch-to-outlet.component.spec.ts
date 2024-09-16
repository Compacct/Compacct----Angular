import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrateTransferDispatchToOutletComponent } from './crate-transfer-dispatch-to-outlet.component';

describe('CrateTransferDispatchToOutletComponent', () => {
  let component: CrateTransferDispatchToOutletComponent;
  let fixture: ComponentFixture<CrateTransferDispatchToOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrateTransferDispatchToOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrateTransferDispatchToOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
