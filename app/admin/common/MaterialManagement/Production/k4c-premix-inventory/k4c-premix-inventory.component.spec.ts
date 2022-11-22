import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cPremixInventoryComponent } from './k4c-premix-inventory.component';

describe('K4cPremixInventoryComponent', () => {
  let component: K4cPremixInventoryComponent;
  let fixture: ComponentFixture<K4cPremixInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cPremixInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cPremixInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
