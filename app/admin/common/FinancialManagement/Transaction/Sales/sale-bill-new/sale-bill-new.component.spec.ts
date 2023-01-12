import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBillNewComponent } from './sale-bill-new.component';

describe('SaleBillNewComponent', () => {
  let component: SaleBillNewComponent;
  let fixture: ComponentFixture<SaleBillNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleBillNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleBillNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
