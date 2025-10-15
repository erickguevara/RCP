import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotacionPage } from './rotacion.page';

describe('RotacionPage', () => {
  let component: RotacionPage;
  let fixture: ComponentFixture<RotacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RotacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
