import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayautComponent } from './layaut.component';

describe('LayautComponent', () => {
  let component: LayautComponent;
  let fixture: ComponentFixture<LayautComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayautComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
