import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclFinishMasterProductComponent } from './micl-finish-master-product.component';

describe('MiclFinishMasterProductComponent', () => {
  let component: MiclFinishMasterProductComponent;
  let fixture: ComponentFixture<MiclFinishMasterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclFinishMasterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclFinishMasterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
