import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEditFromAdminComponent } from './bill-edit-from-admin.component';

describe('BillEditFromAdminComponent', () => {
  let component: BillEditFromAdminComponent;
  let fixture: ComponentFixture<BillEditFromAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillEditFromAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillEditFromAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
