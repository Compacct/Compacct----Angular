import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoMasterSkuComponent } from './tuto-master-sku.component';

describe('TutoMasterSkuComponent', () => {
  let component: TutoMasterSkuComponent;
  let fixture: ComponentFixture<TutoMasterSkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoMasterSkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoMasterSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
