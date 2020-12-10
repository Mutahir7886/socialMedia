import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDetailComponent } from './resume-detail.component';

describe('ResumeDetailComponent', () => {
  let component: ResumeDetailComponent;
  let fixture: ComponentFixture<ResumeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
