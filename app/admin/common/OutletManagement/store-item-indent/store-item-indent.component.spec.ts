import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemIndentComponent } from './store-item-indent.component';

describe('StoreItemIndentComponent', () => {
  let component: StoreItemIndentComponent;
  let fixture: ComponentFixture<StoreItemIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreItemIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreItemIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
