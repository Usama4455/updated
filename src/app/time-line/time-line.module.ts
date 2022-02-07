import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeLinePageRoutingModule } from './time-line-routing.module';

import { TimeLinePage } from './time-line.page';
import {TimelineMsgComponent} from '../../components/timeline-msg/timeline-msg.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TimeLinePageRoutingModule
    ],
    exports: [
        TimelineMsgComponent
    ],
    declarations: [TimeLinePage, TimelineMsgComponent]
})
export class TimeLinePageModule {}
