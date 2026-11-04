import {Component, OnInit} from '@angular/core';
import {BatchService} from '../../../services/batch/batch.service';
import {DTOJobInstance} from '../../../services/batch/dto-job-instance.interface';
import {LoaderComponent} from '../../loader/loader.component';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-dernieres-executions-batchs',
  imports: [
    LoaderComponent,
    DatePipe,
    NgClass
  ],
  templateUrl: './dernieres-executions-batchs.component.html',
  styleUrl: './dernieres-executions-batchs.component.sass',
})
export class DernieresExecutionsBatchs implements OnInit {
  // données pour la vue
  loading: boolean = true;
  jobInstances?: DTOJobInstance[];

  constructor(private batchService: BatchService) {
  }

  ngOnInit(): void {
    this.batchService.chargerDernieresExecutions().subscribe(
      jobInstances => {
        this.jobInstances = jobInstances;
        this.loading = false;
      }
    );
  }
}
