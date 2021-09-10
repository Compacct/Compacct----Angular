import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctDocumentComponent } from './compacct-document.component';

describe('CompacctDocumentComponent', () => {
  let component: CompacctDocumentComponent;
  let fixture: ComponentFixture<CompacctDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
