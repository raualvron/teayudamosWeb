import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnsComponent } from './alumns.component';

describe('AlumnsComponent', () => {
  let component: AlumnsComponent;
  let fixture: ComponentFixture<AlumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
