import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampCreateComponent } from './camp-create.component';

describe('CampCreateComponent', () => {
  let component: CampCreateComponent;
  let fixture: ComponentFixture<CampCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
