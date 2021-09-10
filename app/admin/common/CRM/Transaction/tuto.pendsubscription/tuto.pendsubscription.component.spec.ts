import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tuto.PendsubscriptionComponent } from './tuto.pendsubscription.component';

describe('Tuto.PendsubscriptionComponent', () => {
  let component: Tuto.PendsubscriptionComponent;
  let fixture: ComponentFixture<Tuto.PendsubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tuto.PendsubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tuto.PendsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
