import { Component, OnInit, ViewChild } from '@angular/core';
import { OpenDialogComponent } from '../open-dialog/open-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as Highcharts from 'highcharts/highcharts';
// const HighchartsMore = require("highcharts/highcharts-more.src");
// const HC_solid_gauge = require("highcharts/modules/solid-gauge.src");
// HC_solid_gauge(Highcharts);

// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

import { ExecutionService } from 'src/app/services/execution.service';
// import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GrowthDialogComponent,DialogInterface } from './growth-dialog/growth-dialog.component';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
// HighchartsMore(Highcharts);
// HighchartsSolidGauge(Highcharts);
// import { Chart } from 'angular-highcharts';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
})
export class SimulatorComponent implements OnInit {
  changeMediaorExection:boolean = false;
  hideShowTryScenarioSpendDigital: any = false;
  hideTryScenarioTv:any = false;
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: any = {
      // labels: [ 'Growth Ambition', 'Growth Achieved', ],
      // datasets: [
      //   { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      //   { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
      // ]
    };

  public barChartOptions: any = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        // color:'#ffffff',
        legend: {
          fontColor: "#ffffff",
          display:false
       },
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
          // drawBorder: true,
          // drawOnChartArea: true,
          // drawTicks: true,
          // color:"#ffffff"
        },
        ticks: {
          color:'#ffffff',
       },
      },
      y: {
        stacked: true,
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
          // drawBorder: true,
          // drawOnChartArea: true,
          // drawTicks: true,
          // color:"#ffffff",
          // tickColor:'red',
          // tickLength:5,
          // tickWidth:10,
          // borderDashOffset:0.0,
          // z:2
        },
          ticks: {
              color: "#ffffff", // this here
              stepSize: 0     
          }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          display: false
        },
        display: false,
      },
      title: {
        display: true,
        text: 'Growth',
        color:'#ffffff'
      }
    }
  }; 
    
  public floatVolumeChartOptions: any = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        color:'#ffffff',
        legend: {
          fontColor: "#ffffff",
       },
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
        },
        ticks: {
          color:'#ffffff',
       }
      },
      y: {
        stacked: false,
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
        },
          ticks: {
              color: "#ffffff", // this here  
              callback: function(val: any, index: number) {
                return val/100000 + 'M'
              },   
          }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        },
        display:false
      },
      tooltip: {
        callbacks: {
          title : () => null, // or function () { return null; },
          afterBody:()=> null,
          beforeBody:()=>null,
          dataset: ()=>null,
          datasetIndex:()=>null,
          dataIndex:()=>null,
          filter: function(toolItem: any){
            // console.log(toolItem);
          },
          footer: function(tooltipItems: any[]) {
            
            let sum = {};
            // let abc:any = {}; 
            let bcc:any = 0; 
          let pcc :any = "Current"
          // console.log(tooltipItems)
          // sum = JSON.stringify(tooltipItems)
            tooltipItems.forEach(function(tooltipItem: {
              raw: any;
              formattedValue: any;
              label: any; parsed: {_custom: any; y: number;x: string} 
              },) {         
              // tooltipItem.formattedValue = [Number(tooltipItem.raw[1])-Number(tooltipItem.raw[0])];
              // sum = tooltipItem.parsed.y;
              // sum = (tooltipItem.parsed.x)
              // abc = JSON.stringify(tooltipItem.parsed._custom)
              // bcc = tooltipItem.parsed._custom.start
              // console.log(tooltipItem.label, tooltipItem.formattedValue, tooltipItem.raw)
              pcc = tooltipItem.label
              // if(tooltipItem.raw){
              //   bcc = [((Number(tooltipItem.raw[1])-Number(tooltipItem.raw[0]))/100000).toFixed(1)+ 'M'];
              //   if(((Number(tooltipItem.raw[1])-Number(tooltipItem.raw[0]))) === NaN){
              //     bcc = 0 + 'M'
              //   }
              // }
              
              if(tooltipItem.parsed && tooltipItem.parsed._custom && tooltipItem.parsed._custom.start === null ){
                bcc = Number(tooltipItem.parsed._custom.end).toFixed(1) +'M'
              } else if(tooltipItem.parsed && tooltipItem.parsed._custom && tooltipItem.parsed._custom.end === null){
                bcc = Number(tooltipItem.parsed._custom.start/100000).toFixed(1) + 'M'
              } else{
                if(tooltipItem.parsed._custom !== undefined && tooltipItem.parsed._custom.end !== undefined && tooltipItem.parsed._custom.start !== undefined)
                bcc = (Number(Number(tooltipItem?.parsed?._custom?.end) - Number(tooltipItem?.parsed?._custom?.start))/100000).toFixed(1) +'M'
              }
              // if(bcc.str)
            });
            return (pcc+ ":" + bcc);
          }
        }
      }
      // tooltip:{
      //   callback: function(val: any, index: number) {
      //     return val.index/100000 + 'M'
      //   },
      // }
      // tooltip: {
      //   callbacks: {
      //     title: function(tooltip, data) {
      //         return data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems[0].index].x;
      //     }
      // }
      //   // title: function(context: any,val:any) {
      //   //   let label = context.dataset.data || '';

      //   //                 if (label) {
      //   //                     label += ': ';
      //   //                 }
      //   //                 if (context.parsed.y !== null) {
      //   //                     label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
      //   //                 }
      //   //                 return context.parsed.y
      //   //                 // return label/100000;
      //   //   // return val/100000;
      //   //   // {
      //   //   //     pointStyle: 'triangle',
      //   //   //     rotation: 0,
      //   //   // };
      //   // }
      // }
      // title: {
      //   display: true,
      //   text: 'ROI',
      //   color:'#ffffff'
      // }
    },
    // tooltips: {
    //   callbacks: {
    //     label: function(tooltipItem: any, data: any) {
    //       let label = data.datasets[tooltipItem.datasetIndex].label || '';

    //       if (label) {
    //         label += ': ';
    //       }
    //       label += Math.round(tooltipItem.datasetIndex * 100) / 100;
    //       return label;
    //     }
    //   }
    // }
  };
  public floatRevenueChartOptions: any = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        color:'#ffffff',
        legend: {
          fontColor: "#ffffff",
       },
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
        },
        ticks: {
          color:'#ffffff',
       }
      },
      y: {
        stacked: false,
        grid: {
          offset: false,
          display: false,
          borderColor: '#ffffff',
        },
          ticks: {
              color: "#ffffff", // this here  
              callback: function(val: any, index: number) {
                  return val/100000 + 'M'
              }
          }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        },
        display:false
      },
      // title: {
      //   display: true,
      //   text: 'ROI',
      //   color:'#ffffff'
      // }
    }
  };
  // public floatbarChartType: ChartType = 'bar';
//   public floatbarChartPlugins:any = {
//     // DataLabelsPlugin
//     datalabels: {
//       display: false,
//       color:'#ffffff'
//   }
// }   
  // ];

  public floatVolumeBarChartData:any = {};
  public floatRevenueBarChartData:any = {};
  public doughnutChartType: ChartType = 'doughnut';
  public pieSpendChartData:any = {};
  public pieSpendChartOptions:any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        display:true
      },
      title: {
        display: false,
        text: ''
      }
    }
  };
  public pieGrpChartData:any = {};
  public centerText: String = "Center Text";
  public pieGrpChartOptions:any = {
    centerText: "123",
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        display:true
      },
      title: {
        display: false,
        text: ''
      },
      centerText: this.centerText,
    },
  //   centerText: {
  //     display: true,
  //     text: "280"
  // }
  };
  public doughnutChartPlugins: any[] = [
    {
      beforeDraw(chart:any) {}
    }
  ];
  // {
  //   labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
  //   datasets: [
  //     { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
  //     { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
  //   ]
  // };
  // const labels = ['Distribution','TV','Digital','Trade','Price'];
// const  data = 
// {
//   labels: ['Distribution','TV','Digital','Trade','Price'],
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data:  [[0, 3000000], [3000000, 3300000], [3300000, 3300000], [3300000, 2100000], [3900000]],
//       backgroundColor: 'red',
//     },
//     {
//       label: 'Dataset 2',
//       data:  [[100000, 2000000], [2000000, 2300000], [2300000, 2300000], [2300000, 1100000], [2900000]],
//       backgroundColor: 'blue',
//     },
//     {
//       label: 'Dataset 3',
//       data:  [[0, 1000000], [1000000, 1300000], [1300000, 300000], [1600000, 1600000], [1900000]],
//       backgroundColor: 'green',
//     },
//   ]
// };


 
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

public roigrphChartData: any = {
  // labels: [ 'Current', 'Recommended'],
  // datasets: [
  //   { data: [ 65], label: 'Current' },
  //   { data: [ 28 ], label: 'Recommended' }
  // ]
};
public spengraphdata:any = {};
public roigraphOptions = {
  // indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: false,
      color:'#ffffff',
      legend: {
        fontColor: "#ffffff",
     },
      grid: {
        offset: false,
        display: false,
        borderColor: '#ffffff',
      },
      ticks: {
        color:'#ffffff',
     }
    },
    y: {
      stacked: false,
      grid: {
        offset: false,
        display: false,
        borderColor: '#ffffff',
      },
        ticks: {
            color: "#ffffff", // this here     
        }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#ffffff'
      },
      display:true,
      position:'bottom'
    },
    title: {
      display: true,
      text: 'ROI',
      color:'#ffffff'
    }
  }
}
public spengraphOptions:any = {
  indexAxis: 'y',
  // elements: {
  //   bar: {
      
  //   }
  // },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      color:'#ffffff',
      legend: {
        fontColor: "#ffffff",
     },
      grid: {
        offset: false,
        display: false,
        borderColor: '#ffffff',
      },
      ticks: {
        color:'#ffffff',
        callback: function(val: any, index: number) {
          if(val > 99999) {
            return val/100000 + 'M'
          } else {
            return val/1000 + 'k';
          }
        },
     }
    },
    y: {
      stacked: true,
      grid: {
        offset: false,
        display: false,
        borderColor: '#ffffff',
      },
        ticks: {
            color: "#ffffff", // this here 
        },
        scaleLabel: {
          display: true,
          
          // labelString: '1k = 1000'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
      },
      display:true,
      position:'bottom'
    },
    // legend: {
    //   position: 'top',
    // },
    title: {
      display: true,
      text: 'Spend',
      color:'#ffffff'
    }
  }
}
// public spengraph = {
//   type: 'bar',
//   data: [2,4],
//   options: {
//     indexAxis: 'y',
//     // Elements options apply to all of the options unless overridden in a dataset
//     // In this case, we are setting the border of each horizontal bar to be 2px wide
//     elements: {
//       bar: {
        
//       }
//     },
//     responsive: true,
//     scales: {
//       x: {
//         stacked: true,
//       },
//       y: {
//         stacked: true
//       }
//     },
//     plugins: {
//       legend: {
//         position: 'right',
//       },
//       title: {
//         display: true,
//         text: 'Chart.js Horizontal Bar Chart'
//       }
//     }
//   },
// };

public chartOptions: ChartOptions = {
  // centerText: this.centerText
};
@ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  showDiv = {
    Mfilter: false,
    current: false,
    tvFilter: false,
    MediaFilter: false,
  };
  footer = (tooltipItems: any[]) => {
    let sum = 0;
  
    tooltipItems.forEach(function(tooltipItem) {
      sum += tooltipItem.parsed.y;
    });
    return 'Sum: ' + sum;
  };
  model: any;
  ifPortfolio = false;
  execution: any = false;
  media: any = false;
  media_graph: any = false;
  media_table: any = false;
  showgraph = 'volume';
  selectedDetails: any;
  selectedChannel: any = '';
  channels: any = [];
  distribution_type: any = '';

  price_pack_current_standings: any = [];
  pack_mix_current_standings: any = [];
  da_current_standings: any = [];

  recommended_values: any;
  simulation_parameters: any;

  tv_recommended_grp: any = [];
  tv_recommended_spend: any = [];
  tv_recommended_roi: any = [];
  tv_recommended_vc: any = [];

  digital_recommended_grp: any = [];
  digital_recommended_spend: any = [];
  digital_recommended_roi: any = [];
  digital_recommended_vc: any = [];

  selectedMedia = '';
  media_details: any = [];
  execution_details: any = [];

  media_details_clone: any = [];
  execution_details_clone: any = [];

  scenario_val: any = {};

  highcharts5: any;
  chartOptions5: any;

  highcharts6: any;
  chartOptions6: any;

  media_graph_spend: any = [];
  media_graph_grp: any = [];

  new_volume: any;
  new_volume_scenario: any;
  d: any;
  brand_list: any;
  selectedBrand: any = '';
  scenario_name: any = '';

  all_media_details: any;
  tv_scenario: any = '';
  digital_scenario: any = '';
  distribution_scenario: any = '';
  total_val_distribution: any = '';

  filled_media_details: any = '';
  filled_execution_details: any = '';

  new_reco_media: any;
  new_reco_execution: any;

  total_trade: any;
  current_trade: any;

  distribution_volume = 0;
  price_volume = 0;
  trade_volume = 0;
  tv_volume = 0;
  digital_volume = 0;

  distribution_volume_new = 0;
  price_volume_new = 0;
  trade_volume_new = 0;
  tv_volume_new = 0;
  digital_volume_new = 0;

  spend_graph_tv: any;
  spend_graph_digital: any;

  roi_graph_tv: any;
  roi_graph_digital: any;

  display_chart: any;

  port_current_spends_tv = 0;
  port_recommendation_spends_tv = 0;
  port_current_roi_tv = 0;
  port_recommendation_roi_tv = 0;

  port_current_spends_digital = 0;
  port_recommendation_spends_digital = 0;
  port_current_roi_digital = 0;
  port_recommendation_roi_digital = 0;

  port_current_spends_tot_roi_tv = 0;
  port_current_spends_tot_roi_digital = 0;

  port_reco_spends_tot_roi_tv = 0;
  port_reco_spends_tot_roi_digital = 0;

  yourScenario: any;
  growthAchieved: any;
  growthAmbition: any;
  tryScenario: boolean = false;
  result_media: any;
  result_execution: any;
  brand_input: any;
  current_volume: any;
  simulation_status: any;
// menu item values
// brand_list:any;
  // selectedDetails: any = {};
  total_volume: any = {};
  growth_ambition: any;
  growth:any;
  woa:any;
  weekly_grp:any;
  tv_grp_total:any;
  tv_genres:any = {};
  channel_trade: any = {};
  channel_trade_new: any;

  digital_platforms:any = {};
  national_da:any = {};
  tv_digital_values: any = {};
  existing_values: any = {};
  effectiveness_values: any = {};
  asp_values: any = {};
  tv_total_data: any = {};
  digital_total_data:any = {};

  // selectedBrand: any;
  input_values: any= {
    'growth_ambition': 5,
    'woa':0,
    'weekly_grp': 200,
    'total_spend': 20000000,
    'total_tv_spend': 20000000,
    'max_trade':0,
    'current_da':0

  };
  insert_db = [];
  constraints_value:any;

  brand_level_constraints: any = [];
  portfolio_brand: any = [];
  insert_brand = 1;
  disabled = false;
  pga: any;
  input_values_by_brand: any = {
  }
  volumeChartNames = ['Volume Due To','Incremental Revenue'];
  selectedvolumeChart:any;
  volumeIncrementChartArr :any = [];
  constructor(
    public dialog: MatDialog,
    private executionService: ExecutionService,
    private commonService: CommonService,
    private dataService: DataService,
    private location: Location,
    private notifyService : NotificationService,
    private router: Router
  ) {
    this.model = { name: null, ExeCution: false, Media: false };
  }

  // Toggle change event for Portfolio output or brand level output
  onToggleChange(eve: any) {
    if (!eve) {
      this.display_chart = 'portfolio_view';
    } else {
      this.display_chart = 'brand_view';
    }
    this.makedefaultstoZero();
    this.getAllValues();
  }

  // select brand
  selectBrand(brand: any) {
    this.selectedBrand = brand;
    this.getChannels();
    this.getAllValues();
  }

  // get channels basis market and brand
  getChannels() {
    this.selectedDetails = this.commonService.selectedDetails;
    // console.log(
    //   this.selectedDetails.total_tv_spend,
    //   'this.commonService.selectedDetails',
    //   this.commonService.selectedDetails
    // );

    this.selectedDetails['brand'] = this.selectedBrand;
    this.commonService.getChannels(this.selectedDetails).subscribe(
      (data: { channels: any; total_trade: any; }) => {
        //console.log('data', data);
        this.channels = data.channels;
        this.total_trade = data.total_trade;
      },
      error => {
        this.notifyService.showError(error,'',3000)
      }
    );
  }

  formSubmit() {}
  // channel change event, this function will change current, recommended standings, distribution type in table
  onExecution(channel: any) {
    this.selectedMedia = '';
    this.selectedDetails.channel = channel;

    if (channel != 'all') {
      this.execution = true;
      this.media = false;
    }

    this.channels.forEach((item: any) => {
      if (item.channel == channel) {
        this.distribution_type = item.distribution_type;
      }
    });

    if (this.total_trade != undefined) {
      this.total_trade.forEach((item: any) => {
        if (item.channel == channel) {
          this.current_trade = item.current_trade;
        }
      });
    }

    if (this.filled_execution_details != '') {
      this.execution_details = this.filled_execution_details;
    } else {
      this.execution_details = this.result_execution;
    }

    // moving Total platform to top,
    this.brand_list.forEach((brand: any) => {
      let inputs: any = {};
      this.execution_details[brand].forEach((currentValue: any, index: any) => {
        this.execution_details[brand][index].recommendation_trade = Number(
          this.execution_details[brand][index].recommendation_trade
        );
        this.execution_details[brand][index].recommendation_distribution =
          Number(
            this.execution_details[brand][index].recommendation_distribution
          );
        if (currentValue['pack_name'] == 'Total') {
          var c = this.execution_details[brand].splice(index, 1);
          this.execution_details[brand].unshift(c[0]);
        }
        let growth_ambition: any[] = [];
        let total_digital_spend: any[] = [];
        let total_tv_spend: any[] = [];
        let woa:any[]= []
        let currentDA:any[]=[];
        let maxTrade:any[]=[];
        let inputs: any = {};
        if(this.selectedDetails.growth_ambition) {
          growth_ambition = JSON.parse(this.selectedDetails.growth_ambition);
          total_digital_spend = JSON.parse(this.selectedDetails.total_digital_spend);
          total_tv_spend = JSON.parse(this.selectedDetails.total_tv_spend);
          if(this.selectedDetails.woa){
            woa = JSON.parse(this.selectedDetails.woa);
          } 
          if(this.selectedDetails.current_da){
            currentDA = JSON.parse(this.selectedDetails.current_da);
          }
          if(this.selectedDetails.max_trade){
            maxTrade = JSON.parse(this.selectedDetails.max_trade);
          }
          let i = 0;
          this.brand_list.forEach((b: any)=> {
            inputs[b] = this.input_values;
            inputs[b].growth_ambition = growth_ambition[i];
            inputs[b].total_spend = total_digital_spend[i];
            inputs[b].total_tv_spend = total_tv_spend[i];
            inputs[b].woa = woa[i];
            inputs[b].current_da = currentDA[i];
            inputs[b].max_trade = maxTrade[i];
            i += 1;
          }); 
        }
        if(!inputs[brand as keyof typeof inputs]) {
          inputs[brand] = {}; 
        }
        this.input_values_by_brand[brand] = JSON.parse(JSON.stringify(inputs[brand as keyof typeof inputs]));
        // this.getCSVData(brand);
      });

      // mapping for scenario values if try scenario applied
      if (this.execution_details[brand] != undefined) {
        this.execution_details[brand].map((d: any) => {
          d.digital_price_scenario =
            this.filled_execution_details != ''
              ? d.scenario_price_per_pack
              : '';
          d.digital_distribution_scenario =
            this.filled_execution_details != '' ? d.scenario_distribution : '';
          d.digital_trade_scenario = '';
        });
      }
    });
    // this.showValuesBasedonAlert();
  }

  // graph change radio button event for Volume Due to & Incremental Revenue
  graphChange(event: any) {
    this.showgraph = event.value;
  }

  // on media change event (tv or digital),this function will change current, recommended standings in table
  onMediaChange(type: any) {
    this.selectedChannel = '';
    this.media_details = [];

    if (type != 'all') {
      this.media = true;
      this.execution = false;
    }

    this.selectedDetails.media_type = type;

    // check if values in try scenario are applied(to retain values after media or channel change)
    if (this.filled_media_details != '') {
      this.media_details = this.filled_media_details;
    } else {
      this.media_details = this.result_media;
    }

    this.brand_list.forEach((brand: any) => {
      // moving Total platform to top
      this.media_details[brand].forEach((currentValue: any, index: any) => {
        this.media_details[brand][index].current_roi = Number(
          this.media_details[brand][index].current_roi
        );
        this.media_details[brand][index].recommendation_roi = Number(
          this.media_details[brand][index].recommendation_roi
        );
        this.media_details[brand][index].current_metric_value = Number(
          this.media_details[brand][index].current_metric_value
        );
        this.media_details[brand][index].recommendation_metric_value = Number(
          this.media_details[brand][index].recommendation_metric_value
        );
        if (currentValue['genre_platform'] == 'Total') {
          var c = this.media_details[brand].splice(index, 1);
          this.media_details[brand].unshift(c[0]);
        }
      });

      // mapping for scenario values if try scenario applied
      this.media_details[brand].map((d: any) => {
        d.scenerio_spends_digital =
          this.filled_media_details != ''
            ? d.scenerio_spends_digital_input
            : '';
        d.scenerio_metric_value =
          this.filled_media_details != '' ? d.scenerio_metric_value_input : '';
        d.try_scenario_vol =
          this.filled_media_details != '' ? d.scenario_volume_output : '';
      });

      //calculation for pie charts for genre in TV - highcharts5 & highcharts6
      var t = this.media_details[brand].filter(
        (x: any) => x.genre_platform != 'Total'
      );

      this.media_graph_spend = [];
      let spendLabels: any[] = [];
      let spendDataValues: any[] = [];
      t.forEach((currentValue: any, index: any) => {
        if (currentValue['media_type'] == type) {
          this.media_graph_spend.push([
            currentValue['genre_platform'],
            Number((currentValue['current_spends'] / 1000).toFixed(2)),
          ]);
          spendLabels.push(currentValue['genre_platform']);
          spendDataValues.push(Number((currentValue['current_spends'] / 1000).toFixed(2)));
    }
  });
  this.hideShowTryScenarioSpendDigital = this.media_details[brand].filter((x: any) => (x.scenerio_spends_digital !== '' && x.scenerio_spends_digital !== undefined));
  this.hideTryScenarioTv = this.media_details[brand].filter((x:any) => (x.try_scenario_vol !== '' && x.try_scenario_vol !== undefined) );
      this.pieSpendChartData = {
        labels: spendLabels,
    datasets: [
      { 
        type: 'doughnut',
        data: spendDataValues,
        backgroundColor: ['#0272D5','#003F77','#02C7AF','#16C81D','#8E8E8E','#02AFD5'],
        hoverBackgroundColor: ['#0272D5','#003F77','#02C7AF','#16C81D','#8E8E8E','#02AFD5']
     }
    ]
      }
      this.pieSpendChartOptions.plugins.title.text = type == 'TV' ? 'TV Spend' : 'Digital Spend';
// console.log(this.media_graph_spend)
      this.media_graph_grp = [];
      let grpLabels: any[] = [];
      let grpDataValues: any[] = [];
      t.forEach((currentValue: any, index: any) => {
        if (currentValue['media_type'] == type) {
          this.media_graph_grp.push([
            currentValue['genre_platform'],
            Number(Number(currentValue['current_metric_value']).toFixed(0)),
          ]);
          grpLabels.push(currentValue['genre_platform']);
          grpDataValues.push(Number(Number(currentValue['current_metric_value']).toFixed(0)))
        }
      });
      // console.log(grpLabels)
      this.pieGrpChartData = {
        labels: grpLabels,
    datasets: [
      { 
        type: 'doughnut',
        data: grpDataValues,
        backgroundColor: ['#0272D5','#02C7AF','#003F77','#16C81D','#8E8E8E','#02AFD5'],
        hoverBackgroundColor: ['#0272D5','#02C7AF','#003F77','#16C81D','#8E8E8E','#02AFD5']
     }
    ]
      }
      this.pieGrpChartOptions.plugins.title.text = type == 'TV' ? 'TV GRP' : 'Digital GRP';
      // console.log(grpLabels,grpDataValues)
    }); 
// console.log(this.media_graph_grp)
    // this.highcharts5 = Highcharts;
    // this.chartOptions5 = {
    //   chart: {
    //     renderTo: 'container',
    //     type: 'pie',
    //   },
    //   title: {
    //     text: type == 'TV' ? 'TV Spend' : 'Digital Spend',
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Total percent market share',
    //     },
    //   },
    //   plotOptions: {
    //     pie: {
    //       shadow: false,
    //     },
    //   },

    //   series: [
    //     {
    //       name: '',
    //       data: this.media_graph_spend,
    //       size: '80%',
    //       innerSize: '20%',
    //       showInLegend: true,
    //       dataLabels: {
    //         enabled: false,
    //       },
    //     },
    //   ],
    // };

    // this.highcharts6 = Highcharts;
    // this.chartOptions6 = {
    //   chart: {
    //     renderTo: 'container',
    //     type: 'pie',
    //   },
    //   title: {
    //     text: type == 'TV' ? 'TV GRP' : 'Digital GRP',
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Total percent market share',
    //     },
    //   },
    //   plotOptions: {
    //     pie: {
    //       shadow: false,
    //     },
    //   },

    //   series: [
    //     {
    //       name: '',
    //       data: this.media_graph_grp,
    //       size: '80%',
    //       innerSize: '20%',
    //       showInLegend: true,
    //       dataLabels: {
    //         enabled: false,
    //       },
    //     },
    //   ],
    // };
    // this.pieChartData(this.media_graph_grp, this.media_graph_spend);
    // this.showValuesBasedonAlert();
  }

  title = 'appComponent';

  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  //new speedometer
  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: any = {
  //   chart: {
  //     type: 'solidgauge',
  //     // width: 420,
  //     backgroundColor: 'transparent',
  //     style: {
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //     // height: 80,
  //     // events: {
  //     //     render: renderIcons
  //     // }
  //   },

  //   credits: {
  //     enabled: false,
  //   },

  //   title: {
  //     text: ' ',
  //   },

  //   subtitle: {
  //     text: '',
  //   },

  //   // tooltip: {
  //   //   pointFormat: '{point.name}: <b>{point.y}</b> km/h'
  //   // },
  //   tooltip: {
  //     // formatter: function(data:any) {
  //     //   Math.round(Number(data.y/1000000))
  //     // },
  //     // pointFormat: '<b>' + Math.round(Number('{point.y:,.0f}')).toString() + '</b>'
  //     borderWidth: 0,
  //     backgroundColor: 'none',
  //     shadow: false,
  //     style: {
  //       fontSize: '16px',
  //     },
  //     valueSuffix: '%',
  //     pointFormat:
  //       '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
  //     // positioner: function (labelWidth) {
  //     //     return {
  //     //         x: (this.chart.chartWidth - labelWidth) / 2,
  //     //         y: (this.chart.plotHeight / 2) + 15
  //     //     };
  //     // }
  //   },

  //   pane: {
  //     center: ['50%', '85%'],
  //     size: '130%',
  //     // startAngle: -90,
  //     // endAngle: 90,
  //     // background: [{
  //     //     backgroundColor: 'transparent',
  //     //     borderColor: 'white',
  //     //     innerRadius: '45%',
  //     //     outerRadius: '88%',
  //     //     shape: 'arc'
  //     // }
  //     startAngle: -90,
  //     endAngle: 90,
  //     background: [
  //       {
  //         // Track for Move
  //         outerRadius: '100%',
  //         innerRadius: '92%',
  //         backgroundColor: '#1b2559',
  //         borderWidth: 0,
  //         shape: 'arc',
  //       },
  //       {
  //         // Track for Exercise
  //         outerRadius: '87%',
  //         innerRadius: '70%',
  //         backgroundColor: '#1b2559',
  //         borderWidth: 0,
  //         shape: 'arc',
  //       },
  //       {
  //         // Track for Stand
  //         outerRadius: '62%',
  //         innerRadius: '45%',
  //         backgroundColor: '#1b2559',
  //         borderWidth: 0,
  //         shape: 'arc',
  //       },
  //     ],
  //   },

  //   yAxis: {
  //     min: 0,
  //     max: 100,
  //     lineWidth: 0,
  //     tickPositions: [],
  //   },

  //   // plotOptions: {
  //   //     solidgauge: {
  //   //         dataLabels: {
  //   //             enabled: false
  //   //         },
  //   //         linecap: 'round',
  //   //         stickyTracking: false,
  //   //         rounded: false
  //   //     }
  //   // },

  //   plotOptions: {
  //     gauge: {
  //       dataLabels: {
  //         enabled: false,
  //         format: '{y} ',
  //         borderWidth: 0,
  //         color:
  //           (Highcharts.defaultOptions.title &&
  //             Highcharts.defaultOptions.title.style &&
  //             Highcharts.defaultOptions.title.style.color) ||
  //           '#333333',
  //         style: {
  //           fontSize: '16px',
  //         },
  //       },
  //       dial: {
  //         radius: '90%',
  //         backgroundColor: '#16C81D',
  //         baseWidth: 4,
  //         baseLength: '8%',
  //         rearLength: '0%',
  //       },
  //       pivot: {
  //         backgroundColor: '#16C81D',
  //         radius: 0,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       type: 'solidgauge',
  //       name: 'TryScenario',
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       data: [
  //         {
  //           color: 'red',
  //           radius: '112%',
  //           innerRadius: '88%',
  //           y: 80,
  //         },
  //       ],
  //     },
  //     {
  //       type: 'solidgauge',
  //       name: 'Growth Achieved',
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       data: [
  //         {
  //           color: 'blue',
  //           radius: '87%',
  //           innerRadius: '63%',
  //           y: 65,
  //         },
  //       ],
  //     },
  //     {
  //       type: 'solidgauge',
  //       name: 'Growth Ambition',
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       data: [
  //         {
  //           color: 'green',
  //           radius: '62%',
  //           innerRadius: '38%',
  //           y: 50,
  //         },
  //       ],
  //     },
  //   ],
  // };

  // initial values for spend graph
  spend_graph: any = {
    digital: [2, 2],
    tv: [4.5, 1],
  };

  // initial values for roi graph
  roi_graph: any = {
    digital: [2, 3],
    tv: [3.5, 2],
  };

  //spend graph with initial values
  // highchart2 = Highcharts;
  // chartOptions2: any = {
  //   chart: {
  //     type: 'bar',
  //     backgroundColor: 'transparent',
  //     style: {
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   credits: { enabled: false },
  //   title: {
  //     text: 'Spend',
  //     style: {
  //       color: 'white',
  //       fontSize: '12px',
  //       font: 'Inter',
  //     },
  //   },
  //   xAxis: {
  //     categories: ['Current', 'Recommended', 'Scenario'],
  //     labels: {
  //       style: {
  //         color: 'white',
  //         font: 'Inter',
  //       },
  //     },
  //   },
  //   yAxis: {
  //     visible: false,

  //     min: 0,
  //     credits: { enabled: false },
  //     title: {
  //       text: '',
  //       fontSize: '12px',
  //     },
  //   },
  //   legend: {
  //     reversed: true,
  //     itemStyle: {
  //       color: '#FFFFFF',
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   plotOptions: {
  //     series: {
  //       stacking: 'normal',
  //     },
  //   },
  //   colors: ['#0272D5', '#02AFD5'],
  //   series: [
  //     {
  //       name: 'Digital',
  //       data: this.spend_graph.digital,
  //       labels: {
  //         style: {
  //           color: 'white',
  //           font: 'Inter',
  //         },
  //       },
  //     },
  //     {
  //       name: 'TV',
  //       data: this.spend_graph.tv,
  //     },
  //   ],
  // };

  // ROi graph with initial vallues
  // highchart3 = Highcharts;
  // chartOptions3: any = {
  //   chart: {
  //     type: 'column',
  //     backgroundColor: 'transparent',
  //     style: {
  //       color: 'white',
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   credits: { enabled: false },
  //   title: {
  //     text: 'ROI',
  //     style: {
  //       color: 'white',
  //       fontSize: '12px',
  //       font: 'Inter',
  //     },
  //   },
  //   xAxis: {
  //     categories: ['Current', 'Recommended', 'Scenario'],
  //     labels: {
  //       style: {
  //         color: 'white',
  //         font: 'Inter',
  //       },
  //     },
  //   },
  //   yAxis: {
  //     visible: false,

  //     min: 0,
  //     credits: { enabled: false },
  //     title: {
  //       text: '',
  //       font: 'Inter',
  //     },
  //   },
  //   legend: {
  //     reversed: true,
  //     itemStyle: {
  //       color: '#FFFFFF',
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.2,
  //       borderWidth: 0,
  //     },
  //   },
  //   colors: ['#0272D5', '#02AFD5'],
  //   series: [
  //     {
  //       name: 'Digital',
  //       data: this.roi_graph.digital,
  //     },
  //     {
  //       name: 'TV',
  //       data: this.roi_graph.tv,
  //     },
  //   ],
  // };

  // volume due to graph with initial values
  // highchart4 = Highcharts;
  // formatter: any;
  // chartOptions4: any = {
  //   chart: {
  //     type: 'waterfall',
  //     backgroundColor: 'transparent',
  //     showBackground: true,
  //     style: {
  //       color: 'blue',
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   title: {
  //     text: '',
  //     style: {
  //       fontSize: '10px',
  //     },
  //   },
  //   xAxis: {
  //     categories: [
  //       'Current',
  //       'Distribution',
  //       'Price',
  //       'Trade',
  //       'TV',
  //       'Digital',
  //       'New',
  //     ],
  //     labels: {
  //       style: {
  //         color: 'white',
  //       },
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: '',
  //     },
  //     gridLineWidth: 0,
  //     minorGridLineWidth: 0,
  //     minorTickInterval: 10,
  //     minorTickLength: 0,
  //     labels: {
  //       style: {
  //         color: 'white',
  //       },
  //     },
  //   },

  //   legend: {
  //     enabled: false,
  //     style: {
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },

  //   tooltip: {
  //     // formatter: function(data:any) {
  //     //   Math.round(Number(data.y/1000000))
  //     // },
  //     // pointFormat: '<b>' + Math.round(Number('{point.y:,.0f}')).toString() + '</b>'
  //   },
  //   plotOptions: {
  //     series: {
  //       stacking: 'normal',
  //       borderWidth: 0,
  //     },
  //   },
  //   colors: ['#0272D5'],
  //   series: [
  //     {
  //       upColor: '#0272D5',
  //       color: 'red',
  //       showBackground: true,
  //       data: [
  //         {
  //           name: 'YAgo sale',
  //           y: 10,
  //           color: ' #0272D5',
  //         },
  //         {
  //           name: 'Distribution',
  //           y: 5,
  //         },
  //         {
  //           name: 'Price',
  //           y: 8,
  //         },
  //         {
  //           name: 'Trade',
  //           y: 6,
  //         },
  //         {
  //           name: 'TV',
  //           y: 4,
  //         },
  //         {
  //           name: 'Digital',
  //           y: 4,
  //         },
  //         {
  //           name: 'Current Sale',
  //           isSum: false,
  //           color: ' #0272D5',
  //         },
  //       ],

  //       dataLabels: {
  //         enabled: true,
  //         formatter: (data: any) => {
  //           console.log(data);
  //           return Highcharts.numberFormat(data.y / 1000000, 0, ',') + 'M';
  //         },
  //         style: {
  //           fontWeight: 'bold',
  //           fontFamily: "'Inter', sans-serif",
  //         },
  //       },
  //       pointPadding: 0,
  //     },
  //   ],
  // };

  // revenue graph with initial values
  // highchart8 = Highcharts;
  // chartOptions8: any = {
  //   chart: {
  //     type: 'waterfall',
  //     backgroundColor: 'transparent',
  //     style: {
  //       color: 'white',
  //       fontFamily: "'Inter', sans-serif",
  //     },
  //   },
  //   title: {
  //     text: '',
  //     style: {
  //       fontSize: '10px',
  //     },
  //   },
  //   xAxis: {
  //     categories: ['Current', 'Distribution', 'Price', 'TV', 'Digital', 'New'],
  //     labels: {
  //       style: {
  //         color: 'white',
  //       },
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: '',
  //     },
  //     gridLineWidth: 0,
  //     minorGridLineWidth: 0,
  //   },

  //   legend: {
  //     enabled: false,
  //   },
  //   tooltip: {
  //     pointFormat: '<b>{point.y:,.1f}</b>',
  //   },
  //   plotOptions: {
  //     series: {
  //       stacking: 'normal',
  //       borderWidth: 0,
  //     },
  //   },
  //   series: [
  //     {
  //       upColor: '#0272D5',
  //       color: 'red',
  //       data: [
  //         {
  //           name: 'YAgo sale',
  //           y: 10,
  //           color: ' #8e8b89',
  //         },
  //         {
  //           name: 'Distribution',
  //           y: 5,
  //         },
  //         {
  //           name: 'Price',
  //           y: 8,
  //         },

  //         {
  //           name: 'TV',
  //           y: 4,
  //         },
  //         {
  //           name: 'Digital',
  //           y: 4,
  //         },

  //         {
  //           name: 'Current Sale',
  //           isSum: false,
  //           color: ' #8e8b89',
  //         },
  //       ],

  //       dataLabels: {
  //         enabled: true,
  //         formatter: (data: any) => {
  //           console.log(data);
  //           return Highcharts.numberFormat(data.y / 1000000, 0, ',') + 'M';
  //         },
  //         style: {
  //           fontWeight: 'bold',
  //           fontFamily: "'Inter', sans-serif",
  //         },
  //       },
  //       pointPadding: 0,
  //     },
  //   ],
  // };

  updateFlag = false;
  new_values: any = {};

  // Try scenario function, it occurs on onchange event in try scenario textboxes
  onTryScenarioNew(val: any) {
    //console.log('onTryScenarioNew');
    this.changeMediaorExection = true;
    this.tryScenario = true;
    this.updateFlag = false;
    let brands = Object.keys(this.media_details);
    brands.forEach((brand: any)=> {
      this.media_details[brand].forEach((currentValue: any, index: any) => {
        this.media_details[brand][index]['scenerio_spends_digital_input'] =
          currentValue['scenerio_spends_digital'] != ''
            ? currentValue['scenerio_spends_digital']
            : currentValue['recommendation_spends'];
        this.media_details[brand][index]['scenerio_metric_value_input'] =
          currentValue['scenerio_metric_value'] != ''
            ? currentValue['scenerio_metric_value'] != undefined
              ? currentValue['scenerio_metric_value']
              : currentValue['recommendation_metric_value']
            : currentValue['recommendation_metric_value'];
        this.media_details[brand][index]['scenario_revenue_output'] =
          currentValue['scenario_revenue_output'];
        this.media_details[brand][index]['scenario_roi_output'] =
          currentValue['scenario_roi_output'];
        this.media_details[brand][index]['scenario_volume_output'] =
          currentValue['scenario_volume_output'];
      });
  
      this.execution_details[brand].forEach((currentValue: any, index: any) => {
        if (this.selectedDetails.category == 'Beverages') {
          this.execution_details[brand][index]['scenario_price_per_pack'] =
            currentValue['digital_price_scenario'] != ''
              ? currentValue['digital_price_scenario']
              : currentValue['current_price_per_pack'];
        } else {
          this.execution_details[brand][index]['scenario_volume_per_pack'] =
            (currentValue['digital_price_scenario'] != '' && currentValue['digital_price_scenario'] != undefined)
              ? currentValue['digital_price_scenario']
              : currentValue['current_price_per_pack'];
        }
  
        this.execution_details[brand][index]['scenario_distribution'] =
          currentValue['digital_distribution_scenario'] != ''
            ? currentValue['digital_distribution_scenario']
            : currentValue['current_distribution'];
        this.execution_details[brand][index]['scenario_trade'] =
          currentValue['digital_trade_scenario'] != ''
            ? currentValue['digital_trade_scenario']
            : currentValue['current_trade'];
        this.execution_details[brand][index]['scenario_distribution_volume'] =
          currentValue['scenario_distribution_volume'];
  
        this.execution_details[brand][index]['scenario_price_per_pack_volume'] =
          currentValue['scenario_price_per_pack_volume'];
        this.execution_details[brand][index]['scenario_trade_incremental_volume'] =
          currentValue['scenario_trade_incremental_volume'];
      });
  
      // deleting keys before passing as request to backend
      this.media_details[brand].forEach(function (item: any) {
        delete item.scenario_spends_output;
        delete item.scenerio_metric_value_output;
        delete item.scenario_volume_output;
        delete item.scenario_revenue_output;
        delete item.scenario_roi_output;
        delete item.try_scenario_vol;
        delete item.scenario_trade_incremental_volume_x;
        delete item.scenario_trade_incremental_volume_y;
      });
  
      // deleting keys before passing as request to backend
      this.execution_details[brand].forEach(function (item: any) {
        delete item.scenario_distribution_volume;
        delete item.scenario_price_per_pack_volume;
        delete item.scenario_trade_volume;
        delete item.scenario_volume_per_pack_volume;
        delete item.scenario_trade_incremental_volume_x;
        delete item.scenario_trade_incremental_volume_y;
        // delete item.scenario_price_per_volume_incremental_volume;
        // delete item.scenario_distribution_incremental_volume;
        //delete item.scenario_trade_incremental_volume;
      });
    });
    

    var req_data = {
      media_details: this.media_details,
      execution_details: this.execution_details,
    };

    //console.log('req_data', req_data);
    this.dataService.tryScenario(req_data).subscribe(
      (data: { new_values_media: { [x: string]: any[]; }; new_values_execution: { [x: string]: any[]; }; }) => {
        
        this.distribution_volume_new = 0;
        this.trade_volume_new = 0;
        this.price_volume_new = 0;
        // this.new_volume = 0;
        // this.new_volume_scenario = 0;        
        this.media_details_clone = data.new_values_media;
        this.execution_details_clone = data.new_values_execution;
        let brands = Object.keys(data.new_values_media);
        // moving Total platform to top
        this.spend_graph_tv = [0,0,0];
        this.roi_graph_tv = [0,0,0];
        this.spend_graph_digital = [0,0,0];
        this.roi_graph_digital = [0,0,0];
        brands.forEach((brand: any)=> {
          this.media_details_clone[brand].forEach((currentValue: any, index: any) => {
            if (currentValue['genre_platform'] == 'Total') {
              var c = this.media_details_clone[brand].splice(index, 1);
              this.media_details_clone[brand].unshift(c[0]);
            }
          });
          this.media_details_clone[brand].map((d: any) => {
            d.scenerio_spends_digital = d.scenario_spends_output;
            //d.scenerio_metric_value = d.scenerio_metric_value_output;
            d.try_scenario_vol = d.scenario_volume_output;
          });
          
  
          // moving Total platform to top
          this.execution_details_clone[brand].forEach((currentValue: any, index: any) => {
            if (currentValue['pack_name'] == 'Total') {
              var c = this.execution_details_clone[brand].splice(index, 1);
              this.execution_details_clone[brand].unshift(c[0]);
            }
          });
  
          this.filled_media_details = this.media_details_clone;
          this.filled_execution_details = this.execution_details_clone;
  
          // calculations based on scenario output to populate on graphs
          
          
          
          data.new_values_media[brand].forEach((currentValue: any, index: any) => {
            //console.log('currentValue',currentValue);
  
            if (
              currentValue['media_type'] == 'TV' &&
              currentValue['genre_platform'] == 'Total'
            ) {
              //console.log('currentValue',currentValue);
              this.tv_volume_new =
                currentValue['recommendation_volume'] -
                this.dataService.newRecommendedValues.current_volume;
              this.spend_graph_tv = [
                this.spend_graph_tv[0]+Number(currentValue['current_spends']),
                this.spend_graph_tv[1]+Number(currentValue['recommendation_spends']),
                this.spend_graph_tv[2]+Number(currentValue['scenario_spends'])
                
              ];
              this.roi_graph_tv = [
                this.roi_graph_tv[0]+Number(currentValue['current_roi']),
                this.roi_graph_tv[1]+Number(currentValue['recommendation_roi']),
                this.roi_graph_tv[2]+Number(currentValue['scenario_roi'])
              ];
            }
  
            if (
              currentValue['media_type'] == 'Digital' &&
              currentValue['genre_platform'] == 'Total'
            ) {
              this.digital_volume_new = currentValue['recommendation_volume'];
              this.spend_graph_digital = [
                this.spend_graph_digital[0]+Number(currentValue['current_spends']),
                this.spend_graph_digital[1]+Number(currentValue['recommendation_spends']),
                this.spend_graph_digital[2]+Number(currentValue['scenario_spends'])                
              ];
              this.roi_graph_digital = [
                this.roi_graph_digital[0]+Number(currentValue['current_roi']),
                this.roi_graph_digital[1]+Number(currentValue['recommendation_roi']),
                this.roi_graph_digital[2]+Number(currentValue['scenario_roi'])
              ];
            }
          });       
          
  
          data.new_values_execution[brand].forEach((currentValue: any, index: any) => {
            if (currentValue['pack_name'] == 'Total') {
              this.distribution_volume_new +=
                currentValue.recommendation_distribution_incremental_volume != -1
                  ? Number(
                      currentValue.recommendation_distribution_incremental_volume
                    )
                  : 0;
              this.trade_volume_new +=
                currentValue.recommendation_trade_incremental_volume != -1
                  ? Number(currentValue.recommendation_trade_incremental_volume)
                  : 0;
              this.price_volume_new +=
                currentValue.recommendation_price_per_volume_incremental_volume !=
                -1
                  ? Number(
                      currentValue.recommendation_price_per_volume_incremental_volume
                    )
                  : 0;
            }
          });
        });

        this.spend_graph_tv = [
          Number((this.spend_graph_tv[0] / 1000).toFixed(0)),
          Number((this.spend_graph_tv[1] / 1000).toFixed(0)),
          Number((this.spend_graph_tv[2] / 1000).toFixed(0))            
        ];
        this.roi_graph_tv = [
          Number((this.roi_graph_tv[0]).toFixed(1)),
          Number((this.roi_graph_tv[1]).toFixed(1)),
          Number((this.roi_graph_tv[2]).toFixed(1))            
        ];
        this.spend_graph_digital = [
          Number((this.spend_graph_digital[0] / 1000).toFixed(0)),
          Number((this.spend_graph_digital[1] / 1000).toFixed(0)),
          Number((this.spend_graph_digital[2] / 1000).toFixed(0))            
        ];
        this.roi_graph_digital = [
          Number((this.roi_graph_digital[0]).toFixed(1)),
          Number((this.roi_graph_digital[1]).toFixed(1)),
          Number((this.roi_graph_digital[2]).toFixed(1))            
        ];
        

        // total growth calculation
        this.new_volume_scenario =
          this.dataService.newRecommendedValues.current_volume +
          this.distribution_volume_new +
          this.trade_volume_new +
          this.price_volume_new +
          this.tv_volume_new +
          this.digital_volume_new;
        //console.log('new_volume_scenario',this.dataService.newRecommendedValues.current_volume, this.distribution_volume_new,this.trade_volume_new,this.price_volume_new,this.tv_volume_new ,this.digital_volume_new);

        // spend graph after try scenario
        // this.chartOptions2.series = [
        //   {
        //     name: 'Digital',
        //     data: this.spend_graph_digital,
        //   },
        //   {
        //     name: 'TV',
        //     data: this.spend_graph_tv,
        //   },
        // ];

        //chart js spend cahrt data
        
        // chart js roi chart data
        
        // roi graph after try scenario
        // this.chartOptions3.series = [
        //   {
        //     name: 'Digital',
        //     data: this.roi_graph_digital,
        //   },
        //   {
        //     name: 'TV',
        //     data: this.roi_graph_tv,
        //   },
        // ];
        this.yourScenario = (Number((this.new_volume_scenario /this.dataService.newRecommendedValues.current_volume - 1).toFixed(2)) * 10).toFixed(2);
        this.growthAchieved = Number((this.new_volume /this.dataService.newRecommendedValues.current_volume -1).toFixed(2)) * 100;
        this.growthAmbition = Number((this.new_volume /this.dataService.newRecommendedValues.current_volume -1).toFixed(2)) * 100;
        // chart js
        this.growthScenarioValues();
        this.spendScenarioValues();
        this.roiScenarioValues();
        this.volumeDuetoScenarioValues();
        this.revenueScenarioValues();
    // let tvValue = Number(Number(this.distribution_volume.toFixed(1)) + Number(this.tv_volume.toFixed(1)));
    // let digvolume = Number(tvValue + Number(this.digital_volume.toFixed(1)));
    // let trdVolume = Number(digvolume + Number(this.trade_volume.toFixed(1)));
    // let priceVolume = Number(trdVolume + Number(this.price_volume.toFixed(1)));
    // // console.log(tvValue, digvolume , trdVolume, priceVolume   )
    // let distbSceValue = Number(Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)) + Number(this.distribution_volume_new.toFixed(1))).toFixed(1);
    // let priceSceVolume = Number(Number(distbSceValue) + Number(this.price_volume_new.toFixed(1))).toFixed(1);
    // let trdSceVolume = Number(Number(priceSceVolume) + Number(this.trade_volume_new.toFixed(1))).toFixed(1);
    // let tvSceValue = Number(Number(trdSceVolume) + Number(this.tv_volume_new.toFixed(1))).toFixed(1);
    // let digSceVolume = Number(Number(tvSceValue) + Number(this.digital_volume_new.toFixed(1))).toFixed(1);
    // let totSceValue = Number(Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)) + Number(this.distribution_volume_new.toFixed(1)) +
    // Number(this.price_volume_new.toFixed(1)) + Number(this.trade_volume_new.toFixed(1)) + Number(this.tv_volume_new.toFixed(1)) + Number(this.digital_volume_new.toFixed(1))).toFixed(1);
    // // console.log(tvValue, digvolume , trdVolume, priceVolume   )
    // // console.log(this.dataService.newRecommendedValues.current_volume.toFixed(1),
    // // this.distribution_volume_new.toFixed(1),this.price_volume_new.toFixed(1),this.trade_volume_new.toFixed(1),
    // // this.tv_volume_new.toFixed(1),this.digital_volume_new.toFixed(1),totValue);
    // this.floatVolumeBarChartData = 
    // {
    //   labels: ['Current','Distribution','Price','Trade','TV','Digital','Total'],
    //   datasets: [
    //     {
    //       type: 'line',
    //       label: 'Normal',
    //       // data: [[0, 3000000], [3000000, 3300000], [3300000, 3300000], [3300000, 2100000], [3900000]],
    //       data: [this.distribution_volume.toFixed(1), tvValue, digvolume, trdVolume,priceVolume,priceVolume],
    //       fill: false,
    //       borderColor:'#02AFD5',
    //       backgroundColor: '#02AFD5',
    //     },
    //     //scenario values
    //     {
    //        type: 'line',
    //       label: 'Scenario',
    //       // data: [[0, 3000000], [3000000, 3300000], [3300000, 3300000], [3300000, 2100000], [3900000]],
    //       data: [this.dataService.newRecommendedValues.current_volume.toFixed(1),distbSceValue, priceSceVolume,trdSceVolume,tvSceValue, digSceVolume,totSceValue],
    //       fill: false,
    //       borderColor:'#02AFD5',
    //       backgroundColor: '#02AFD5',
    //     },
    //     {
    //       type: 'bar',
    //       label: 'Normal',
    //       data: [[this.distribution_volume.toFixed(1)], 
    //       [this.distribution_volume.toFixed(1), tvValue],
    //       [tvValue,digvolume],
    //       [digvolume, trdVolume], 
    //       [trdVolume, priceVolume],
    //       [priceVolume]
    //     ], 
    //       backgroundColor: '#0272D5',
    //       borderColor:'red',
    //       fill: false,
    //     },
    //     //scenario values
    //     {
    //       type: 'bar',
    //       label: 'Scenario',
    //       data: [[Number(this.dataService.newRecommendedValues.current_volume.toFixed(1))], 
    //       [Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)),distbSceValue],
    //       [distbSceValue,priceSceVolume],
    //       [priceSceVolume,trdSceVolume],
    //       [trdSceVolume, tvSceValue], 
    //       [tvSceValue, digSceVolume],
    //       [totSceValue]
    //     ], 
    //       backgroundColor: '#0272D5',
    //       borderColor:'red',
    //       fill: false,
    //     },
    //     // {
    //     //   type: 'bar',
    //     //   label: 'Dataset 2',
    //     //   data: [[0, 2000000], [2000000, 2300000], [2300000, 2300000], [2300000, 1100000], [2900000]],
    //     //   backgroundColor: 'blue',
    //     //   borderColor: 'blue',
    //     //   fill: false,
    //     // },
        
    //   // {
    //   //   type: 'line',
    //   //   label: 'Line Dataset',
    //   //   data: [[0, 2000000], [2000000, 2300000], [2300000, 2300000], [2300000, 1100000], [2900000]],
    //   //   fill: false,
    //   //   borderColor: 'blue',
    //   //   backgroundColor: 'blue',
    //   // }
    //   ]
      
    // };
        //volume due to chart
        // this.chartOptions4.series[0].data = [
        //   {
        //     name: 'Current',
        //     y: Number(
        //       this.dataService.newRecommendedValues.current_volume.toFixed(1)
        //     ),
        //     color: ' #0272D5',
        //   },
        //   {
        //     name: 'Distribution',
        //     y: Number(this.distribution_volume_new.toFixed(1)),
        //   },
        //   {
        //     name: 'Price',
        //     y: Number(this.price_volume_new.toFixed(1)),
        //   },
        //   {
        //     name: 'Trade',
        //     y: Number(this.trade_volume_new.toFixed(1)),
        //   },
        //   {
        //     name: 'TV',
        //     y: Number(Number(this.tv_volume_new).toFixed(1)),
        //   },
        //   {
        //     name: 'Digital',
        //     y: Number(this.digital_volume_new.toFixed(1)),
        //   },
        //   {
        //     name: 'New',
        //     isSum: true,
        //     color: ' #0272D5',
        //   },
        // ];

        // revenur graph
        // this.chartOptions8.series[0].data = [
        //   {
        //     name: 'Current',
        //     y: Number(
        //       (
        //         this.dataService.newRecommendedValues.current_volume *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //     color: ' #0272D5',
        //   },
        //   {
        //     name: 'Distribution',
        //     y: Number(
        //       (
        //         this.distribution_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //   },
        //   {
        //     name: 'Price',
        //     y: Number(
        //       (
        //         this.price_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //   },
        //   {
        //     name: 'Trade',
        //     y: Number(
        //       (
        //         this.trade_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //   },
        //   {
        //     name: 'TV',
        //     y: Number(
        //       (
        //         this.tv_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //   },
        //   {
        //     name: 'Digital',
        //     y: Number(
        //       (
        //         this.digital_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']
        //       ).toFixed(1)
        //     ),
        //   },
        //   {
        //     name: 'New',
        //     isSum: true,
        //     color: ' #0272D5',
        //   },
        // ];

        //speedometer graph
        // this.chartOptions.series = [
        //   {
        //     type: 'solidgauge',
        //     name: 'Speed',
        //     data: [
        //       {
        //         name: 'Your Scenario',
        //         radius: '100%',
        //         innerRadius: '92%',
        //         color: '#2702D5',
        //         y:
        //           Number(
        //             (
        //               this.new_volume_scenario /
        //                 this.dataService.newRecommendedValues.current_volume -
        //               1
        //             ).toFixed(2)
        //           ) * 10,
        //       },
        //       {
        //         name: 'Growth Achieved',
        //         radius: '87%',
        //         innerRadius: '70%',
        //         color: '#16C81D',
        //         y:
        //           Number(
        //             (
        //               this.new_volume /
        //                 this.dataService.newRecommendedValues.current_volume -
        //               1
        //             ).toFixed(2)
        //           ) * 100,
        //       },
        //       {
        //         name: 'Growth Ambition',
        //         radius: '62%',
        //         innerRadius: '45%',
        //         color: 'white',
        //         y: this.dataService.newRecommendedValues.growth_ambition,
        //       },
        //     ],
        //     dataLabels: {
        //       enabled: false,
        //     },
        //     tooltip: {
        //       pointFormat: '{point.name}: <b>{point.y}</b> %',
        //     },
        //   },
        //   {
        //     type: 'gauge',
        //     data: [
        //       Number(
        //         (
        //           this.new_volume /
        //             this.dataService.newRecommendedValues.current_volume -
        //           1
        //         ).toFixed(2)
        //       ) * 100,
        //     ],
        //     // data:[30]
        //   },
        // ];
        // this.chartOptions.tooltip = {
        //   formatter: function () {
        //     if (this.key === undefined) {
        //       this.key = 'Growth Achieved';
        //       return '<b>' + this.key + ':' + this.y + '%</b>';
        //     } else {
        //       return '<b>' + this.key + ':' + this.y + '%</b>';
        //     }
        //   },
        // };
        // this.initializeSpeedoMeter();

        this.updateFlag = true;
        
        
        // console.log(
        //   this.growthAchieved,
        //   this.growthAmbition,
        //   this.dataService.newRecommendedValues.current_volume
        // );
      },
      error => {
        this.notifyService.showError(error,'',3000)
      }
    );
  }

  //save scenario popup open
  open() {
    const dialogRef = this.dialog.open(OpenDialogComponent, {
      width: '400px',
      data: 'filter',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.scenario_name = result;
      this.saveScenario();
    });
  }

  //  save scenario
  saveScenario() {
    this.dataService
      .saveScenario({
        media_details: this.media_details_clone,
        execution_details: this.execution_details_clone,
        tv_scenario: this.tv_scenario,
        digital_scenario: this.digital_scenario,
        distribution_scenario: this.price_pack_current_standings,
        scenario_name: this.scenario_name,
        simulation_id: this.selectedDetails.simulation_id,
      })
      .subscribe(
        (data: any) => {
          //  this.channels = data;
        },
        error => {
          this.notifyService.showError(error,'',3000)
        }
      );
  }

  total_tv_grp: any = 0;
  total_digital_grp: any = 0;

  //current, recommended values on brand level and portfolio level & calculations for output panel(graphs)
  getAllValues() {
    this.makedefaultstoZero();
    //if toggle button is for brand view
    this.current_volume = 0;
    if (this.display_chart == 'brand_view') {
      //console.log(this.display_chart);
      this.distribution_volume = 0;
      this.trade_volume = 0;
      this.price_volume = 0;
      // brand level calculation for media entities
      this.spend_graph_tv = [0, 0];
      this.roi_graph_tv = [0, 0];

      this.spend_graph_digital = [0, 0];
      this.roi_graph_digital = [0, 0];
      //this.brand_list.forEach((brand) => {
      let selected_brand_input = this.brand_input.filter((el: any)=>el.brand == this.selectedBrand)[0]
      this.current_volume = selected_brand_input.brand_details.total_volume;
      this.result_media[this.selectedBrand].forEach((currentValue: any, index: any) => {
        //console.log(currentValue,this.display_chart);

        if (
          currentValue['media_type'] == 'TV' &&
          currentValue['genre_platform'] == 'Total'
        ) {
          this.tv_volume = Number(currentValue['recommendation_volume']);
          this.spend_graph_tv[0] += Number(currentValue['current_spends']);
          this.spend_graph_tv[1] += Number(
            currentValue['recommendation_spends']
          );

          this.roi_graph_tv[0] = Number(currentValue['current_roi']);
          this.roi_graph_tv[1] = Number(currentValue['recommendation_roi']);
        }

        if (
          currentValue['media_type'] == 'Digital' &&
          currentValue['genre_platform'] == 'Total'
        ) {
          this.digital_volume = Number(currentValue['recommendation_volume']);

          this.spend_graph_digital[0] += Number(currentValue['current_spends']);
          this.spend_graph_digital[1] += Number(
            currentValue['recommendation_spends']
          );

          this.roi_graph_digital[0] += Number(currentValue['current_roi']);
          this.roi_graph_digital[1] += Number(
            currentValue['recommendation_roi']
          );
        }
      });

      // brand level calculation for execution entities
      this.result_execution[this.selectedBrand].forEach((currentValue: any, index: any) => {
        if (currentValue['pack_name'] == 'Total') {
          //console.log('currentValue',currentValue);

          this.distribution_volume +=
            currentValue.recommendation_distribution_incremental_volume != -1
              ? Number(
                  currentValue.recommendation_distribution_incremental_volume
                )
              : 0;
          this.trade_volume +=
            currentValue.recommendation_trade_incremental_volume != -1
              ? Number(currentValue.recommendation_trade_incremental_volume)
              : 0;
          this.price_volume +=
            currentValue.recommendation_price_per_volume_incremental_volume !=
            -1
              ? Number(
                  currentValue.recommendation_price_per_volume_incremental_volume
                )
              : 0;
        }
      });
      //});

      this.spend_graph_tv[0] = Number(
        (this.spend_graph_tv[0] / 1000).toFixed(0)
      );
      this.spend_graph_tv[1] = Number(
        (this.spend_graph_tv[1] / 1000).toFixed(0)
      );
      this.roi_graph_tv[0] = Number(this.roi_graph_tv[0].toFixed(1));
      this.roi_graph_tv[1] = Number(this.roi_graph_tv[1].toFixed(1));

      this.spend_graph_digital[0] = Number(
        (this.spend_graph_digital[0] / 1000).toFixed(0)
      );
      this.spend_graph_digital[1] = Number(
        (this.spend_graph_digital[1] / 1000).toFixed(0)
      );

      this.roi_graph_digital[0] = Number(this.roi_graph_digital[0].toFixed(1));
      this.roi_graph_digital[1] = Number(this.roi_graph_digital[1].toFixed(1));
    }

    //if toggle button is for portfolio view
    if (this.display_chart == 'portfolio_view') {
      //console.log('currentValue', this.display_chart);
      this.current_volume = this.dataService.newRecommendedValues.current_volume;
      // portfolio level calculation for media entities
      this.dataService.newRecommendedValues.r_portfolio_media.forEach(
        (currentValue: any, index: any) => {
          currentValue.forEach((current: any) => {
            //console.log(currentValue,this.display_chart);
            if (
              current['media_type'] == 'TV' &&
              current['genre_platform'] == 'Total'
            ) {
              this.port_current_spends_tv += Number(current.current_spends);
              this.port_recommendation_spends_tv += Number(
                current.recommendation_spends
              );
              this.port_current_roi_tv += Number(current.current_roi);
              this.port_recommendation_roi_tv += Number(
                current.recommendation_roi
              );
            }

            if (
              current['media_type'] == 'TV' &&
              current['genre_platform'] != 'Total'
            ) {
              this.port_current_roi_tv += Number(current.roi_calc_current);
              this.port_recommendation_roi_tv += Number(current.roi_calc_recom);
              this.port_current_spends_tot_roi_tv += Number(
                current.current_spends
              );
              this.port_reco_spends_tot_roi_tv += Number(
                current.recommendation_spends
              );
            }

            if (
              current['media_type'] == 'Digital' &&
              current['genre_platform'] == 'Total'
            ) {
              this.port_current_spends_digital += Number(
                current.current_spends
              );
              this.port_recommendation_spends_digital += Number(
                current.recommendation_spends
              );
              this.port_current_roi_digital += Number(current.current_roi);
              this.port_recommendation_roi_digital += Number(
                current.recommendation_roi
              );
            }

            if (
              current['media_type'] == 'Digital' &&
              current['genre_platform'] != 'Total'
            ) {
              this.port_current_roi_digital += Number(current.roi_calc_current);
              this.port_recommendation_roi_digital += Number(
                current.roi_calc_recom
              );
              this.port_current_spends_tot_roi_digital += Number(
                current.current_spends
              );
              this.port_reco_spends_tot_roi_digital += Number(
                current.recommendation_spends
              );
            }
          });

          

          
        }
      );
      var roi_tv_current =
            this.port_current_roi_tv / this.port_current_spends_tot_roi_tv;
          var roi_tv_reco =
            this.port_recommendation_roi_tv / this.port_reco_spends_tot_roi_tv;
          var roi_digital_current =
            this.port_current_roi_digital /
            this.port_current_spends_tot_roi_digital;
          var roi_digital_reco =
            this.port_recommendation_roi_digital /
            this.port_reco_spends_tot_roi_digital;
      this.spend_graph_tv = [
        Number((this.port_current_spends_tv / 1000).toFixed(0)),
        Number((this.port_recommendation_spends_tv / 1000).toFixed(0)),
      ];
      this.roi_graph_tv = [
        Number((roi_tv_current / 1).toFixed(1)),
        Number((roi_tv_reco / 1).toFixed(1)),
      ];

      this.spend_graph_digital = [
        Number((this.port_current_spends_digital / 1000).toFixed(0)),
        Number((this.port_recommendation_spends_digital / 1000).toFixed(0)),
      ];
      this.roi_graph_digital = [
        Number((roi_digital_current / 1).toFixed(1)),
        Number((roi_digital_reco / 1).toFixed(1)),
      ];

      // portfolio level calculation for execution entities
      this.dataService.newRecommendedValues.r_portfolio_execution.forEach(
        (currentValue: any, index: any) => {
          currentValue.forEach((current: any) => {
            // console.log(currentValue);
            if (current['pack_name'] == 'Total') {
              this.distribution_volume +=
                current.recommendation_distribution_incremental_volume != -1
                  ? Number(
                      current.recommendation_distribution_incremental_volume
                    )
                  : 0;
              this.trade_volume +=
                current.recommendation_trade_incremental_volume != -1
                  ? Number(current.recommendation_trade_incremental_volume)
                  : 0;
              this.price_volume +=
                current.recommendation_price_per_volume_incremental_volume != -1
                  ? Number(
                      current.recommendation_price_per_volume_incremental_volume
                    )
                  : 0;
            }
          });
        }
      );
    }

    this.new_volume =
      this.dataService.newRecommendedValues.current_volume +
      this.distribution_volume +
      this.trade_volume +
      this.price_volume +
      this.tv_volume +
      this.digital_volume;
    //console.log(this.new_volume, this.distribution_volume,this.trade_volume,this.tv_volume,this.digital_volume)
    // this.spendGraphValues();
    // this.roiGraphValues();
    // this.revenueGraphValues();
    // this.volumeDueToChartValues();
    this.speedoMeterGraphValues();
    this.updateFlag = true;
    //new chartjs
    this.volumeDueToValues();
    this.roiValues();
    this.spendChartGraphValue();
    this.growthChartData();
    this.revenueValues();
    this.getCSVData(this.selectedBrand);
  }

  ngOnInit(): void {

    //on page load default values
    this.brand_list = this.commonService.brandList;
    this.dataService.updateSimualtionStatus();
    this.dataService.simulation_status$.subscribe((data: any)=>{
      this.simulation_status = data;
    });
    this.selectedBrand = this.brand_list[0];
    this.display_chart = 'portfolio_view';
    this.getChannels();
    this.result_media = this.dataService.newRecommendedValues.result_media;
    this.brand_input = this.dataService.newRecommendedValues.input.brand_level_constraints;
    this.result_execution =
      this.dataService.newRecommendedValues.result_execution;
    this.new_reco_media = this.result_media[this.selectedBrand];
    this.new_reco_execution = this.result_execution[this.selectedBrand];
    this.onExecution('all');
    this.onMediaChange('all');

    this.getAllValues();
    //new chartjs
    this.volumeDueToValues();
    this.roiValues();
    this.spendChartGraphValue();
    this.growthChartData();
    this.revenueValues();
    this.alertGrowthAchieved();
    // side nav values
    // this.getCSVData(this.selectedBrand);
    this.selectedvolumeChart = 'Volume Due To'
    this.sendDataToHeader();
  }
  alertGrowthAchieved() {
    let growth_achieved = Number(
      (
        this.new_volume /
          this.dataService.newRecommendedValues.current_volume -
        1
      ).toFixed(2)
    ) * 100;
    let message;
    if(growth_achieved < this.dataService.newRecommendedValues.growth_ambition) {
      message = "Growth not achieved";
    }else {
      message = "Growth achieved";
    }
    const dialogRef = this.dialog.open(GrowthDialogComponent, {
      width: '250px',
      data: {message: message, growth_achieved: growth_achieved}
    });
  }
  //speedometer graph
  speedoMeterGraphValues() { 
    // this.chartOptions.series = [
    //   {
    //     type: 'solidgauge',
    //     name: 'Growth Achieved',
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     data: [
    //       {
    //         color: '#16C81D',
    //         radius: '87%',
    //         innerRadius: '70%',
    //         y:
    //           Number(
    //             (
    //               this.new_volume /
    //                 this.dataService.newRecommendedValues.current_volume -
    //               1
    //             ).toFixed(2)
    //           ) * 100,
    //       },
    //     ],
    //   },
    //   {
    //     type: 'solidgauge',
    //     name: 'Growth Ambition',
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     data: [
    //       {
    //         color: 'white',
    //         radius: '62%',
    //         innerRadius: '45%',
    //         y: this.dataService.newRecommendedValues.growth_ambition,
    //       },
    //     ],
    //   },
    //   {
    //     type: 'gauge',
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     data: [
    //       Number(
    //         (
    //           this.new_volume /
    //             this.dataService.newRecommendedValues.current_volume -
    //           1
    //         ).toFixed(2)
    //       ) * 100,
    //     ],
    //   },
    // ];
    // console.log(series.name)
    // this.chartOptions.tooltip = {
    //   formatter: function () {
    //     if (this.series.name === 'Series 3') {
    //       this.series.name = 'Growth Achieved';
    //       return '<b>' + this.series.name + ':' + this.y + '%</b>';
    //     } else {
    //       return '<b>' + this.series.name + ':' + this.y + '%</b>';
    //     }
    //     // return '{this.name}: <b>{this.y}</b> %'
    //     // this.name
    //     // let pvalue =  +(this.y / 1000000).toFixed(2);
    //     // // let tvalue = Math.round(Number(this.y / 1000000))
    //     // if(pvalue !== 0.0){
    //     //   return '<b>' + Highcharts.numberFormat(pvalue,1, '.') + 'M' + '</b>';
    //     //   } else {
    //     //     return '<b>' + Highcharts.numberFormat(pvalue,0, '.') + 'M' + '</b>';
    //     //   }
    //     // return '<b>' + Highcharts.numberFormat(pvalue,1,'.') + 'M' + '</b>';
    //   },
    // };
    // this.chartOptions.tooltip ={
    //   this.formatter
    //   pointFormat: '{point.name}: <b>{point.y}</b> %'
    // }
    //console.log(this.dataService.newRecommendedValues.growth_ambition, this.dataService.newRecommendedValues.current_volume,Number(((this.new_volume / this.dataService.newRecommendedValues.current_volume) - 1).toFixed(2)) * 100)
    this.yourScenario =
      Number(
        (
          this.new_volume /
            this.dataService.newRecommendedValues.current_volume -
          1
        ).toFixed(2)
      ) * 10;
    this.growthAchieved = Number(
      (
        Number(
          (
            this.new_volume /
              this.dataService.newRecommendedValues.current_volume -
            1
          ).toFixed(2)
        ) * 100
      ).toFixed(2)
    );
    this.growthAmbition = Number(
      this.dataService.newRecommendedValues.growth_ambition.toFixed(2)
    );
    //console.log(this.yourScenario, this.new_volume,this.dataService.newRecommendedValues.current_volume)
  }
  //volume due to chart
  // volumeDueToChartValues() {
  //   this.chartOptions4.series[0].data = [
  //     {
  //       name: 'Current',
  //       y: Number(
  //         this.current_volume.toFixed(1)
  //       ),
  //       color: '#0272D5', //#8e8b89
  //     },
  //     {
  //       name: 'Distribution',
  //       y: Number(this.distribution_volume.toFixed(1)),
  //     },
  //     {
  //       name: 'Price',
  //       y: Number(this.price_volume.toFixed(1)),
  //     },
  //     {
  //       name: 'Trade',
  //       y: Number(this.trade_volume.toFixed(1)),
  //     },
  //     {
  //       name: 'TV',
  //       y: Number(Number(this.tv_volume).toFixed(1)),
  //     },
  //     {
  //       name: 'Digital',
  //       y: Number(Number(this.digital_volume).toFixed(1)),
  //     },
  //     {
  //       name: 'New',
  //       isSum: true,
  //       color: ' #0272D5',
  //     },
  //   ];
  //   (this.chartOptions4.series[0].dataLabels = {
  //     enabled: true,
  //     formatter: (data: any) => {
  //       return Highcharts.numberFormat(data.y / 1000000, 0, ',') + 'M';
  //     },
  //     style: {
  //       fontWeight: 'bold',
  //     },
  //   }),
  //     (this.chartOptions4.series[0].dataLabels.formatter = function () {
  //       // let cvalue = Math.round(Number(this.y / 1000000))
  //       // console.log(Highcharts.numberFormat(cvalue, 0, ',') + 'M', this.y)
  //       let pvalue = +(this.y / 1000000).toFixed(2);
  //       if (pvalue !== 0.0) {
  //         return Highcharts.numberFormat(pvalue, 1, '.') + 'M';
  //       } else {
  //         return Highcharts.numberFormat(pvalue, 0, '.') + 'M';
  //       }
  //     });
  //   this.chartOptions4.tooltip = {
  //     formatter: function () {
  //       let pvalue = +(this.y / 1000000).toFixed(2);
  //       // let tvalue = Math.round(Number(this.y / 1000000))
  //       if (pvalue !== 0.0) {
  //         return '<b>' + Highcharts.numberFormat(pvalue, 1, '.') + 'M' + '</b>';
  //       } else {
  //         return '<b>' + Highcharts.numberFormat(pvalue, 0, '.') + 'M' + '</b>';
  //       }
  //       // return '<b>' + Highcharts.numberFormat(pvalue,1, '.') + 'M' + '</b>';
  //     },
  //   };
  // }
  //revenue graph highCharts
  // revenueGraphValues() {
  //   this.chartOptions8.series[0].data = [
  //     {
  //       name: 'Current',
  //       y: Number(
  //         (
  //           this.current_volume *
  //           this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //       color: ' #0272D5',
  //     },
  //     {
  //       name: 'Distribution',
  //       y: Number(
  //         (
  //           this.distribution_volume *
  //           this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //     },
  //     {
  //       name: 'Price',
  //       y: Number(
  //         (
  //           this.price_volume *
  //           this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //     },
  //     {
  //       name: 'Trade',
  //       y: Number(
  //         (
  //           this.trade_volume *
  //           this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //     },
  //     {
  //       name: 'TV',
  //       y: Number(
  //         (
  //           this.tv_volume * this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //     },
  //     {
  //       name: 'Digital',
  //       y: Number(
  //         (
  //           this.digital_volume *
  //           this.new_reco_media[0]['current_price_per_volume']
  //         ).toFixed(1)
  //       ),
  //     },
  //     {
  //       name: 'New',
  //       isSum: true,
  //       color: ' #0272D5',
  //     },
  //   ];
  //   this.chartOptions8.series[0].dataLabels = {
  //     enabled: true,
  //     formatter: (data: any) => {
  //       return Highcharts.numberFormat(data.y / 1000000, 0, ',') + 'M';
  //     },
  //     style: {
  //       fontWeight: 'bold',
  //     },
  //     // formatter: (data: any) => {
  //     //   console.log(data);
  //     //   return Highcharts.numberFormat(data.y / 1000, 0, ',') + 'k';
  //     // }
  //   };
  //   this.chartOptions8.series[0].dataLabels.formatter = function () {
  //     let pvalue = +(this.y / 1000000).toFixed(2);
  //     if (pvalue !== 0.0) {
  //       return Highcharts.numberFormat(pvalue, 1, '.') + 'M';
  //     } else {
  //       return Highcharts.numberFormat(pvalue, 0, '.') + 'M';
  //     }
  //     // return Highcharts.numberFormat(pvalue, 1, '.') + 'M';
  //   };
  //   this.chartOptions8.tooltip = {
  //     formatter: function () {
  //       let pvalue = +(this.y / 1000000).toFixed(2);
  //       // let tvalue = Math.round(Number(this.y / 1000000))
  //       if (pvalue !== 0.0) {
  //         return '<b>' + Highcharts.numberFormat(pvalue, 1, '.') + 'M' + '</b>';
  //       } else {
  //         return '<b>' + Highcharts.numberFormat(pvalue, 0, '.') + 'M' + '</b>';
  //       }
  //       // return '<b>' + Highcharts.numberFormat(pvalue,1,'.') + 'M' + '</b>';
  //     },
  //   };
  // }
  // roi graph
  // roiGraphValues() {
  //   this.chartOptions3.series = [
  //     {
  //       name: 'Digital',
  //       data: this.roi_graph_digital,
  //     },
  //     {
  //       name: 'TV',
  //       data: this.roi_graph_tv,
  //     },
  //   ];
  // }
// chart js roi
  roiValues(){
    this.roigrphChartData = {
      labels: [ 'Current', 'Recommended'],
  datasets: [
    { data: [ this.roi_graph_digital[0],this.roi_graph_digital[1]], label: 'Digital', backgroundColor: '#0272D5',
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.8,
        hoverBackgroundColor: ['#0272D5'],
    fill: false,
   },
    { data: [ this.roi_graph_tv[0], this.roi_graph_tv[1] ], label: 'TV', backgroundColor: '#02AFD5',
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.8,
    fill: false, 
    hoverBackgroundColor: ['#02AFD5'],
  }]
    }
  }
  // spend graph
  // spendGraphValues() {
  //   this.chartOptions2.series = [
  //     {
  //       name: 'Digital',
  //       data: this.spend_graph_digital,
  //     },
  //     {
  //       name: 'TV',
  //       data: this.spend_graph_tv,
  //     },
  //   ];
  // }

  //spendchart ChartJs
  spendChartGraphValue(){
    this.spengraphdata = {
      labels: [ 'Current', 'Recommended'],
  datasets: [
    { data: [ this.spend_graph_digital[0],this.spend_graph_digital[1]], label: 'Digital', backgroundColor: '#0272D5',barPercentage: 0.5,
    barThickness: 20,
    maxBarThickness: 30,
    minBarLength: 2,
    fontColor: '#ffffff',
    hoverBackgroundColor: ['#0272D5'],
   },
    { data: [ this.spend_graph_tv[0], this.spend_graph_tv[1] ], label: 'TV', backgroundColor: '#02AFD5',barPercentage: 0.5,
    barThickness: 20,
    maxBarThickness: 30,
    minBarLength: 2, 
    fontColor: '#ffffff',
    hoverBackgroundColor: ['#02AFD5'],
  }
  ]
    }
  }

  // making intial vallues to 0
  makedefaultstoZero() {
    this.distribution_volume = 0;
    this.trade_volume = 0;
    this.price_volume = 0;
    this.new_volume = 0;
    this.tv_volume = 0;
    this.digital_volume = 0;
    this.port_current_spends_tv = 0;
    this.port_recommendation_spends_tv = 0;
    this.port_current_roi_tv = 0;
    this.port_recommendation_roi_tv = 0;

    this.port_current_spends_digital = 0;
    this.port_recommendation_spends_digital = 0;
    this.port_current_roi_digital = 0;
    this.port_recommendation_roi_digital = 0;

    this.port_current_spends_tot_roi_tv = 0;
    this.port_current_spends_tot_roi_digital = 0;

    this.port_reco_spends_tot_roi_tv = 0;
    this.port_reco_spends_tot_roi_digital = 0;
  }
  //volumeDue to Chart Js
  volumeDueToValues(){
    let currValue = Number(this.current_volume.toFixed(1));
    let distVolume = Number(currValue + Number(this.distribution_volume.toFixed(1)));
    let tvValue = Number(distVolume + Number(this.tv_volume.toFixed(1)));
    let digvolume = Number(tvValue + Number(this.digital_volume.toFixed(1)));
    let trdVolume = Number(digvolume + Number(this.trade_volume.toFixed(1)));
    let priceVolume = Number(trdVolume + Number(this.price_volume.toFixed(1)));
    // console.log(currValue, Number(this.distribution_volume.toFixed(1)) , Number(this.tv_volume.toFixed(1)), 
    // Number(this.digital_volume.toFixed(1)), Number(this.trade_volume.toFixed(1)),Number(this.price_volume.toFixed(1))   )
  // console.log(currValue, distVolume, tvValue, digvolume, trdVolume, priceVolume , priceVolume)
    let VBarData =
    {
      labels: ['Current','Distribution','TV','Digital','Trade','Price','Total'],
      datasets: [
        {
          type: 'line',
          label: 'line',
          // data: [[0, 3000000], [3000000, 3300000], [3300000, 3300000], [3300000, 2100000], [3900000]],
          data: [currValue,distVolume,tvValue,digvolume,trdVolume,priceVolume,priceVolume],
          fill: false,
          borderColor:'#0272D5',
          backgroundColor: '#0272D5',
          maxBarThickness: 30,
        },
        {
          type: 'bar',
          label: 'bar',
          data: [[0,currValue], 
          [currValue,distVolume],
          [distVolume,tvValue],
          [tvValue,digvolume],
          [digvolume,trdVolume], 
          [trdVolume,priceVolume],
          [0,priceVolume]
        ], 
          backgroundColor: '#0272D5',
          maxBarThickness: 30,
          borderColor:'#0272D5',
          fill: false,
          hoverBackgroundColor: ['#0272D5'],
        },
      ]
    };
    let scenVoluObj = {
      scenarioName: 'Volume Due To',
      scenarioVolumeGrph : VBarData 
    }
    let checkExistScenario =  this.volumeIncrementChartArr.find((x:any)=> x.scenarioName === 'Volume Due To');
    if(this.volumeIncrementChartArr.length>1){
      if(checkExistScenario){
        for(let i=0; i< this.volumeIncrementChartArr.length; i++){
          if(this.volumeIncrementChartArr[i].scenarioName === 'Volume Due To'){
            this.volumeIncrementChartArr[i].scenarioVolumeGrph = VBarData;
            return;
          }
        } 
      } else {
        this.volumeIncrementChartArr.push(scenVoluObj);
        // this.volumeChartNames.push('Volume Due To');
        return;
      }
    } else {
      this.volumeIncrementChartArr.push(scenVoluObj);
      // this.volumeChartNames.push('Volume Due To');
      this.floatVolumeBarChartData = VBarData;
      return;
    }
    // this.volumeIncrementChartArr.push(scenVoluObj);
  }
  // growth ChartDetials Chart Js
  growthChartData(){
    this.barChartData = {
      labels: [ 'Growth Ambition', 'Growth Achieved'],
  datasets: [
    { data: [this.dataService.newRecommendedValues.growth_ambition.toFixed(2),Number((Number((
      this.new_volume /
        this.dataService.newRecommendedValues.current_volume -1).toFixed(2)) * 100
).toFixed(2)) ], label: ['Growth Ambition'], backgroundColor: ['#0272D5','#02AFD5' ],
    display:false,
    maxBarThickness: 30,
    hoverBackgroundColor: ['#0272D5','#02AFD5'],
   },
  ]
    }
  }
  //revenue chart Js
  revenueValues(){
    let currvalue =   Number((this.current_volume * this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
    let distbValue = Number(currvalue) + Number((this.distribution_volume *this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
      let priceVolume = Number(distbValue +  Number((this.price_volume *
        this.new_reco_media[0]['current_price_per_volume']
      ).toFixed(1)));
      let trdVolume = Number(priceVolume + Number((this.trade_volume *this.new_reco_media[0]['current_price_per_volume']
      ).toFixed(1)));
    let tvValue = Number(trdVolume + Number((this.tv_volume * this.new_reco_media[0]['current_price_per_volume']
      ).toFixed(1)));
    let digvolume = Number(tvValue + Number((this.digital_volume *
        this.new_reco_media[0]['current_price_per_volume']
      ).toFixed(1)));
      let totVolume = digvolume;
    // console.log(currvalue, distbValue, priceVolume, trdVolume, tvValue, digvolume , totVolume)
    let rBarData =
    {
      labels: ['Current','Distribution','Price','Trade','TV','Digital','Total'],
      datasets: [
        {
          type: 'line',
          label: '',
          // data: [[0, 3000000], [3000000, 3300000], [3300000, 3300000], [3300000, 2100000], [3900000]],
          data: [currvalue, distbValue, priceVolume, trdVolume, tvValue, digvolume,totVolume,totVolume ],
          fill: false,
          borderColor:'#0272D5',
          backgroundColor: '#0272D5',
          hoverBackgroundColor: ['#0272D5'],
        },
        {
          type: 'bar',
          label: '',
          data: [[0,currvalue], 
          [currvalue, distbValue],
          [distbValue, priceVolume],
          [priceVolume, trdVolume], 
          [trdVolume,tvValue],
          [digvolume,totVolume],
          [totVolume]
        ], 
          backgroundColor: '#0272D5',
          borderColor:'#0272D5',
          maxBarThickness: 30,
          fill: false,
          hoverBackgroundColor: ['#0272D5']
        },
        
      ]
    };
    let scenVoluObj = {
      scenarioName: 'Incremental Revenue',
      scenarioVolumeGrph : rBarData 
    }
    let checkExistScenario =  this.volumeIncrementChartArr.find((x:any)=> x.scenarioName === 'Incremental Revenue');
    if(this.volumeIncrementChartArr.length>1){
      if(checkExistScenario){
        for(let i=0; i< this.volumeIncrementChartArr.length; i++){
          if(this.volumeIncrementChartArr[i].scenarioName === 'Incremental Revenue'){
            this.volumeIncrementChartArr[i].scenarioVolumeGrph = rBarData;
            return;
          }
        } 
      } else {
        this.volumeIncrementChartArr.push(scenVoluObj);
        // this.volumeChartNames.push('Incremental Revenue');
        return;
      }
    } else {
      this.volumeIncrementChartArr.push(scenVoluObj);
      // this.volumeChartNames.push('Incremental Revenue');
      return;
    }
    // this.volumeIncrementChartArr.push(scenVoluObj);
    // this.floatVolumeBarChartData = rBarData;
  }
  // vlume due to scenario 
  volumeDuetoScenarioValues(){
    let currValue = Number(this.current_volume.toFixed(1));
    let distVolume = Number(currValue) + Number(this.distribution_volume.toFixed(1));
    let tvValue = Number(distVolume + Number(this.tv_volume.toFixed(1)));
    let digvolume = Number(tvValue + Number(this.digital_volume.toFixed(1)));
    let trdVolume = Number(digvolume + Number(this.trade_volume.toFixed(1)));
    let priceVolume = Number(trdVolume + Number(this.price_volume.toFixed(1)));
    // console.log(tvValue, digvolume , trdVolume, priceVolume   )
    let currScValue = Number(this.dataService.newRecommendedValues.current_volume.toFixed(1));
    let distbSceValue = Number(currScValue + Number(this.distribution_volume_new.toFixed(1))).toFixed(1);
    let priceSceVolume = Number(Number(distbSceValue) + Number(this.price_volume_new.toFixed(1))).toFixed(1);
    let trdSceVolume = Number(Number(priceSceVolume) + Number(this.trade_volume_new.toFixed(1))).toFixed(1);
    let tvSceValue = Number(Number(trdSceVolume) + Number(this.tv_volume_new.toFixed(1))).toFixed(1);
    let digSceVolume = Number(Number(tvSceValue) + Number(this.digital_volume_new.toFixed(1))).toFixed(1);
    let totSceValue = Number(Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)) + Number(this.distribution_volume_new.toFixed(1)) +
    Number(this.price_volume_new.toFixed(1)) + Number(this.trade_volume_new.toFixed(1)) + Number(this.tv_volume_new.toFixed(1)) + Number(this.digital_volume_new.toFixed(1))).toFixed(1);
    // console.log(currScValue, Number(this.distribution_volume_new.toFixed(1)), Number(this.price_volume_new.toFixed(1)),
    // Number(this.trade_volume_new.toFixed(1)),Number(this.tv_volume_new.toFixed(1)),Number(this.digital_volume_new.toFixed(1)))
    let vBarData =
    // this.floatVolumeBarChartData = 
    {
      labels: ['Current','Distribution','Price','Trade','TV','Digital','Total'],
      datasets: [
        // {
        //   type: 'line',
        //   label: '',
        //   data: [currValue,distVolume, tvValue, digvolume, trdVolume,priceVolume,priceVolume],
        //   fill: false,
        //   borderColor:'#0272D5',
        //   backgroundColor: '#0272D5',
        //   maxBarThickness: 30,
        // },
        //scenario values
        {
           type: 'line',
          label: '',
          data: [currScValue, distbSceValue, priceSceVolume,trdSceVolume,tvSceValue, digSceVolume,totSceValue,totSceValue],
          fill: false,
          borderColor:'#02AFD5',
          backgroundColor: '#02AFD5',
          maxBarThickness: 30,
        },
        // {
        //   type: 'bar',
        //   label: '',
        //   data: [[currValue], 
        //   [currValue,distVolume],
        //   [distVolume, tvValue],
        //   [tvValue,digvolume],
        //   [digvolume, trdVolume], 
        //   [trdVolume, priceVolume],
        //   [priceVolume]
        // ], 
        //   backgroundColor: '#0272D5',
        //   maxBarThickness: 30,
        //   borderColor:'#0272D5',
        //   fill: false,
        //   hoverBackgroundColor: ['#0272D5']
        // },
        //scenario values
        {
          type: 'bar',
          label: '',
          data: [[currScValue], 
          [currScValue,distbSceValue],
          [distbSceValue,priceSceVolume],
          [priceSceVolume,trdSceVolume],
          [trdSceVolume, tvSceValue], 
          [tvSceValue, digSceVolume],
          [totSceValue]
        ], 
          backgroundColor: '#02AFD5',
          borderColor:'#02AFD5',
          fill: false,
          hoverBackgroundColor: ['#02AFD5'],
          maxBarThickness: 30,
        },
      ]
      
    };
    let scenVoluObj = {
      scenarioName: 'Volume Scenario',
      scenarioVolumeGrph : vBarData 
    }
    let checkExistScenario =  this.volumeIncrementChartArr.find((x:any)=> x.scenarioName === 'Volume Scenario');
    if(this.volumeIncrementChartArr.length>1){
      if(checkExistScenario){
        for(let i=0; i< this.volumeIncrementChartArr.length; i++){
          if(this.volumeIncrementChartArr[i].scenarioName === 'Volume Scenario'){
            this.volumeIncrementChartArr[i].scenarioVolumeGrph = vBarData;
            return;
          }
        } 
      } else {
        this.volumeIncrementChartArr.push(scenVoluObj);
        this.volumeChartNames.push('Volume Scenario');
        return;
      }
    } else {
      this.volumeIncrementChartArr.push(scenVoluObj);
      this.volumeChartNames.push('Volume Scenario');
      return;
    }
  }
  //growth scenario
  growthScenarioValues(){
    this.barChartData = {
      labels: [ 'Growth Ambition', 'Growth Achieved', 'Your Scenario'],
  datasets: [
    { data: [this.growthAmbition, this.growthAchieved, this.yourScenario], label: ['Growth Ambition'], backgroundColor: ['#0272D5','#02AFD5','#0c8000' ],
    maxBarThickness: 30,hoverBackgroundColor: ['#0272D5','#02AFD5','#16c81D']
   },
  ]
    }
  }
  // spend scenario
  spendScenarioValues(){
    this.spengraphdata = {
      labels: [ 'Current', 'Recommended','Scenario'],
  datasets: [
    { data: this.spend_graph_digital, label: 'Digital', backgroundColor: '#0272D5',barPercentage: 0.5,
    barThickness: 20,
    maxBarThickness: 30,
    minBarLength: 2,
    fontColor: '#ffffff',
    hoverBackgroundColor: ['#0272D5']
   },
    { data: this.spend_graph_tv, label: 'TV', backgroundColor: '#02AFD5',barPercentage: 0.5,
    barThickness: 20,
    maxBarThickness: 30,
    minBarLength: 2, 
    fontColor: '#ffffff',
    hoverBackgroundColor: ['#02AFD5']
  }
  ]
    }
  }
  // roi scenario
  roiScenarioValues(){
    this.roigrphChartData = {
      labels: [ 'Current', 'Recommended','Scenario'],
  datasets: [
    { data: this.roi_graph_digital, label: 'Digital', backgroundColor: '#0272D5',
    // barPercentage: 1.0,
    // barThickness: 20,
    // maxBarThickness: 30,
    // minBarLength: 2,
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.8,
    fill: false,
    hoverBackgroundColor: ['#0272D5']
   },
    { data: this.roi_graph_tv, label: 'TV', backgroundColor: '#02AFD5',
    // barPercentage: 1.0,
    // maxBarThickness: 30,
    // minBarLength: 2,  
    // barThickness: 20,
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.8,
    fill: false,
    hoverBackgroundColor: ['#02AFD5']
   }
  ]
    }
  }
  // incremental revenue scenario
  revenueScenarioValues(){
  //   let currvalue =   Number((this.current_volume * this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
  //   let distbValue = Number(currvalue) + Number((this.distribution_volume *this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
  //     let priceVolume = Number(distbValue +  Number((this.price_volume *
  //       this.new_reco_media[0]['current_price_per_volume']).toFixed(1)));
  //   let trdVolume = Number(priceVolume + Number((this.trade_volume *this.new_reco_media[0]['current_price_per_volume']
  //   ).toFixed(1)));
  // let tvValue = Number(trdVolume + Number((
  //     this.tv_volume * this.new_reco_media[0]['current_price_per_volume']).toFixed(1)));
  // let digvolume = Number(tvValue + Number((
  //     this.digital_volume *
  //     this.new_reco_media[0]['current_price_per_volume']).toFixed(1)));
  //   let totVolume = digvolume;
  // console.log(currvalue, distbValue, priceVolume, trdVolume, tvValue, digvolume , totVolume)
  let currvalue = Number((this.dataService.newRecommendedValues.current_volume *
    this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
  let distbValue = Number(currvalue) + Number((this.distribution_volume_new *
      this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
  let priceVolume = distbValue + Number((this.price_volume_new *
      this.new_reco_media[0]['current_price_per_volume']
    ).toFixed(1));
  let trdVolume = priceVolume + Number((this.trade_volume_new *
      this.new_reco_media[0]['current_price_per_volume']
    ).toFixed(1));
    let tvValue = trdVolume + Number((this.tv_volume_new *
        this.new_reco_media[0]['current_price_per_volume']
      ).toFixed(1));
      let digvolume = tvValue + Number((
          this.digital_volume_new *
          this.new_reco_media[0]['current_price_per_volume']
        ).toFixed(1));
        let totVolume = digvolume;
        // let totVolume = Number((this.dataService.newRecommendedValues.current_volume *
        //   this.new_reco_media[0]['current_price_per_volume']).toFixed(1)) + Number((this.distribution_volume_new *
        //     this.new_reco_media[0]['current_price_per_volume']).toFixed(1)) + Number((this.price_volume_new *
        //       this.new_reco_media[0]['current_price_per_volume']).toFixed(1)) + Number((this.trade_volume_new *
        //         this.new_reco_media[0]['current_price_per_volume']).toFixed(1)) + Number((this.tv_volume_new *
        //           this.new_reco_media[0]['current_price_per_volume']).toFixed(1)) + Number((
        //             this.digital_volume_new *this.new_reco_media[0]['current_price_per_volume']).toFixed(1));
        //             console.log(currScvalue, distbSceValue,priceSceVolume,trdSceVolume, tvSceValue, digSceVolume,totSceValue,totSceValue)
  let rsBarData =
  // this.floatRevenueBarChartData = 
  {
    labels: ['Current','Distribution','Price','Trade','TV','Digital','Total'],
    datasets: [
      {
        type: 'line',
        label: '',
        data: [currvalue, distbValue,priceVolume,trdVolume, tvValue, digvolume,totVolume,totVolume ],
        fill: false,
        borderColor:'#02AFD5',
        backgroundColor: '#02AFD5',
      },
      //scenario
      // {
      //   type: 'line',
      //   label: '',
      //   data: [currScvalue, distbSceValue,priceSceVolume,trdSceVolume, tvSceValue, digSceVolume,totSceValue,totSceValue ],
      //   fill: false,
      //   borderColor:'#02AFD5',
      //   backgroundColor: '#02AFD5',
      //   // maxBarThickness: 30,
      // },
      {
        type: 'bar',
        label: '',
        data: [[currvalue], 
        [currvalue, distbValue],
        [distbValue, priceVolume],
        [priceVolume, trdVolume], 
        [trdVolume,tvValue],
        [digvolume,totVolume],
        [totVolume]
      ], 
        backgroundColor: '#02AFD5',
        borderColor:'#02AFD5',
        maxBarThickness: 30,
        fill: false,
        hoverBackgroundColor: ['#02AFD5']
      },
      //scenario
      // {
      //   type: 'bar',
      //   label: '',
      //   data: [[currScvalue], 
      //   [currScvalue, distbSceValue],
      //   [distbSceValue, priceSceVolume],
      //   [priceSceVolume, trdSceVolume], 
      //   [trdSceVolume,tvSceValue],
      //   [tvSceValue,digSceVolume],
      //   [digSceVolume,totSceValue],
      //   [totSceValue]
      // ], 
      // maxBarThickness: 30,
      //   backgroundColor: '#02AFD5',
      //   borderColor:'#02AFD5',
      //   fill: false,
      //   hoverBackgroundColor: ['#02AFD5'],
      // },
    ]
  };
  this.floatRevenueBarChartData = rsBarData;
  let scenVoluObj = {
    scenarioName: 'Incremental Scenario',
    scenarioVolumeGrph : rsBarData 
  }
  let checkExistScenario =  this.volumeIncrementChartArr.find((x:any)=> x.scenarioName === 'Incremental Scenario');
  if(this.volumeIncrementChartArr.length>1){
    if(checkExistScenario){
      for(let i=0; i< this.volumeIncrementChartArr.length; i++){
        if(this.volumeIncrementChartArr[i].scenarioName === 'Incremental Scenario'){
          this.volumeIncrementChartArr[i].scenarioVolumeGrph = rsBarData;
          return;
        }
      } 
    } else {
      this.volumeIncrementChartArr.push(scenVoluObj);
      this.volumeChartNames.push('Incremental Scenario');
      return;
    }
  } else {
    this.volumeIncrementChartArr.push(scenVoluObj);
    this.volumeChartNames.push('Incremental Scenario');
    return;
  }
  }
  back(){
    this.location.back();
    let arr:any[] = [];
    this.dataService.menuSimulationData(arr);
  }
  getCSVData(brand: any): void {
    //console.log(this.selectedDetails);
    this.selectedDetails.brand = this.selectedBrand;
    let in_data = {
      'country': this.selectedDetails.country,
      'category': this.selectedDetails.category,
      'brand': brand,
      'simulation_id': this.selectedDetails.simulation_id
    }
    this.portfolio_brand.push(this.selectedBrand);

    this.dataService.getCSVData(in_data)
    .subscribe(
       data => {
          //console.log('data',data);
          this.insert_brand = 1;
          this.constraints_value = data;
          this.constraints_value.total_volume = Number(data.total_volume);
          let current_brand = this.constraints_value.brand;
          this.input_values_by_brand[current_brand] = {};
          this.input_values_by_brand[current_brand].current_volume = data.total_volume;
          this.input_values_by_brand[current_brand].current_da = Number(data.current_da? data.current_da: 0);

          this.total_volume[current_brand] =  (data.total_volume/1000000).toFixed(2);
          this.national_da[current_brand] =  data.current_da;
          // console.log(current_brand,this.total_volume[current_brand])
          this.tv_total_data[current_brand] =  data.tv_genres.filter((x: any) => x.genre_platform == 'Total').map((d:any)=>{return d} )
        
          this.tv_genres[current_brand] =  data.tv_genres.filter((x: any) => x.genre_platform != 'Total')
           
          this.digital_total_data[current_brand] =  data.digital_platforms.filter((x: any) => x.genre_platform == 'Total').map((d:any)=>{return d} )
          this.channel_trade[current_brand] = data.channel_trade;


          this.channel_trade[current_brand].map((d:any)=>{
            if(d.current_trade == -1){
              d.current_trade = null;
            }
          })
          
          this.digital_platforms[current_brand] =  data.digital_platforms.filter((x: any) => x.genre_platform != 'Total')
          this.constraints_value['tv_genres'] = this.tv_genres[current_brand];
          this.constraints_value['digital_platforms'] = this.digital_platforms[current_brand];
          this.constraints_value['growth_ambition'] = this.input_values_by_brand[current_brand].growth_ambition;
          this.constraints_value['weekly_grp'] = this.input_values_by_brand[current_brand].weekly_grp;
          this.constraints_value['woa'] =  this.input_values_by_brand[current_brand].woa;
          this.constraints_value['total_spend'] =  this.input_values_by_brand[current_brand].total_spend;
          //console.log(this.input_values.total_spend);
          this.constraints_value['total_tv_spend'] =  this.input_values_by_brand[current_brand].total_tv_spend;

          let brand_exists = false;

          this.brand_level_constraints.forEach((val: any)=> {
            if (val.brand == this.constraints_value.brand) {
              brand_exists = true;
            }
          });
           
          if(!brand_exists){
            this.brand_level_constraints.push({'brand_details':this.constraints_value, 'brand':this.constraints_value.brand}) ;
          }
       },
       error => {
        this.notifyService.showError(error,'',3000)
      });
  }
  openDialog(paramData:any){
    console.log('abc')
    if(this.media){
      this.media = false;
    }
    const scdialogInterface: DialogInterface = {
      tryscenario:true,
      message: 'Are You sure want to make the changes',
      callbackMethod: () => {
        // this.notshowTryData();
        this.dialog.closeAll();
        this.media = true;
      },
      callbackYesMethod: () => {
        // this.showTryData();
      console.log('ccbc')

        if(paramData !== 'TV' && paramData !== 'Digital'){
          this.onExecution(paramData);
        } else {
          this.onMediaChange(paramData);
        }
        this.dialog.closeAll();
      }
    };
    // let message = 'Are You sure want to save';
    const dialogRef = this.dialog.open(GrowthDialogComponent, {
      width: '250px',
      data: scdialogInterface
    });
  }
  showValuesBasedonAlert(eventData:any){
    if(this.changeMediaorExection){
      this.openDialog(eventData);
    } else {
      if(eventData !== 'TV' && eventData !== 'Digital'){
        this.onExecution(eventData);
      } else {
        this.onMediaChange(eventData);
      }
    }
  }
  // notshowTryData(){
  //   this.volumeDueToValues();
  //   this.roiValues();
  //   this.spendChartGraphValue();
  //   this.growthChartData();
  //   this.revenueValues();
  //   this.dialog.closeAll();
  // }
  // showTryData(){
  //   this.roiScenarioValues();
  //   this.growthScenarioValues();
  //   this.volumeDuetoScenarioValues();
  //   this.spendScenarioValues();
  //   this.revenueScenarioValues();
  //   this.dialog.closeAll();
  // }
  modifyCenterText() {
    let chart:any;
    const ctx = chart.ctx;
    const txt = "Center Text";

    //Get options from the center object in options
    const sidePadding = 60;
    const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
    console.log(chart);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
    const stringWidth = ctx.measureText(txt).width;
    const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

    // Find out how much the font can grow in width.
    const widthRatio = elementWidth / stringWidth;
    const newFontSize = Math.floor(30 * widthRatio);
    const elementHeight = chart.innerRadius * 2;

    // Pick a new font size so it will not be larger than the height of label.
    const fontSizeToUse = Math.min(newFontSize, elementHeight);

    ctx.font = fontSizeToUse + "px Arial";
    ctx.fillStyle = "blue";

    // Draw text in center
    ctx.fillText(chart.options.centerText, centerX, centerY);
  }
  sendDataToHeader(){
    let arr = [];
    let simObj = {
      "selectedBrand": this.selectedBrand,
      "total_volume": this.total_volume,
      "growthAmbition": this.growthAmbition,
      "input_values_by_brand": this.input_values_by_brand,
      "tv_genres": this.tv_genres,
      "digital_platforms": this.digital_platforms
    }
    arr.push(simObj);
    this.dataService.menuSimulationData(arr)
  }
  navToScenario() {
    this.router.navigateByUrl('/scenario');
    let arr:any[] = [];
    this.dataService.menuSimulationData(arr);
  }
  ChangeVolumeDueCharts(name:any){
    this.floatVolumeBarChartData = null;
    if(name === 'Incremental Scenario') {
      this.showgraph = 'revenue';
    } else {
      this.showgraph = 'volume'
      let checkedScenario = this.volumeIncrementChartArr.find((x: any) => x.scenarioName === name);
      this.floatVolumeBarChartData = checkedScenario.scenarioVolumeGrph;
    }
  }
  
}
