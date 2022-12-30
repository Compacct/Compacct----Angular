import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalVendorInteractionComponent } from './nepal-vendor-interaction.component';

describe('NepalVendorInteractionComponent', () => {
  let component: NepalVendorInteractionComponent;
  let fixture: ComponentFixture<NepalVendorInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalVendorInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalVendorInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
