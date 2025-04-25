import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrGeneratorComponentComponent } from './qr-generator-component.component';

describe('QrGeneratorComponentComponent', () => {
  let component: QrGeneratorComponentComponent;
  let fixture: ComponentFixture<QrGeneratorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrGeneratorComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrGeneratorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
