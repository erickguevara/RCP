import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeCultivoPage } from './home-cultivo.page';

describe('HomeCultivoPage', () => {
  let component: HomeCultivoPage;
  let fixture: ComponentFixture<HomeCultivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCultivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
