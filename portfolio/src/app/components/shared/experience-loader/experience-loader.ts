import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-experience-loader',
  imports: [TranslatePipe],
  templateUrl: './experience-loader.html',
  styleUrl: './experience-loader.scss'
})
export class ExperienceLoader {}
