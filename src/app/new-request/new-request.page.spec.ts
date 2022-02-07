import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewRequestPage } from './new-request.page';

describe('NewRequestPage', () => {
  let component: NewRequestPage;
  let fixture: ComponentFixture<NewRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
