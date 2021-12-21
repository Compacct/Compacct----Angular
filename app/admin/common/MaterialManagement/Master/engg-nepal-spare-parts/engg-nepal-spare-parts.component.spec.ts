import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnggNepalSparePartsComponent } from './engg-nepal-spare-parts.component';

describe('EnggNepalSparePartsComponent', () => {
  let component: EnggNepalSparePartsComponent;
  let fixture: ComponentFixture<EnggNepalSparePartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnggNepalSparePartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnggNepalSparePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
