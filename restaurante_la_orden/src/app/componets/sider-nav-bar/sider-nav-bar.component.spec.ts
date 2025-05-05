import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderNavBarComponent } from './sider-nav-bar.component';

describe('SiderNavBarComponent', () => {
  let component: SiderNavBarComponent;
  let fixture: ComponentFixture<SiderNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiderNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiderNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
