import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-button',
  imports: [TranslatePipe],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
})
export class UiButton {

}
