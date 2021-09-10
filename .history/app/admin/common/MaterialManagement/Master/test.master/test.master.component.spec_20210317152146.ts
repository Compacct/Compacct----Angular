import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Test.MasterComponent } from './test.master.component';

describe('Test.MasterComponent', () => {
  let component: Test.MasterComponent;
  let fixture: ComponentFixture<Test.MasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Test.MasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test.MasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
