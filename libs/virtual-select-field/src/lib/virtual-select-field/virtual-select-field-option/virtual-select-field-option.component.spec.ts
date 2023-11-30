import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualSelectFieldOptionComponent } from './virtual-select-field-option.component';

describe('VirtualSelectFieldOptionComponent', () => {
  let component: VirtualSelectFieldOptionComponent<number>;
  let fixture: ComponentFixture<VirtualSelectFieldOptionComponent<number>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualSelectFieldOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirtualSelectFieldOptionComponent<number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
