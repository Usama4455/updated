import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'DateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(date: any, args?: any): any {
    return moment(new Date(date)).fromNow();
  }
}
