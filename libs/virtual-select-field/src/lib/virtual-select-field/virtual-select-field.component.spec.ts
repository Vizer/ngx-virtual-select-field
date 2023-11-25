import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualSelectFieldComponent } from './virtual-select-field.component';

describe('VirtualSelectFieldComponent', () => {
  let component: VirtualSelectFieldComponent;
  let fixture: ComponentFixture<VirtualSelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualSelectFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirtualSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
