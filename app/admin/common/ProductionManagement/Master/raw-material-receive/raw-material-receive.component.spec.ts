import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialReceiveComponent } from './raw-material-receive.component';

describe('RawMaterialReceiveComponent', () => {
  let component: RawMaterialReceiveComponent;
  let fixture: ComponentFixture<RawMaterialReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
