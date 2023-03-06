import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4CBillDateUpdateComponent } from './k4-c-bill-date-update.component';

describe('K4CBillDateUpdateComponent', () => {
  let component: K4CBillDateUpdateComponent;
  let fixture: ComponentFixture<K4CBillDateUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4CBillDateUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4CBillDateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
