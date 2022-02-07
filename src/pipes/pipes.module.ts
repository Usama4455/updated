
import { NgModule } from '@angular/core';
import { CurencyPipe } from './curency.pipe';
import { TranslateAppPipe } from './translate-app/translate-app.pipe';
import { DateFormatPipe } from './date.pipe';
@NgModule({
    declarations: [CurencyPipe, DateFormatPipe, TranslateAppPipe],
    imports: [],
    exports: [CurencyPipe, DateFormatPipe, TranslateAppPipe]
})
export class PipesModule { }
