import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  public slides = [
    { image: "assets/intro/frame_1.png", title: "Browse Products", icon: "home", description: "" },
    { image: "assets/intro/frame_2.png", title: "Share Products", icon: "share", description: "" },
    { image: "assets/intro/frame_3.png", title: "Place Order on Customer Behalf", icon: "cart", description: "" },
    { image: "assets/intro/frame_4.png", title: "Add Your Margin", icon: "md-list-box", description: "" },
    { image: "assets/intro/frame_5.png", title: "Earn Money", icon: "calendar", description: "" }
  ];

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
  ) {
  }

  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  ngOnInit() {
  }

}
