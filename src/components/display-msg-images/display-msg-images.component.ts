import {Component, Input, OnInit} from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display-msg-images',
  templateUrl: './display-msg-images.component.html',
  styleUrls: ['./display-msg-images.component.scss'],
})
export class DisplayMsgImagesComponent implements OnInit {
  @Input('imageURI') i;//image path
  @Input('index') index;//image index
  @Output() deleteEvent = new EventEmitter<string>();


  constructor(
      public webView: WebView,
  ) {
  }


  deleteImage(): void {
    this.deleteEvent.emit(this.index);
  }

  ngOnInit() {
    console.log(this.index);
  }

}
