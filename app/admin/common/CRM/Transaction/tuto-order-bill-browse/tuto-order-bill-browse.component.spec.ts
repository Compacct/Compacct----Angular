import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoOrderBillBrowseComponent } from './tuto-order-bill-browse.component';

describe('TutoOrderBillBrowseComponent', () => {
  let component: TutoOrderBillBrowseComponent;
  let fixture: ComponentFixture<TutoOrderBillBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoOrderBillBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoOrderBillBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
