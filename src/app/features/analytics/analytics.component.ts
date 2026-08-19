import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  Chart,
  ChartConfiguration,
  registerables,
} from 'chart.js';

import { ClaimService } from '../../services/claim.service';
import { Claim } from '../../models/claim';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  imports: [ReactiveFormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit, AfterViewInit {

  private readonly claimService = inject(ClaimService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('claimsPerDayChart')
  claimsPerDayChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('claimTypeChart')
  claimTypeChart!: ElementRef<HTMLCanvasElement>;

  private claimsPerDayChartInstance?: Chart;
  private claimTypeChartInstance?: Chart;

  claims: Claim[] = [];
  filteredClaims: Claim[] = [];

  // Status statistics
  newCount = 0;
  rejectCount = 0;
  returnCount = 0;
  approveCount = 0;

  // Claim type statistics
  emergencyCount = 0;
  standardCount = 0;
  otherCount = 0;

  filterForm = this.fb.nonNullable.group({
    startDate: [''],
    endDate: [''],
  });


  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {

    this.claimService.claims$.subscribe((claims) => {

      this.claims = claims;

      this.applyFilter();

    });


    const today = this.getToday();

    this.filterForm.setValue({
      startDate: today,
      endDate: today,
    });


    this.filterForm.valueChanges.subscribe(() => {

      this.applyFilter();

    });


    this.applyFilter();
  }


  ngAfterViewInit(): void {

    this.createClaimsPerDayChart();

    this.createClaimTypeChart();

  }


  // ==============================
  // Date
  // ==============================

  private getToday(): string {

    const today = new Date();

    return today.toISOString().split('T')[0];

  }


  // ==============================
  // Filtering
  // ==============================

  private applyFilter(): void {

    const {
      startDate,
      endDate,
    } = this.filterForm.getRawValue();


    if (!startDate || !endDate) {

      this.filteredClaims = [];

      this.calculateStatusStatistics();

      this.calculateClaimTypeStatistics();

      this.createClaimsPerDayChart();

      this.createClaimTypeChart();

      return;

    }


    this.filteredClaims = this.claims.filter((claim) => {

      return (
        claim.receivedDate >= startDate &&
        claim.receivedDate <= endDate
      );

    });


    this.calculateStatusStatistics();

    this.calculateClaimTypeStatistics();

    this.createClaimsPerDayChart();

    this.createClaimTypeChart();

  }


  // ==============================
  // Status Statistics
  // ==============================

  private calculateStatusStatistics(): void {

    this.newCount = this.filteredClaims.filter(
      (claim) => claim.status === 'NEW',
    ).length;


    this.rejectCount = this.filteredClaims.filter(
      (claim) => claim.status === 'REJECT',
    ).length;


    this.returnCount = this.filteredClaims.filter(
      (claim) => claim.status === 'RETURN',
    ).length;


    this.approveCount = this.filteredClaims.filter(
      (claim) => claim.status === 'APPROVE',
    ).length;

  }


  // ==============================
  // Claim Type Statistics
  // ==============================

  private calculateClaimTypeStatistics(): void {

    this.emergencyCount = this.filteredClaims.filter(
      (claim) => claim.type === 'emergency',
    ).length;


    this.standardCount = this.filteredClaims.filter(
      (claim) => claim.type === 'standard',
    ).length;


    this.otherCount = this.filteredClaims.filter(
      (claim) => claim.type === 'other',
    ).length;

  }


  // ==============================
  // Claims Per Day Chart
  // ==============================

  private createClaimsPerDayChart(): void {

    if (!this.claimsPerDayChart) {
      return;
    }


    if (this.claimsPerDayChartInstance) {

      this.claimsPerDayChartInstance.destroy();

    }


    const dates = this.getDatesInRange();


    const branches = [
      'Phnom Penh',
      'Takhmao',
      'Siem Reap',
      'Battambang',
    ];


    const datasets = branches.map((branch) => {

      return {

        label: branch,

        data: dates.map((date) => {

          return this.filteredClaims.filter(
            (claim) =>
              claim.receivedDate === date &&
              claim.branch === branch,
          ).length;

        }),

        borderWidth: 2,

      };

    });


    const config: ChartConfiguration<'line'> = {

      type: 'line',

      data: {

        labels: dates,

        datasets,

      },


      options: {

        responsive: true,

        maintainAspectRatio: false,


        plugins: {

          legend: {
            position: 'bottom',
          },

        },


        scales: {

          y: {

            beginAtZero: true,

            ticks: {
              precision: 0,
            },

          },

        },

      },

    };


    this.claimsPerDayChartInstance = new Chart(
      this.claimsPerDayChart.nativeElement,
      config,
    );

  }


  // ==============================
  // Claim Type Chart
  // ==============================

  private createClaimTypeChart(): void {

    if (!this.claimTypeChart) {
      return;
    }


    if (this.claimTypeChartInstance) {

      this.claimTypeChartInstance.destroy();

    }


    const config: ChartConfiguration<'bar'> = {

      type: 'bar',

      data: {

        labels: [
          'Emergency',
          'Standard',
          'Other',
        ],


        datasets: [

          {

            label: 'Number of Claims',

            data: [
              this.emergencyCount,
              this.standardCount,
              this.otherCount,
            ],

            borderWidth: 1,

          },

        ],

      },


      options: {

        responsive: true,

        maintainAspectRatio: false,


        plugins: {

          legend: {
            display: false,
          },

        },


        scales: {

          y: {

            beginAtZero: true,

            ticks: {
              precision: 0,
            },

          },

        },

      },

    };


    this.claimTypeChartInstance = new Chart(
      this.claimTypeChart.nativeElement,
      config,
    );

  }


  // ==============================
  // Generate Dates
  // ==============================

  private getDatesInRange(): string[] {

    const {
      startDate,
      endDate,
    } = this.filterForm.getRawValue();


    if (!startDate || !endDate) {
      return [];
    }


    const dates: string[] = [];


    const current = new Date(startDate);

    const end = new Date(endDate);


    while (current <= end) {

      dates.push(
        current.toISOString().split('T')[0],
      );


      current.setDate(
        current.getDate() + 1,
      );

    }


    return dates;

  }

}
