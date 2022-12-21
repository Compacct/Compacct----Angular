import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclWastageMasterProductComponent } from './micl-wastage-master-product.component';

describe('MiclWastageMasterProductComponent', () => {
  let component: MiclWastageMasterProductComponent;
  let fixture: ComponentFixture<MiclWastageMasterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclWastageMasterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclWastageMasterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
