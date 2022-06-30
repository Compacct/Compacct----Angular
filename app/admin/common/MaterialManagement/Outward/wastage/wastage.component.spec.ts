import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WastageComponent } from './wastage.component';

describe('WastageComponent', () => {
  let component: WastageComponent;
  let fixture: ComponentFixture<WastageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WastageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WastageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
