import {Component, input, InputSignal} from '@angular/core';
import {DtoConfigurationLoader} from './dto-configuration-loader.interface';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-loader',
  imports: [
    Skeleton
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.sass'
})
export class LoaderComponent {
  // input/output
  affiche: InputSignal<boolean> = input(false);
  configuration: InputSignal<DtoConfigurationLoader[]> = input([{marginLeft: '0', marginTop: '1rem', height: '1rem', width: '100%'}]);
}
