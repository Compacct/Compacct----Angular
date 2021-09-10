import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctSynComponent } from './compacct.syn.component';

describe('CompacctSynComponent', () => {
  let component: CompacctSynComponent;
  let fixture: ComponentFixture<CompacctSynComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctSynComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctSynComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
