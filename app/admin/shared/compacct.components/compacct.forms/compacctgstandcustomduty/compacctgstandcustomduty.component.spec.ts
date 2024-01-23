import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctgstandcustomdutyComponent } from './compacctgstandcustomduty.component';

describe('CompacctgstandcustomdutyComponent', () => {
  let component: CompacctgstandcustomdutyComponent;
  let fixture: ComponentFixture<CompacctgstandcustomdutyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctgstandcustomdutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctgstandcustomdutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
