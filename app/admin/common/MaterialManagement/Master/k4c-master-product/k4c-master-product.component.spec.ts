import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cMasterProductComponent } from './k4c-master-product.component';

describe('K4cMasterProductComponent', () => {
  let component: K4cMasterProductComponent;
  let fixture: ComponentFixture<K4cMasterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cMasterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cMasterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
