import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cCreditNoteBrowseComponent } from './k4c-credit-note-browse.component';

describe('K4cCreditNoteBrowseComponent', () => {
  let component: K4cCreditNoteBrowseComponent;
  let fixture: ComponentFixture<K4cCreditNoteBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cCreditNoteBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cCreditNoteBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
