import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserNamePage } from './user-name.page';

describe('UserNamePage', () => {
  let component: UserNamePage;
  let fixture: ComponentFixture<UserNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
