import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyChatsPage } from './my-chats.page';

describe('MyChatsPage', () => {
  let component: MyChatsPage;
  let fixture: ComponentFixture<MyChatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyChatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyChatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
