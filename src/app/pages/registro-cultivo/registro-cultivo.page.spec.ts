import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCultivoPage } from './registro-cultivo.page';

describe('RegistroCultivoPage', () => {
  let component: RegistroCultivoPage;
  let fixture: ComponentFixture<RegistroCultivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCultivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
