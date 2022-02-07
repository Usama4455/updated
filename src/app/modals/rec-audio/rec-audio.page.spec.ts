import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecAudioPage } from './rec-audio.page';

describe('RecAudioPage', () => {
  let component: RecAudioPage;
  let fixture: ComponentFixture<RecAudioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecAudioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecAudioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
