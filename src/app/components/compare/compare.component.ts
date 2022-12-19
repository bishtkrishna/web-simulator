import { Component, Inject, OnInit } from '@angular/core';
// import {OpenDialogComponent} from '../open-dialog/open-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import * as Highcharts from 'highcharts/highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { CommonService } from 'src/app/services/common.service';
import { ExecutionService } from 'src/app/services/execution.service';
import { DataService } from 'src/app/services/data.service';
// import { analyzeAndValidateNgModules } from '@angular/compiler';
// import { DialogInterface, ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { CompareDialogComponent } from './compare-dialog/compare-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ChartEvent } from 'chart.js';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  showDiv = {
    Mfilter : false,
    current : false,
    tvFilter : false,
    MediaFilter : false
  }
  blob: any;
  model:any;
  execution: any = false;
  media:any = false;
  media_graph: any = false;
  media_table: any = false;
  selectedDetails: any;
  channels: any;
  execution_data:any;
  selectedChannel: any = "";
  selectedMedia: any = "";
  updateFlag= false;
  scenarios: any;
  selectedScenario: any[] = [];
  selectedScenarioClone: any[] = [];
  brand_list: any;
  selectedBrand: any;

  simulation_id = '';
  scenario_names_selected: any[] = [];

  media_scenario: any;
  execution_scenario:any;

  media_scenario_new:any[] = [];
  execution_scenario_new:any[] = [];

  media_type:any;
  distribution_type:any;
  total_trade:any;
  current_trade:any;


  tv_volume:any;
  spend_graph_tv: any;
  roi_graph_tv:any;

  digital_volume:any;
  spend_graph_digital: any;
  roi_graph_digital:any;

  distribution_volume: any;
  trade_volume: any;
  price_volume:any; 

  s1_volume_tv:any;
  s2_volume_tv:any;

  s1_volume_digital:any;
  s2_volume_digital:any;

  s1_volume_trade:any;
  s2_volume_trade:any;

  s1_volume_price:any;
  s2_volume_price:any;

  s1_volume_distribution:any;
  s2_volume_distribution:any;

  s1_volume_total: any;
  s2_volume_total: any;

  current_price_per_volume_for_all:any;

  showgraph = 'volume';
  display_result = false;
  portfolio: any;


  // scenarios: string[] = ['S01', 'S02',];
  yourScenario:any;
  growthAchieved:any;
  growthAmbition:any;  
  tryScenario:boolean = false;

  data_for_table: any[] = [];
  simulation_status: any;
  exec_data_for_table: any[] = [];
  completedScenario: any;
  selectedScenarioName: any = '';

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
  growthBarLabels:any = [];
  roiBarLabels:any = [];
  spendBarlabels: any = [];
  clickedScenario:any;
  selectedClickedScenario:any;
  scenarioVolGrphArr:any = [];
  checkedScenarios:any = [];
  s1VolumeDueto:any = {};
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
      stacked: false,
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
      stacked: false,
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
  tooltips: {
    callbacks: {
      label: function(tooltipItem: any, data: any) {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';

        if (label) {
          label += ': ';
        }
        label += Math.round(tooltipItem.datasetIndex * 100) / 100;
        return label;
      }
    }
  }
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
public pieSpendChartData:any = {};
public pieSpendChartOptions:any = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display:false
    },
    title: {
      display: true,
      text: ''
    }
  }
};
public pieGrpChartData:any = {};
public pieGrpChartOptions:any = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display:false
    },
    title: {
      display: true,
      text: ''
    }
  }
};

// events
public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  console.log(event, active);
}

public roigrphChartData: any = {
};
public spengraphdata:any = {};
public roigraphOptions = {
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
    display:false
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
    // position:'bottom'
    display:false
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
  constructor(public dialog: MatDialog,private  dataService: DataService, private  commonService: CommonService,private executionService: ExecutionService, private notification:NotificationService, private location: Location,private notifyService : NotificationService,private router: Router){
      this.model = {name: null, ExeCution: false, Media: false};
  }

  // get channels basis market and brand

  getChannels(){
    this.selectedDetails = this.commonService.selectedDetails;   
    this.commonService.getChannels(this.selectedDetails)
    .subscribe(
       data => {
          this.channels = data.channels; 
          this.total_trade = data.total_trade;            
       },
       error => {
        this.notifyService.showError(error,'',3000)
      });
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
       if(!inputs[this.selectedBrand as keyof typeof inputs]) {
         inputs[this.selectedBrand ] = {}; 
       }
       this.input_values_by_brand[this.selectedBrand] = JSON.parse(JSON.stringify(inputs[this.selectedBrand as keyof typeof inputs]));
       // this.getCSVData(brand);
  }

  // channel change event, this function will change current, recommended standings, distribution type in table
  onExecution(channel:any){
    this.execution = true;
    this.media = false;
    this.selectedMedia = "";

    this.selectedDetails.channel = channel;
    this.channels.forEach((item:any) =>{
      if(item.channel == channel){
        this.distribution_type = item.distribution_type;
      }
    });

    if(this.total_trade != undefined){
        this.total_trade.forEach((item:any) =>{
        if(item.channel == channel){
          this.current_trade = item.current_trade;
        }
      });
    }

    let packs: any[] = [];
    this.exec_data_for_table = [];
    this.execution_scenario.forEach((el: any)=> {
      if(!packs.includes(el.pack_name)) {
        packs.push(el.pack_name);
      }   
    });
    this.selectedScenarioClone = JSON.parse(JSON.stringify(this.selectedScenario));
    packs.forEach((p: any)=> {
      let obj = {base:{grammage: 0, distribution: 0, da_gr: 0}};
      obj['pack' as keyof typeof obj] = p;
      this.selectedScenario.forEach((s: any)=> {
        let sc = s;
        obj[sc as keyof typeof obj] = {grammage: 0, distribution: 0, da_gr: 0};
        let cat = this.execution_scenario.filter((el:any)=> el.pack_name == p && el.scenario_name == s && el.channel == this.selectedChannel);
        cat.forEach((c:any)=> { 
          obj.base.grammage += Number(c.current_volume_per_pack);
          obj.base.distribution += Number(c.current_distribution);
          obj.base.da_gr += Number(c.current_volume);
          obj[sc as keyof typeof obj].grammage += Number(c.scenario_price_per_volume_incremental_volume);
          obj[sc as keyof typeof obj].distribution += Number(c.scenario_distribution_incremental_volume);
          obj[sc as keyof typeof obj].da_gr += Number(c.scenario_trade_incremental_volume);  
        });
      });
      this.exec_data_for_table.push(obj);
    });
    // this.executionService.getPackDetailsByChannel(this.selectedDetails)
    // .subscribe(
    //    data => {
    //       this.execution_data = data.pack_details;
    //    },
    //    error => {
    //       console.log(error);
    //    });
       

  }

  // on media change event (tv or digital),this function will change current, recommended standings in table
  onMediaChange(media_type:any){
    let genre: any[] = [];
    this.data_for_table = [];
    this.media_scenario.forEach((el:any)=> {
      if(!genre.includes(el.genre_platform)) {
        genre.push(el.genre_platform);
      }      
    });
    
    this.selectedScenarioClone = JSON.parse(JSON.stringify(this.selectedScenario));
    genre.forEach((g: any)=> {
      let obj = {base:{spends: 0, grp: 0, vol: 0}};
      obj['genre' as keyof typeof obj] = g;
      this.selectedScenario.forEach((s: any)=> {
        let sc = s;
        obj[sc as keyof typeof obj] = {spends: 0, grp: 0, vol: 0};
        let cat = this.media_scenario.filter((el:any)=> el.genre_platform == g && el.scenario_name == s && el.media_type == this.selectedMedia);
        cat.forEach((c:any)=> { 
          obj.base.spends += Number(c.current_spends);
          obj.base.grp += Number(c.current_metric_value);
          obj.base.vol += Number(c.current_volume);
          obj[sc as keyof typeof obj].spends += Number(c.scenario_spends);
          obj[sc as keyof typeof obj].grp += Number(c.scenario_metric_value);
          obj[sc as keyof typeof obj].vol += Number(c.scenario_volume);  
        });
      });
      this.data_for_table.push(obj);
    });
    
    this.media = true;
    this.execution = false;
    this.media_type = media_type;
    this.selectedChannel = "";
  }


    title = 'appComponent';
    
  isShowDiv = true;
   
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  // volume due to or revenue graph
  graphChange(event:any){
    this.showgraph = event.value;
  }

  // new speedo meter
//   Highcharts: typeof Highcharts = Highcharts;
//   chartOptions: any= {
//     chart: {
//       type: 'solidgauge',
//       // width: 420,
//       backgroundColor: 'transparent', style: {
//         fontFamily: "'Inter', sans-serif"
//       },
//     },

//     credits: {
//       enabled: false
//     },

//     title: {
//       text: ' '
//     },

//     subtitle: {
//       text: ''
//     },
//     tooltip: {
//       borderWidth: 0,
//       backgroundColor: 'none',
//       shadow: false,
//       style: {
//           fontSize: '16px'
//       },
//       valueSuffix: '%',
//       pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
//   },

// pane: {
//   center: ['50%', '85%'],
//         size: '130%',
//     startAngle: -90,
//     endAngle: 90,
//     background: [{ // Track for Move
//         outerRadius: '100%',
//         innerRadius: '92%',
//         backgroundColor:'#1b2559',
//         borderWidth: 0,
//         shape: 'arc',
//     }, { // Track for Exercise
//         outerRadius: '87%',
//         innerRadius: '70%',
//         backgroundColor:'#1b2559',
//         borderWidth: 0,
//         shape: 'arc'
//     }, { // Track for Stand
//         outerRadius: '62%',
//         innerRadius: '45%',
//         backgroundColor: '#1b2559',
//         borderWidth: 0,
//         shape: 'arc'
//     }]
// },

// yAxis: {
//     min: 0,
//     max: 100,
//     lineWidth: 0,
//     tickPositions: []
// },

//   plotOptions: {
    
//     gauge: {
//       dataLabels: {
//         enabled:false,
//           format: '{y} ',
//           borderWidth: 0,
//           color: (
//               Highcharts.defaultOptions.title &&
//               Highcharts.defaultOptions.title.style &&
//               Highcharts.defaultOptions.title.style.color
//           ) || '#333333',
//           style: {
//               fontSize: '16px'
//           }
//       },
//       dial: {
//         radius: '90%',
//         backgroundColor: '#16C81D',
//         baseWidth: 4,
//         baseLength: '8%',
//         rearLength: '0%'
//     },
//     pivot: {
//         backgroundColor: '#16C81D',
//         radius: 0
//     }
//     }
//   },
// series: [{
//   type:'solidgauge',
//     name: 'TryScenario',
//     dataLabels: {
//       enabled:false,
//     },
//     data: [{
//         color: 'red',
//         radius: '112%',
//         innerRadius: '88%',
//         y: 80
//     }]
// }, {
//   type:'solidgauge',
//     name: 'Growth Achieved',
//     dataLabels: {
//       enabled:false,
//     },
//     data: [{
//         color: 'blue',
//         radius: '87%',
//         innerRadius: '63%',
//         y: 65
//     }]
// }, {
//   type:'solidgauge',
//     name: 'Growth Ambition',
//     dataLabels: {
//       enabled:false,
//     },
//     data: [{
//         color: 'green',
//         radius: '62%',
//         innerRadius: '38%',
//         y: 50
//     }]
// }]
// };

  spend_graph: any = {
    'digital': [2,2,2],
    'tv': [4.5, 1]
  }

  roi_graph: any = {
    'digital': [2, 3,3],
    'tv': [3.5, 2, 4 ]
  }

  // define spend chart
  // highchart2 = Highcharts;
  // chartOptions2:any = {     
  //   chart: {
  //     type: 'bar',
  //     backgroundColor: 'transparent',
  //     style: {
  //       fontFamily: "'Inter', sans-serif"
  //   }
  //   },
  //   credits: {enabled: false},
  //   title: {
  //       text: 'Spend',
  //       style: {
  //         color: 'white',
  //         fontSize:'12px',
  //         font: 'Inter'
  //       }
  //   },
  //   xAxis: {
  //       categories: ['Base'],
  //       labels: {
  //         style: {
  //           color: 'white',
  //           font: 'Inter'
  //         }
  //       }
  //   },
  //   yAxis: {
  //     visible: false,
    
  //       min: 0,
  //       credits: {enabled: false},
  //       title: {
  //           text: '',
  //           fontSize:'12px'
          
  //       }
  //   },
  //   legend: {
  //     reversed: true,
  //     itemStyle: {
  //       color: '#FFFFFF',
  //       fontFamily: "'Inter', sans-serif"
  //    },
     
  // },
  //   plotOptions: {
  //       series: {
  //           stacking: 'normal'
  //       }
  //   },
  //   colors:['#0272D5','#02AFD5'],
  //   series: [{
  //       name: 'Digital',
  //       data: this.spend_graph.digital,
  //       labels: {
  //         style: {
  //           color: 'white',
  //           font: 'Inter'
  //         }
  //       }
  //   }, {
  //       name: 'TV',
  //       data: this.spend_graph.tv
  //   }]
  // };

  // define roi chart
  // highchart3 = Highcharts;   
  // chartOptions3:any = {     
  //   chart: {
  //     type: 'column',
  //     backgroundColor: 'transparent',
  //     style: {
  //       color: 'white',
  //       fontFamily: "'Inter', sans-serif"
  //     }

  //   },
  //   credits: {enabled: false},
  //   title: {
  //       text: 'ROI',
  //       style: {
  //         color: 'white',
  //         fontSize:'12px',
  //         font: 'Inter'
  //       }
  //   },
  //   xAxis: {
  //       categories: ['Base'],
  //       labels: {
  //         style: {
  //           color: 'white',
  //           font: 'Inter'
  //         }
  //       }
  //   },
  //   yAxis: {
  //     visible: false,
    
  //       min: 0,
  //       credits: {enabled: false},
  //       title: {
  //         text: '',
  //         font: 'Inter'
  //     }
  //   },
  //   legend: {
  //     reversed: true,
  //     itemStyle: {
  //       color: '#FFFFFF',
  //     fontFamily: "'Inter', sans-serif"
  //    }
     
  // },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.2,
  //       borderWidth: 0
  //   }
  //   },
  //   colors:['#0272D5','#02AFD5'],
  //   series: [{
  //       name: 'Digital',
  //       data: this.roi_graph.digital
  //   }, {
  //       name: 'TV',
  //       data: this.roi_graph.tv
  //   }]
  // };
   
  // define volume due to chart
  // highchart4 = Highcharts;
  // chartOptions4: any = {
  //   chart: {
  //     type: 'waterfall',
  //     backgroundColor: 'transparent',
  //     style: {
  //       color: 'blue',
  //       fontFamily: "'Inter', sans-serif"
  //     }

  //   },
  //   credits: {enabled: false},
  //   title: null,
    
  //   subtitle: {
  //       text: ''
  //   },
  //   xAxis: {
  //     categories: ['Base','Distribution', 'Price', 'Trade', 'TV', 'Digital','Scenario'],

  //     labels: {
  //       style: {
  //         color: 'white'
  //       }
  //     }
  //   },
  //   yAxis: {
  //     title: {
  //       text: ''
  //     },
  //     gridLineWidth: 0,
  //     minorGridLineWidth: 0
  //   },

  //   legend: {
  //     enabled: false,
  //     style: {
  //       fontFamily: "'Inter', sans-serif"
  //   }
  //   },
  //   tooltip: {
  //     // pointFormat: '<b>{point.y:,.1f}</b>'
  //   },
  //   column: {
  //     pointPadding: 0.2,
  //     borderWidth: 0
  //   },
  //   series: [{
  //     name: '',
  //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 112, -100]
  //   }]
  // };

  // define revenue chart
  // highchart8= Highcharts;
  // chartOptions8: any = {
  //   chart: {
  //     type: 'waterfall',
  //     backgroundColor: 'transparent',
  //     style: {
  //       color: 'blue',
  //       fontFamily: "'Inter', sans-serif"
  //     }

  //   },
  //   title: {
  //     text: '',
  //     style: {
  //       fontSize: '10px'
  //     }
  //   },
  //   xAxis: {
  //     categories: ['Base','Distribution', 'Price','Trade', 'TV', 'Digital','Scenario'],
  //     labels: {
  //       style: {
  //         color: 'white'
  //       }
  //     }
  //   },
  //   yAxis: {
  //     title: {
  //       text: ''
  //     },
  //     gridLineWidth: 0,
  //     minorGridLineWidth: 0
  //   },

  //   legend: {
  //     enabled: false
  //   },
  //   tooltip: {
  //     pointFormat: '<b>{point.y:,.1f}</b>'
  //   },
  //   plotOptions: {
  //     series: {
  //     stacking: 'normal',
  //      borderWidth: 0,
  //     },

  //   },
  //   series: [{
  //     upColor: "0c8ce9",
  //     color: "red",
  //     data: [{
  //         name: 'YAgo sale',
  //         y:10,
  //         color:" #0272D5"
  //     }, {
  //         name: 'Distribution',
  //         y: 5
  //     }, {
  //         name: 'Price',
  //         y: 8
  //      },     
  //     {
  //         name: 'TV',
  //         y: 4
  //     }, {
  //         name: 'Digital',
  //         y: 4
  //     }, 
      
    
  //   {
  //     name: 'Current Sale',
  //     isSum: false,
  //     color:" #0272D5"    
  //   }, 
      
  //   ],
      
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       fontWeight: 'bold'
  //     }
  //   },
  //   pointPadding: 0
  // }]

  // };    

  //get list of scenarios fo drop down to select
  getScenarios(simulation_id:any){
    this.commonService.getScenarios(simulation_id)
    .subscribe(
      data => {
        this.scenarios = data.scenario;             
      },
      error => {
        console.log(error);
    });   
  }

  groupDataForGraph() {
    let data: any = {};
    this.scenario_names_selected.forEach((sc: string)=> {
      // console.log(sc, " sc")
      data[sc] = {
        'media': {
          'all': this.media_scenario.filter((el: any)=> el.scenario_name == sc),
          'TV': this.media_scenario.filter((el: any)=> el.scenario_name == sc && (el.media_type == 'TV' && el.genre_platform == 'Total') ),
          'Digital': this.media_scenario.filter((el: any)=> el.scenario_name == sc && (el.media_type == 'Digital' && el.genre_platform == 'Total') )
        },
        'execution': {
          'all': this.execution_scenario.filter((el: any)=> el.scenario_name == sc)
        }
      };
      let channels: any = {};
      this.execution_scenario.forEach((es: any) => {
        let channel: string = es.channel;
        channels[channel] = [];
        channels[channel as keyof typeof channels] = this.execution_scenario.filter((el: any) => el.scenario_name == sc &&  el.channel == channel &&  el.pack_name == 'Total')
      });
      data[sc as keyof typeof data]['execution']['channels'] = channels;
    });
    return data;
  }

  updateGraph(data_for_graph: any) {
    //data_for_graph.object
    let scenarios = Object.keys(data_for_graph);
    this.spend_graph_tv = [
      data_for_graph[scenarios[0]].media.TV.length > 0 ? Number((Number(data_for_graph[scenarios[0]].media.TV[0].current_spends) / 1000).toFixed(0)) : 0
    ];
    this.roi_graph_tv = [
      data_for_graph[scenarios[0]].media.TV.length > 0 ? Number((Number(data_for_graph[scenarios[0]].media.TV[0].current_roi)).toFixed(0)) : 0
    ];
    let sgd = 0;
    let rgd = 0;
    data_for_graph[scenarios[0]].media.Digital.forEach((el: any)=> {
      sgd += Number(el.current_spends);
      rgd += Number(el.current_roi);
      // console.log(Number(el.current_roi),data_for_graph[scenarios[0]].media.Digital)
    });
    this.spend_graph_digital = [
      Number((sgd / 1000).toFixed(0))
    ];
    this.roi_graph_digital = [
      Number((rgd).toFixed(0))
    ];
    this.tv_volume = 0;
    this.digital_volume = 0;
    this.distribution_volume = 0;
    this.price_volume = 0;
    this.trade_volume = 0;
    scenarios.forEach((sc: string)=> {
      let media = data_for_graph[sc].media;
      let channels = Object.keys(data_for_graph[sc]['execution']['channels']);
      let channelsObj = data_for_graph[sc]['execution']['channels'];
      //sc = String(sc)
      this.spend_graph_tv.push(
        media.TV.length > 0 ? Number((Number(media.TV[0].scenario_spends) / 1000).toFixed(0)) : 0
      );
      if(media.TV.length > 0){
        if(media.TV[0].scenario_roi){
          this.roi_graph_tv.push(
            media.TV.length > 0 ? Number((Number(media.TV[0].scenario_roi)).toFixed(1)) : 0
          );
        } else {
          this.roi_graph_tv.push(0)
        }
      }
      if(media.TV.length > 0){
        if(media.TV[0].scenario_volume){
          this.tv_volume += media.TV.length > 0 ? Number(media.TV[0].scenario_volume) : 0;
        } else {
          this.tv_volume = 0;
        }
      }
      
      let sgd = 0;
      let rgd = 0;
      let volume = 0;
      media.Digital.forEach((el: any)=> {
        sgd += Number(el.scenario_spends);
        rgd += Number(el.scenario_roi);
        if(el.scenario_volume){
          this.digital_volume += Number(el.scenario_volume);
        } else {

          this.digital_volume = 0;
        }
        volume += Number(el.scenario_volume) != -1 ? Number(el.scenario_volume): 0;
      });
      this.spend_graph_digital.push(
        Number((sgd / 1000).toFixed(0))
      );      
      this.roi_graph_digital.push( 
        Number((rgd).toFixed(1))
      );

      media.TV.forEach((el: any)=> {
        if(el.scenario_volume){
          volume += Number(el.scenario_volume) != -1 ? Number(el.scenario_volume): 0;
        } else {
          volume = 0;
        }
      });

      let volume_distribution = 0;
      let volume_price = 0;
      let volume_trade = 0;
      channels.forEach((channel) => {
        let sdv = 0;
        let svp = 0;
        let svt = 0;
        channelsObj[channel].forEach((el: any)=> {
          sdv += Number(el['scenario_distribution_volume']) != -1 ? el['scenario_distribution_volume'] != null ?  Number(el['scenario_distribution_volume']) : 0 : 0;
          svp += Number(el['scenario_price_per_pack_volume']) != -1 ? el['scenario_price_per_pack_volume'] != null ?  Number(el['scenario_price_per_pack_volume']) : 0 : 0;
          svt += Number(el['scenario_trade_volume']) != -1 ? el['scenario_trade_volume'] != null ?  Number(el['scenario_trade_volume']) : 0 : 0;
        });
        volume_distribution += sdv;
        volume_price += svp;
        volume_trade += svt;
      });
      data_for_graph[sc]['execution']['volume_distribution'] = volume_distribution;
      data_for_graph[sc]['execution']['volume_price'] = volume_price;
      data_for_graph[sc]['execution']['volume_trade'] = volume_trade;
      this.distribution_volume += volume_distribution;
      this.price_volume += volume_price;
      this.trade_volume += volume_trade;

      volume += volume_distribution + volume_price + volume_trade;
      // console.log(volume)
      data_for_graph[sc as keyof typeof data_for_graph]['volume'] = volume;
    });
    //this.chartOptions2.xAxis.categories.push
    // this.barChartData.labels = ['Base'];
    // this.barChartData.labels.push(...this.scenario_names_selected);
    // this.spengraphdata.labels = ['Base'];
    // this.spengraphdata.labels.push(...this.scenario_names_selected);
    // this.roigrphChartData.labels = ['Base'];
    // this.roigrphChartData.labels.push(...this.scenario_names_selected);

    // this.growthBarLabels = ['Base'];
    this.growthBarLabels = [];
    this.growthBarLabels.push(...this.scenario_names_selected);
    this.spendBarlabels = ['Base'];
    this.spendBarlabels.push(...this.scenario_names_selected);
    this.roiBarLabels = ['Base'];
    this.roiBarLabels.push(...this.scenario_names_selected);

    // this.chartOptions2.xAxis.categories = ['Base'];
    // this.chartOptions2.xAxis.categories.push(...this.scenario_names_selected)
    // this.chartOptions3.xAxis.categories = ['Base'];
    // this.chartOptions3.xAxis.categories.push(...this.scenario_names_selected)

    // this.chartOptions2.series = [{
    //   name: 'Digital',
    //   data: this.spend_graph_digital
    // }, {
    //   name: 'TV',
    //   data: this.spend_graph_tv
    // }];

    // this.chartOptions3.series = [{
    //   name: 'Digital',
    //   data: this.roi_graph_digital
    // }, {
    //   name: 'TV',
    //   data: this.roi_graph_tv
    // }];


    let series_data: any = [];
    let seriesBardData:any = [];
    scenarios.forEach((sc: string)=> {
      seriesBardData.push(Number((Number(data_for_graph[sc as keyof typeof data_for_graph]['volume'])/Number(this.dataService.newRecommendedValues.current_volume) - 1).toFixed(2)) * 10)
    });
    console.log(seriesBardData)
    this.barChartData = {
      labels:this.growthBarLabels,
      datasets: [
        {
          data: seriesBardData, label: ['Growth Ambition'], backgroundColor: ['#0272D5', '#02AFD5'],
          display: false,
          maxBarThickness: 30,
          hoverBackgroundColor:['#0272D5', '#02AFD5']
        },
      ]
    }
    // this.chartOptions.series = [{
    //   type: 'solidgauge',
    //   name: 'Speed',
    //   data: series_data,
    //   dataLabels: {
    //       enabled: false
    //   },
    //   tooltip: {
    //       pointFormat: '{point.name}: <b>{point.y}</b> %'
    //   }
    //   }, {
    //     type: 'gauge',
    //     // to show speedo meter
    //     // data: [Number(((this.s2_volume_total/this.dataService.newRecommendedValues.current_volume) - 1).toFixed(2)) * 100]
    //     // data: [30]
    // }];

    //console.log(Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)),Number(this.s2_volume_total))

    
    //this.chartOptions4.series[0].data = [49.9, 71.5, 106.4, 129.2, 144.0, 112, -100];
    // this.chartOptions4.series[0].data = [
    //   Number(this.dataService.newRecommendedValues.current_volume.toFixed(1)),
    //   Number(this.distribution_volume.toFixed(1)),
    //   Number(this.price_volume.toFixed(1)),
    //   Number(this.trade_volume.toFixed(1)),
    //   Number((this.tv_volume/1).toFixed(1)),
    //   Number((this.digital_volume/1).toFixed(1)),
    //   100

    // ];
    // this.chartOptions8.series[0].data = [
    //     {
    //       name: 'Current',
    //       y: Number((this.dataService.newRecommendedValues.current_volume*this.current_price_per_volume_for_all).toFixed(1)),
    //       color:" #0272D5"
    //     }, {
    //         name: 'Distribution',
    //         y: Number((this.distribution_volume*this.current_price_per_volume_for_all).toFixed(1))
    //       }, {
    //         name: 'Price',
    //         y: Number((this.price_volume*this.current_price_per_volume_for_all).toFixed(1))
    //     }, {
    //         name:'Trade',
    //         y: Number((this.trade_volume*this.current_price_per_volume_for_all).toFixed(1))
    //     },        
    //     {
    //         name: 'TV',
    //         y: Number((this.tv_volume*this.current_price_per_volume_for_all).toFixed(1))
    //     }, {
    //         name: 'Digital',
    //         y: Number((this.digital_volume*this.current_price_per_volume_for_all).toFixed(1))
    //     }, 
    //     {
    //       name: 'Scenario',
    //       isSum: true,
    //       color:" #0272D5",
    //     }
    // ];
    this.roiValues();
    this.volumeDuetoScenarioValues();
    this.spendChartGraphValue();
    this.revenueScenarioValues();
    // menu item dat
    this.getCSVData(this.selectedBrand);
  }

  // select scenario name for comparison
  scenarioChecked(event:any){
    this.clickedScenario = event.source.value;
    //do not allow more than 2 scenarios to go for request to backend
    if(this.scenario_names_selected.length < 2){
      this.scenario_names_selected.push(event.source.value);
    }
    if(this.media_scenario) {
      this.onMediaChange(this.selectedMedia);
    }
    setTimeout (() => {
      this.compareScenarios(undefined);
    }, 1000);
  }
  cachePortfolioData(data: any) {
    if(!this.portfolio) {
      this.portfolio = data;
    }
  }

  compareScenarios(brand: any) {
    let payload = {scenario_name:this.scenario_names_selected, 'simulation_id':this.commonService.selectedDetails.simulation_id, brand: undefined};
    if (brand) {
      payload['brand'] = brand;
    }
    this.dataService.compareScenarios(payload)
        .subscribe(
        data => {
          this.cachePortfolioData(data);
          this.media_scenario = data.media_scenarios;
          this.execution_scenario = data.execution_scenarios;
          this.current_price_per_volume_for_all = this.media_scenario.length > 0 ? this.media_scenario[0]['current_price_per_volume'] : this.current_price_per_volume_for_all;
          let data_for_graph: any = this.groupDataForGraph();

          this.updateGraph(data_for_graph);

          
          this.updateFlag = true;
          this.display_result = true;


        },
        error => {
          this.notifyService.showError(error,'',3000)
        }); 
  }

 //completed sceanrio dialog popup
  openDialog(): void {
    console.log(this.scenarios);
    if (this.scenarios.length > 0){
    const dialogRef = this.dialog.open(CompareDialogComponent, {
      width: '250px',
      data: this.scenarios
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.completedScenario = result;
      // this.selectedScenarioSubscription();
      console.log(result);
      if (result){
        let data:any = {}
        data['scenario_name'] =  result;
        data['simulation_id'] =  this.commonService.view_simulation_id;
        this.dataService.compelteScenario(data).subscribe(data =>{
          if(data){
            this.notification.showSuccess("Scenario completed successfully!",'',3000);
            this.dataService.updateSimualtionStatus();
          }
        },
        error => {
          this.notification.showSuccess(error,'',3000)
        });
      }
    });
  }
  else{
    this.notification.showError('No sceanrios present,please add scenarios','',3000)
  }
}

selectedScenarioSubscription(){
  this.dataService.trigInputName$.subscribe((name)=>{
    this.selectedScenarioName = name;
  })
}


  selectBrand(brand:any){
    this.compareScenarios(brand);
  } 

  ngOnInit(): void {
    this.brand_list = this.commonService.brandList;
    this.selectedBrand = this.brand_list[0];
    this.getChannels();
    this.dataService.updateSimualtionStatus();
    this.dataService.simulation_status$.subscribe(data=>{
      this.simulation_status = data;
    });
    this.getScenarios(this.commonService.selectedDetails);
    this.selectedScenarioSubscription();
    this.sendDataToHeader();
  }

  // vlume due to scenario 
  volumeDuetoScenarioValues(){
    let currValue = Number(this.dataService.newRecommendedValues.current_volume.toFixed(1));
    let distVolume = Number(currValue + Number(this.distribution_volume.toFixed(1)));
    let priceVolume = Number(distVolume + Number(this.price_volume.toFixed(1)));
    let trdVolume = Number(priceVolume + Number(this.trade_volume.toFixed(1)));
    let tvValue = Number(trdVolume + Number(Number(this.tv_volume/1).toFixed(1)));
    let digvolume = Number(tvValue + Number(Number(this.digital_volume/1).toFixed(1)));
    // console.log(currValue, distVolume, priceVolume, trdVolume, tvValue, digvolume )
    let volBarData = 
    // this.floatVolumeBarChartData = 
    {
      labels: ['Base','Distribution', 'Price', 'Trade', 'TV', 'Digital','Scenario'],
      datasets: [
        {
          type: 'line',
          label: 'Normal',
          data: [currValue,distVolume, priceVolume, trdVolume, tvValue, digvolume, digvolume],
          fill: false,
          borderColor:'#0272D5',
          backgroundColor: '#0272D5',
          hoverBackgroundColor: ['#0272D5'],
          maxBarThickness: 30,
        },
        {
          type: 'bar',
          label: 'Normal',
          data: [[currValue],
          [currValue, distVolume],
          [distVolume, priceVolume],
          [priceVolume,trdVolume],
          [trdVolume,tvValue],
          [tvValue, digvolume], 
          [digvolume]
        ], 
          backgroundColor: '#0272D5',
          maxBarThickness: 30,
          borderColor:'#0272D5',
          hoverBackgroundColor: ['#0272D5'],
          fill: false,
        },
      ]
      
    };
    this.floatVolumeBarChartData = volBarData;
    let scenarioSelectedName = "Volume Due To" + "-" + this.clickedScenario;
    this.selectedClickedScenario = scenarioSelectedName;
    let scenaVoluObj = {
      scenarioName: scenarioSelectedName,
      scenarioVolumeGrph : volBarData 
    }
    if(this.scenarioVolGrphArr.length>1){
        let checkedScenario = this.scenarioVolGrphArr.find((x: any) => 
      x.scenarioName === scenarioSelectedName)
      if(checkedScenario){
      } else {
        this.scenarioVolGrphArr.push(scenaVoluObj);
        this.checkedScenarios.push(scenarioSelectedName);
      }
    } else {
      this.scenarioVolGrphArr.push(scenaVoluObj);
      this.checkedScenarios.push(scenarioSelectedName)
    }
    if(scenarioSelectedName === "Volume Due To-s1" ){
      this.s1VolumeDueto = JSON.stringify(scenaVoluObj);
      this.floatRevenueBarChartData = volBarData;
    }
    // this.ChangeVolumeDueCharts("Volume Due To-s1")
  }
  spendChartGraphValue(){
    this.spengraphdata = {
      labels: this.spendBarlabels,
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
  roiValues(){
    // console.log(this.roi_graph_digital,this.roi_graph_tv)
    this.roigrphChartData = {
      labels: this.roiBarLabels,
  datasets: [
    { data: this.roi_graph_digital, label: 'Digital', backgroundColor: '#0272D5',
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.9,
    fill: false,
    hoverBackgroundColor: ['#0272D5']
   },
    { data: this.roi_graph_tv, label: 'TV', backgroundColor: '#02AFD5',
    maxBarThickness: 30,
        barPercentage: 5,/* change this */
        categoryPercentage: 0.9,
        hoverBackgroundColor: ['#02AFD5'],
    fill: false, }
  ]
    }
  }
  revenueScenarioValues(){
    let currvalue =   Number((this.dataService.newRecommendedValues.current_volume*this.current_price_per_volume_for_all).toFixed(1));
    let distbValue = Number(currvalue) + Number((this.distribution_volume*this.current_price_per_volume_for_all).toFixed(1));
      let priceVolume = Number(distbValue +  Number((this.price_volume*this.current_price_per_volume_for_all).toFixed(1)));
    let trdVolume = Number(priceVolume + Number((this.trade_volume*this.current_price_per_volume_for_all).toFixed(1)));
  let tvValue = Number(trdVolume + Number((this.tv_volume*this.current_price_per_volume_for_all).toFixed(1)));
  let digvolume = Number(tvValue + Number((this.digital_volume*this.current_price_per_volume_for_all).toFixed(1)));
    let totVolume = digvolume;
  // console.log(currvalue, distbValue, priceVolume, trdVolume, tvValue, digvolume , totVolume)
  let volRevBarData = 
  {
    labels: ['Current','Distribution','Price','Trade','TV','Digital','Scenario'],
    datasets: [
      {
        type: 'line',
        label: '',
        data: [currvalue, distbValue,priceVolume,trdVolume, tvValue, digvolume,totVolume,totVolume ],
        fill: false,
        borderColor:'#0272D5',
        backgroundColor: '#0272D5',
        hoverBackgroundColor: ['#0272D5']
      },
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
        backgroundColor: '#0272D5',
        borderColor:'#0272D5',
        hoverBackgroundColor: ['#0272D5'],
        maxBarThickness: 30,
        fill: false,
      }
    ]
  };
  // this.floatRevenueBarChartData = volRevBarData;
    let scenarioSelectedName = "Incremental Revenue" + "-" + this.clickedScenario;
    // this.selectedClickedScenario = scenarioSelectedName;
    let scenaVoluObj = {
      scenarioName: scenarioSelectedName,
      scenarioVolumeGrph : volRevBarData 
    }
    if(this.scenarioVolGrphArr.length>1){
      let checkedScenario = this.scenarioVolGrphArr.find((x: any) => 
    x.scenarioName === scenarioSelectedName)
    if(checkedScenario){
      // this.scenarioVolGrphArr.push(scenaVoluObj);
      // this.checkedScenarios.push(scenarioSelectedName);
    } else {
      this.scenarioVolGrphArr.push(scenaVoluObj);
      this.checkedScenarios.push(scenarioSelectedName);
    }
    } else {
      this.scenarioVolGrphArr.push(scenaVoluObj);
      this.checkedScenarios.push(scenarioSelectedName);
    }
  }
  downloadData() {
    let payload = {
      simulation_id: this.commonService.selectedDetails.simulation_id
    }
    
    this.dataService.downloadScenarios(payload)
        .subscribe(
        data => {
          
          this.blob = new Blob([data], {type: 'application/excel'});

          var downloadURL = window.URL.createObjectURL(data);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = this.commonService.selectedDetails.country+'_'+this.commonService.selectedDetails.name+'.xlsx';
          link.click();

        },
        error => {
          this.notifyService.showError(error,'',3000)
        }); 
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
  sendDataToHeader(){
    let arr = [];
    let simObj = {
      "selectedBrand": this.selectedBrand,
      "total_volume": this.total_volume,
      "growthAchieved": this.growthAchieved,
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
  ChangeVolumeDueCharts(sname: any){
    this.floatVolumeBarChartData = null;
    if(sname === "Volume Due To-s1" ){
      let Vs1 = JSON.parse(this.s1VolumeDueto);
      this.floatVolumeBarChartData = Vs1.scenarioVolumeGrph;
    } else {
      let checkedScenario = this.scenarioVolGrphArr.find((x: any) => x.scenarioName === sname);
      this.floatVolumeBarChartData = checkedScenario.scenarioVolumeGrph;
    }
  }
}
