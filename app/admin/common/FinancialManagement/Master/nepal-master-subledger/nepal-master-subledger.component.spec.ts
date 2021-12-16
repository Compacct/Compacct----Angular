import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalMasterSubledgerComponent } from './nepal-master-subledger.component';

describe('NepalMasterSubledgerComponent', () => {
  let component: NepalMasterSubledgerComponent;
  let fixture: ComponentFixture<NepalMasterSubledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalMasterSubledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalMasterSubledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
