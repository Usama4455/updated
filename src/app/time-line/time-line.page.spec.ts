import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeLinePage } from './time-line.page';

describe('TimeLinePage', () => {
  let component: TimeLinePage;
  let fixture: ComponentFixture<TimeLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
