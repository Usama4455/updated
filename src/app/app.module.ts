import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

// Providers Import
import { ConfigService } from '../providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LocationDataService } from 'src/providers/location-data/location-data.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// For Translation
import { HttpClientModule } from '@angular/common/http';

// for side menu expandable
import { Facebook } from '@ionic-native/facebook/ngx';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/pipes/pipes.module';
import { ForgotPasswordPageModule } from './modals/forgot-password/forgot-password.module';
import { TermServicesPageModule } from './modals/term-services/term-services.module';
import { BlankModalPageModule } from './modals/blank-modal/blank-modal.module';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {File} from '@ionic-native/file/ngx';
import { IonicImageLoader } from 'ionic-image-loader';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {LoginPhonePageModule} from './modals/login-phone/login-phone.module';
import {UpdateProfilePageModule} from './modals/update-profile/update-profile.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService, CONFIG, DEBUG_MODE } from '@angular/fire/analytics';
import {environment} from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodePush } from '@ionic-native/code-push/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import {LoginPhonePage} from './modals/login-phone/login-phone.page';
import {AuthGuard} from './guards/auth.guard';
import {LoginEmailPageModule} from './modals/login-email/login-email.module';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {TimeLinePageModule} from './time-line/time-line.module';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import {AngularFireStorage, AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {UserNamePageModule} from './modals/user-name/user-name.module';
import { Media } from '@ionic-native/media/ngx';
import {RecAudioPageModule} from './modals/rec-audio/rec-audio.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    BlankModalPageModule,
    ForgotPasswordPageModule,
    TermServicesPageModule,
    LoginPhonePageModule,
    UpdateProfilePageModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    IonicImageLoader.forRoot(),
    BrowserAnimationsModule,
    LoginEmailPageModule,
    TimeLinePageModule,
    UserNamePageModule,
    RecAudioPageModule,
  ],
  providers: [
    StatusBar,
    ConfigService,
    LocationDataService,
    SharedDataService,
    SplashScreen,
    AppVersion,
    SpinnerDialog,
    ThemeableBrowser,
    Geolocation,
    NativeGeocoder,
    SocialSharing,
    InAppBrowser,
    Network,
    Deeplinks,
    HTTP,
    Facebook,
    EmailComposer,
    FirebaseAuthentication,
    WebView,
    File,
    CodePush,
    ScreenOrientation,
    ScreenTrackingService,
    UserTrackingService,
      LoginPhonePage,
      AuthGuard,
    Clipboard,
    Media,
      Camera,
    ImagePicker,
    PhotoViewer,
    AngularFireStorage,
    {provide: DEBUG_MODE, useValue: true},

    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
