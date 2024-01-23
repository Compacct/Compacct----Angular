import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCSahaProfundComponent } from './cc-saha-profund.component';

describe('CCSahaProfundComponent', () => {
  let component: CCSahaProfundComponent;
  let fixture: ComponentFixture<CCSahaProfundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCSahaProfundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCSahaProfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
