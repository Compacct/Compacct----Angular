import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMasterComponent } from './test.master.component';

describe('TestMasterComponent', () => {
  let component: TestMasterComponent;
  let fixture: ComponentFixture<TestMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
