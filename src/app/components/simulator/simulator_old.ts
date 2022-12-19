import { Component, OnInit } from '@angular/core';
import {OpenDialogComponent} from '../open-dialog/open-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts/highcharts';
// const HighchartsMore = require("highcharts/highcharts-more.src");
// const HC_solid_gauge = require("highcharts/modules/solid-gauge.src");
// HC_solid_gauge(Highcharts);


import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

import { ExecutionService } from 'src/app/services/execution.service';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isTemplateExpression } from 'typescript';
import { ContentObserver } from '@angular/cdk/observers';


HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
// import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  showDiv = {
    Mfilter : false,
    current : false,
    tvFilter : false,
    MediaFilter : false
  }

  
  model:any;
  execution: any = false;
  media:any = false;
  media_graph: any = false;
  media_table: any = false;
  showgraph = 'volume';
  selectedDetails: any;
  selectedChannel: any = "";
  channels: any = [];
  distribution_type: any;

  price_pack_current_standings: any = [];
  pack_mix_current_standings: any = [];
  da_current_standings: any= [];

  recommended_values:any;
  simulation_parameters:any;

  tv_recommended_grp: any  = [];
  tv_recommended_spend: any  = [];
  tv_recommended_roi: any  = [];
  tv_recommended_vc: any  = [];


  digital_recommended_grp: any = [];
  digital_recommended_spend: any = [];
  digital_recommended_roi: any = [];
  digital_recommended_vc: any = [];

  selectedMedia = '';
  media_details: any = [];
  scenario_val: any = {};

  highcharts5: any;
  chartOptions5: any;

  highcharts6: any;
  chartOptions6: any;

  media_graph_spend: any = [];
  media_graph_grp: any = [];

  new_volume: any;
  new_volume_scenario:  any;
  d:any;
  brand_list: any;
  selectedBrand: any = '';
  scenario_name: any = '';

  all_media_details:any;
  tv_scenario:any= '';
  digital_scenario:any = '';
  distribution_scenario:any = '';
  total_val_distribution: any = '';

  filled_media_details: any = '';
  filled_execution_details: any = '';


  
  constructor(public dialog: MatDialog,private executionService:ExecutionService,private commonService:CommonService, private dataService:DataService){
      this.model = {name: null, ExeCution: false, Media: false,};
      this.getChannels();
  }

  getChannels(){
    this.selectedDetails = this.commonService.selectedDetails;
   
    this.commonService.getChannels(this.selectedDetails)
    .subscribe(
       data => {
          this.channels = data.channels;             
       },
       error => {
          console.log(error);
       });
  }

  onExecution(channel:any){
    this.selectedMedia = ''
    this.selectedDetails.channel = channel;
    if(channel != 'all'){
      this.execution = true;
      this.media = false;
    }
   
    this.executionService.getPackDetailsByChannel(this.selectedDetails)
    .subscribe(
       data => {
          if(this.filled_execution_details != ''){
           data.price_pack_current_standings = this.filled_execution_details;
          } else {
            this.price_pack_current_standings = data.pack_details;
          }
          this.total_val_distribution = data.total;
          if(Number(data.distribution_type.tdp) != 0){
            this.distribution_type = "TDP Share"
            this.d= "p.distribution_type_tdp";
          } else if(Number(data.distribution_type.nd) != 0){
            this.distribution_type = "ND"
          }
          else if(Number(data.distribution_type.wd) != 0){
            this.distribution_type = "WD"
          }
          this.commonService.setExecutionData(this.price_pack_current_standings);
       },
       error => {
          console.log(error);
       });
  }

  graphChange(event:any){
    this.showgraph = event.value;
    
  }

  onMediaChange(type:any){
    this.selectedChannel = '';
    this.media_details = [];
    if(type != 'all'){
      this.media = true;
      this.execution = false;
    }
    this.selectedDetails.media_type = type;


    this.executionService.getMediaDetails(this.selectedDetails)
    .subscribe(
       data => {
          if(this.filled_media_details != ''){
            data.media_details_all = this.filled_media_details;
          }
          for(let i=0; i<data.media_details_all.length; i++) {
            
            if(data.media_details_all[i].media_type == 'TV'){
              this.media_details.push({
                ...data.media_details_all[i], 
                ...(this.tv_recommended_grp.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform)),
                ...(this.tv_recommended_spend.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform)),
                ...(this.tv_recommended_roi.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform)),
                ...(this.tv_recommended_vc.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform))}
              );
            } if(data.media_details_all[i].media_type == 'Digital'){
              this.media_details.push({
                ...data.media_details_all[i], 
                ...(this.digital_recommended_spend.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform)),
                ...(this.digital_recommended_roi.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform)),
                ...(this.digital_recommended_vc.find((itmInner:any) => itmInner.genre_platform === data.media_details_all[i].genre_platform))}
              );   
            }
              
          }

          console.log(data.media_details);
        // if(type == 'TV'){
        //   for(let i=0; i<data.media_details_tv.length; i++) {
        //       this.media_details.push({
        //         ...data.media_details_tv[i], 
        //         ...(this.tv_recommended_grp.find((itmInner:any) => itmInner.genre_platform === data.media_details_tv[i].genre_platform)),
        //         ...(this.tv_recommended_spend.find((itmInner:any) => itmInner.genre_platform === data.media_details_tv[i].genre_platform)),
        //         ...(this.tv_recommended_roi.find((itmInner:any) => itmInner.genre_platform === data.media_details_tv[i].genre_platform)),
        //         ...(this.tv_recommended_vc.find((itmInner:any) => itmInner.genre_platform === data.media_details_tv[i].genre_platform))}
        //       );
        //   }
        //   this.tv_scenario =  this.media_details;
        // } else if(type == 'Digital'){
        //   for(let i=0; i<data.media_details_digital.length; i++) {

        //     this.media_details.push({
        //       ...data.media_details_digital[i], 
        //       ...(this.digital_recommended_spend.find((itmInner:any) => itmInner.genre_platform === data.media_details_digital[i].genre_platform)),
        //       ...(this.digital_recommended_roi.find((itmInner:any) => itmInner.genre_platform === data.media_details_digital[i].genre_platform)),
        //       ...(this.digital_recommended_vc.find((itmInner:any) => itmInner.genre_platform === data.media_details_digital[i].genre_platform))}
        //     );              
        //   }
        //   this.digital_scenario = this.media_details;
        // }
     


        var t =  data.media_details_all.filter((x: any) => x.genre_platform != 'Total')

        this.media_graph_spend = [];
        t.forEach((currentValue:any, index:any) => {
          this.media_graph_spend.push([currentValue['genre_platform'], Number((currentValue['current_spends']/1000000).toFixed(2))])
          // this.media_graph_spend[currentValue['genre_platform']] = Number((currentValue['current_spends']/1000000).toFixed(2));
        });
        console.log(this.media_graph_spend);

        this.media_graph_grp = [];
        t.forEach((currentValue:any, index:any) => {
          if(type == 'TV'){
            this.media_graph_grp.push([currentValue['genre_platform'], Number(currentValue['current_grp'])])
          } else {
            
            this.media_graph_grp.push([currentValue['genre_platform'], Number(currentValue['current_reach_metric_value'])])

          }
          // this.media_graph_spend[currentValue['genre_platform']] = Number((currentValue['current_spends']/1000000).toFixed(2));
        });

        this.highcharts5 = Highcharts;
        this.chartOptions5 = {     
          chart: {
            renderTo: 'container',
            type: 'pie'
        },
        title: {
          text: (type == 'TV') ? 'TV Spend' : 'Digital Spend'
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        plotOptions: {
            pie: {
                shadow: false
            }
        },
        
        series: [{
            name: '',
            data: this.media_graph_spend,
            size: '80%',
            innerSize: '20%',
            showInLegend:true,
            dataLabels: {
                enabled: false
            }
        }]
        };

        this.highcharts6 = Highcharts;
        this.chartOptions6 = {     
          chart: {
            renderTo: 'container',
            type: 'pie'
        },
        title: {
            text: (type == 'TV') ? 'TV GRP' : 'Digital GRP'
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        plotOptions: {
            pie: {
                shadow: false
            }
        },
        
        series: [{
            name: '',
            data: this.media_graph_grp,
            size: '80%',
            innerSize: '20%',
            showInLegend:true,
            dataLabels: {
                enabled: false
            }
        }]
        };


         

         
        
        console.log(this.media_details);
       },
       error => {
          console.log(error);
    });
  }

  title = 'appComponent';
    
  isShowDiv = true;
   
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

 


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {  
    chart: {
      type: 'solidgauge',
      // height: '100%',
        width: 320,
        backgroundColor: 'transparent'
  },

  credits: {
      enabled: false
  },

  title: {
      text: ' '
  },

  subtitle: {
      text: ''
  },

  pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: [{
          backgroundColor: 'transparent',
          borderColor: 'grey',
          innerRadius: '45%',
          outerRadius: '88%',
          shape: 'arc'
      }]
  },

  // the value axis
  yAxis: {
      // stops: [
      //     [0.1, '#55BF3B'], // green
      //     [0.5, '#DDDF0D'], // yellow
      //     [0.9, '#DF5353'] // red
      // ],
      lineWidth: 0,
      minorTickInterval: null,
      min: 0,
      max: 100,
      tickPixelInterval: 400,
      tickWidth: 0,
      labels: {
          y: 16
      }
  },
  series: [{
    type: 'solidgauge',
    name: 'Speed',
    data: [{
        name: 'First car',
        radius: 98,
        innerRadius: 82,
        color:'red',
        y: 80
      }, {
        name: 'Second car',
        radius: 78,
        innerRadius: 62,
        color:'blue',
        y: 160
    }, {
        name: 'Third car',
        radius: 48,
        innerRadius: 55,
        color:'purple',
        y: 160
    }],
    dataLabels: {
        enabled: false
    },
    tooltip: {
        pointFormat: '{point.name}: <b>{point.y}</b> km/h'
    }
}]
    };
  
    spend_graph: any = {
      'digital': [2,2],
      'tv': [4.5, 1]
    }

    roi_graph: any = {
      'digital': [2, 3],
      'tv': [3.5, 2]
    }


    highchart2 = Highcharts;
    chartOptions2:any = {     
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',

      },
      credits: {enabled: false},
      title: {
          text: 'Spend',
          style: {
            color: 'white',
            fontSize:'12px'
          }
      },
      xAxis: {
          categories: ['Current', 'Recommended', 'Scenario'],
          labels: {
            style: {
              color: 'white'
            }
          }
      },
      yAxis: {
        visible: false,
      
          min: 0,
          credits: {enabled: false},
          title: {
              text: '',
              fontSize:'12px'
            
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal'
          }
      },
      series: [{
          name: 'Digital',
          data: this.spend_graph.digital,
          labels: {
            style: {
              color: 'white'
            }
          }
      }, {
          name: 'TV',
          data: this.spend_graph.tv
      }]
    };



    highchart3 = Highcharts;
    
    chartOptions3:any = {     
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          style: {
            color: 'white',
          }

      },
      credits: {enabled: false},
      title: {
          text: 'ROI',
          style: {
            color: 'white',
            fontSize:'12px'
          }
      },
      xAxis: {
          categories: ['Current', 'Recommended','Scenario'],
          labels: {
            style: {
              color: 'white'
            }
          }
      },
      yAxis: {
        visible: false,
      
          min: 0,
          credits: {enabled: false},
          title: {
              text: ''
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
      },
      series: [{
          name: 'Digital',
          data: this.roi_graph.digital
      }, {
          name: 'TV',
          data: this.roi_graph.tv
      }]
    };


    

    updateFlag = false;
    new_values: any = {};

    onTryScenario(val:any){
      this.updateFlag = false;
      this.filled_media_details = this.media_details;

      if(this.selectedDetails.media_type == 'TV'){
        this.media_details.forEach((currentValue:any, index:any) => {
          console.log(currentValue);
          if(currentValue['try_scenario'] != ""){
            this.scenario_val[currentValue['genre_platform'] + '_tv'] = currentValue['try_scenario'];
          }
        });
      } else if(this.selectedDetails.media_type == 'Digital'){
        this.media_details.forEach((currentValue:any, index:any) => {
          if(currentValue['try_scenario'] != ""){
            this.scenario_val[currentValue['genre_platform'] + '_digital'] = currentValue['try_scenario'];
          }
        });
      }

      for (let key in this.simulation_parameters['user_input']) {
        this.simulation_parameters['user_input'][key] = this.scenario_val.hasOwnProperty(key) ? this.scenario_val[key] : this.simulation_parameters['user_input'][key];
      }


      this.simulation_parameters.try_scenario = true;
      this.dataService.runSimulator(this.simulation_parameters)
      .subscribe(
      data => {
        this.new_values =  data;
        console.log(this.new_values);
        this.dataService.setRecommendedValues(data); 

        this.chartOptions2.series = [{
          name: 'Digital',
          data: [this.simulation_parameters.digital_current_total_spends, this.recommended_values.total_digital_spends, Number(this.new_values.total_digital_spends)]
        }, {
          name: 'TV',
          data:[this.simulation_parameters.tv_current_total_spends, this.recommended_values.total_tv_spends, Number(this.new_values.total_tv_spends)]
        }];

        this.chartOptions3.series = [{
          name: 'Digital',
          data: [Number(this.simulation_parameters.digital_current_total_roi), this.recommended_values.total_digital_roi, Number(this.new_values.total_digital_roi)]
        }, {
          name: 'TV',
          data:[Number(this.simulation_parameters.tv_current_total_roi), this.recommended_values.total_tv_roi, Number(this.new_values.total_tv_roi)]
        }];


        this.chartOptions4.series[0].data = [{
          name: 'Current',
          y:Number((this.simulation_parameters.current_volume/1000000).toFixed(1)),
          color:" #8e8b89"
          },{
            name: 'Distribution',
            y: Number(((0 + Number(this.recommended_values.total_current_distribution))/1000000).toFixed(1))
          }, {
            name: 'Price',
            y: Number(((0 + Number(this.recommended_values.total_current_price))/1000000).toFixed(1))
          },
          {
            name: 'TV',
            y: Number(((0 + this.new_values.total_tv_vc)/1000000).toFixed(1))
          }, 
          {
            name: 'Digital',
            y:Number(((0 + this.new_values.total_digital_vc)/1000000).toFixed(1))
          },  
          {
            name: 'New',
            isSum: true,
            color:" #8e8b89"    
          },    
        ];

        this.chartOptions8.series[0].data = [{
          name: 'Current',
          y:Number(((this.simulation_parameters.current_volume/1000000) * 9).toFixed(1)),
          color:" #8e8b89"
          },{
            name: 'Distribution',
            y: Number((((0 + Number(this.recommended_values.total_current_distribution))/1000000) * 9).toFixed(1))
          }, {
            name: 'Price',
            y: Number((((0 + Number(this.recommended_values.total_current_price))/1000000) * 9).toFixed(1))
          },
          {
            name: 'TV',
            y: Number((((0 + this.new_values.total_tv_vc)/1000000) * 9).toFixed(1))
          }, 
          {
            name: 'Digital',
            y:Number((((0 + this.new_values.total_digital_vc)/1000000) * 9).toFixed(1))
          },  
          {
            name: 'New',
            isSum: true,
            color:" #8e8b89"    
          },    
        ];

        this.new_volume_scenario = this.simulation_parameters.current_volume + Number(this.recommended_values.total_current_distribution) +
        Number(this.recommended_values.total_current_price) + this.new_values.total_tv_vc + this.new_values.total_digital_vc;

        this.chartOptions.series = [{
          type: 'solidgauge',
          name: 'Speed',
          data: [
            {
              name: 'Your Scenario',
              radius: 85,
              innerRadius: 80,
              color:'white',
              y: Number(((this.new_volume_scenario/this.simulation_parameters.current_volume) - 1).toFixed(2)) * 10
            }, 
            {
              name: 'Growth Achieved',
              radius: 78,
              innerRadius: 62,
              color:'green',
              y: Number(((this.new_volume/this.simulation_parameters.current_volume) - 1).toFixed(2)) * 10
          }, {
              name: 'Growth Ambition',
              radius: 48,
              innerRadius: 60,
              color:'blue',
              y: this.simulation_parameters.growth_ambition
          }],
          dataLabels: {
              enabled: false
          },
          tooltip: {
              pointFormat: '{point.name}: <b>{point.y}</b> %'
          }
          }, {
            type: 'gauge',
            data: [Number(((this.new_volume/this.simulation_parameters.current_volume) - 1).toFixed(2)) * 10]
          }];
        this.updateFlag = true;

        // this.calculate_recommendations(data); 
        // this.router.navigateByUrl('/simulator');     
      },
      error => {
        console.log(error);
      });
       

      this.chartOptions4.series = [{
        name: '',
        data: [89, 71.5, 100.4, 120.2, 120.0]
      }]
      this.updateFlag = true;
    }

    // onTryExecutionScenarioPrice(exe:any){
    //   console.log(exe)
    //   this.executionService.execution_levers(exe)
    //   .subscribe(
    //   data => {
    //     this.new_values =  data;
    //     console.log(this.new_values);
    //     // this.dataService.setRecommendedValues(data); 
    //     // this.calculate_recommendations(data); 
    //     // this.router.navigateByUrl('/simulator');     
    //   },
    //   error => {
    //     console.log(error);
    //   });
    // }
  
    onTryExecutionScenario(exe:any){
      this.filled_execution_details =  this.price_pack_current_standings;
      this.executionService.execution_levers(exe)
      .subscribe(
      data => {
        this.new_values =  data;
        console.log(this.new_values);
        // this.dataService.setRecommendedValues(data); 
        // this.calculate_recommendations(data); 
        // this.router.navigateByUrl('/simulator');     
      },
      error => {
        console.log(error);
      });
    }

  highchart4= Highcharts;
  formatter:any;
  chartOptions4: any = {
    chart: {
      type: 'waterfall',
      backgroundColor: 'transparent',
      style: {
        color: 'white',
      }

    },
    title: {
      text: '',
      style: {
        fontSize: '10px'
      }
    },
    xAxis: {
      categories: ['Current','Distribution', 'Price', 'TV', 'Digital','New']
    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineWidth: 0,
      minorGridLineWidth: 0
    },

    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<b>{point.y:,.1f}</b>'
    },
    plotOptions: {
      series: {
      stacking: 'normal',
       borderWidth: 0,
      },

    },
    series: [{
      upColor: "green",
      color: "red",
      data: [{
          name: 'YAgo sale',
          y:10,
          color:" #8e8b89"
      }, {
          name: 'Distribution',
          y: 5
      }, {
          name: 'Price',
          y: 8
       },
      /// {
      //     name: 'Positive Balance',
      //     isIntermediateSum: true,
      //     color: Highcharts.getOptions().colors[1]
      // }, 
      {
          name: 'TV',
          y: 4
      }, {
          name: 'Digital',
          y: 4
      }, 
      
    
    {
      name: 'Current Sale',
      isSum: false,
      color:" #8e8b89"    
    }, 
      // {
      //     name: 'Balance',
      //     isSum: true,
      //     color: Highcharts.getOptions().colors[1]
      // }
    ],
      
    dataLabels: {
      enabled: true,
          // formatter: function () {
          //     return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
          // },
      style: {
        fontWeight: 'bold'
      }
    },
    pointPadding: 0
  }]

  };


  highchart8= Highcharts;
  chartOptions8: any = {
    chart: {
      type: 'waterfall',
      backgroundColor: 'transparent',
      style: {
        color: 'white',
      }

    },
    title: {
      text: '',
      style: {
        fontSize: '10px'
      }
    },
    xAxis: {
      categories: ['Current','Distribution', 'Price', 'TV', 'Digital','New']
    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineWidth: 0,
      minorGridLineWidth: 0
    },

    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<b>{point.y:,.1f}</b>'
    },
    plotOptions: {
      series: {
      stacking: 'normal',
       borderWidth: 0,
      },

    },
    series: [{
      upColor: "green",
      color: "red",
      data: [{
          name: 'YAgo sale',
          y:10,
          color:" #8e8b89"
      }, {
          name: 'Distribution',
          y: 5
      }, {
          name: 'Price',
          y: 8
       },
     
      {
          name: 'TV',
          y: 4
      }, {
          name: 'Digital',
          y: 4
      }, 
      
    
    {
      name: 'Current Sale',
      isSum: false,
      color:" #8e8b89"    
    }, 
      
    ],
      
    dataLabels: {
      enabled: true,
          // formatter: function () {
          //     return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
          // },
      style: {
        fontWeight: 'bold'
      }
    },
    pointPadding: 0
  }]

  };


    
   
  formSubmit(){
    // console.log('form submit request');
  }

  open(){
    const dialogRef = this.dialog.open(OpenDialogComponent, {
      width: '400px',
      data: 'filter'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.scenario_name = result;
      console.log(this.scenario_name)
      this.saveScenario();
    });
  }

  saveScenario(){
    console.log(this.price_pack_current_standings)
    this.dataService.saveScenario({'media_details': this.media_details, 
    'tv_scenario': this.tv_scenario, 
    'digital_scenario':this.digital_scenario, 
    'distribution_scenario': this.price_pack_current_standings,
     'scenario_name':this.scenario_name, 
     'simulation_id':this.selectedDetails.simulation_id})
    .subscribe(
      data => {
        //  this.channels = data;             
      },
      error => {
         console.log(error);
      });
  }

  total_tv_grp:any = 0;
  total_digital_grp:any = 0;


  calculate_recommendations(recommended_val:any){
    for (let key in recommended_val['grp_recommendations']) {
      if(key.includes('_tv')){
        var new_key = key.replace('_tv','');
        this.tv_recommended_grp.push({'genre_platform':new_key, 'recommended_grp': recommended_val['grp_recommendations'][key][0]})
      } else if(key.includes('_digital')){
        var new_key = key.replace('_digital','');
        this.digital_recommended_grp.push({'genre_platform':new_key, 'recommended_grp': recommended_val['grp_recommendations'][key][0]})
      }
    }
    this.tv_recommended_grp.forEach((item:any, index:any) => {
      this.total_tv_grp += item.recommended_grp;
    });

    this.digital_recommended_grp.forEach((item:any, index:any) => {
      this.total_digital_grp += item.recommended_grp;
    });

    for (let key in recommended_val['tv_spend_recommendation']) {
        var new_key = key.replace('_tv','');
        this.tv_recommended_spend.push({'genre_platform':new_key, 'recommended_spend': recommended_val['tv_spend_recommendation'][key][0]})
    }

    for (let key in recommended_val['tv_roi']) {
      var new_key = key.replace('_tv','');
      this.tv_recommended_roi.push({'genre_platform':new_key, 'recommended_roi': recommended_val['tv_roi'][key][0]})
    }

    for (let key in recommended_val['tv_vc']) {
      var new_key = key.replace('_tv','');
      this.tv_recommended_vc.push({'genre_platform':new_key, 'recommended_vc': recommended_val['tv_vc'][key][0]})
    }


    for (let key in recommended_val['digital_spend_recommendation']) {
      var new_key = key.replace('_digital','');
      this.digital_recommended_spend.push({'genre_platform':new_key, 'recommended_spend': recommended_val['digital_spend_recommendation'][key][0]})
    }

    for (let key in recommended_val['digital_roi']) {
      var new_key = key.replace('_digital','');
      this.digital_recommended_roi.push({'genre_platform':new_key, 'recommended_roi': recommended_val['digital_roi'][key][0]})
    }

    for (let key in recommended_val['digital_vc']) {
      var new_key = key.replace('_digital','');
      this.digital_recommended_vc.push({'genre_platform':new_key, 'recommended_vc': recommended_val['digital_vc'][key][0]})
    }

    
  }

  ngOnInit(): void {
    this.onExecution('all');
    this.onMediaChange('all');
    this.recommended_values = this.dataService.recommendedValues;
    this.simulation_parameters = this.dataService.simulationParameters;

    this.brand_list = this.commonService.selectedDetails.brand;
    this.selectedBrand = this.commonService.selectedDetails.brand;
    console.log(this.brand_list)

    this.new_volume  = this.simulation_parameters.current_volume + Number(this.recommended_values.total_current_distribution) +
    Number(this.recommended_values.total_current_price) + this.simulation_parameters.tv_current_volume + this.simulation_parameters.digital_current_volume;

    console.log(this.new_volume)
    console.log(this.simulation_parameters)

    this.chartOptions2.series[1].data = [this.simulation_parameters.tv_current_total_spends, this.recommended_values.total_tv_spends];

    this.chartOptions2.series[0].data = [this.simulation_parameters.digital_current_total_spends, this.recommended_values.total_digital_spends];
    
    this.chartOptions3.series[1].data = [Number(this.simulation_parameters.tv_current_total_roi), this.recommended_values.total_tv_roi];

    this.chartOptions3.series[0].data = [Number(this.simulation_parameters.digital_current_total_roi), this.recommended_values.total_digital_roi];
    

    this.chartOptions4.series[0].data = [{
        name: 'Current',
        y:Number((this.simulation_parameters.current_volume/1000000).toFixed(1)),
        color:" #8e8b89"
        }, {
            name: 'Distribution',
            y: Number(((0 + Number(this.recommended_values.total_current_distribution))/1000000).toFixed(1))
        }, {
            name: 'Price',
            y: Number(((0 + Number(this.recommended_values.total_current_price))/1000000).toFixed(1))
        },
        
        {
            name: 'TV',
            y: Number(((0 + this.simulation_parameters.tv_current_volume)/1000000).toFixed(1))
        }, {
            name: 'Digital',
            y: Number(((0 + this.simulation_parameters.digital_current_volume)/1000000).toFixed(1))
        }, 
        

      {
        name: 'New',
        isSum: true,
        color:" #8e8b89",
      }
    ];

    this.chartOptions8.series[0].data = [{
      name: 'Current',
      y:Number(((this.simulation_parameters.current_volume/1000000) * 9).toFixed(1)),
      color:" #8e8b89"
      }, {
          name: 'Distribution',
          y: Number((((0 + Number(this.recommended_values.total_current_distribution))/1000000) * 9).toFixed(1))
      }, {
          name: 'Price',
          y: Number((((0 + Number(this.recommended_values.total_current_price))/1000000) * 9).toFixed(1))
      },
      
      {
          name: 'TV',
          y: Number((((0 + this.simulation_parameters.tv_current_volume)/1000000) * 9).toFixed(1))
      }, {
          name: 'Digital',
          y: Number((((0 + this.simulation_parameters.digital_current_volume)/1000000) * 9).toFixed(1))
      }, 
      

    {
      name: 'New',
      isSum: true,
      color:" #8e8b89",
    }
  ];
    
    this.chartOptions.series = [{
      type: 'solidgauge',
      name: 'Speed',
      data: [
        // {
        //   name: 'Your Scenario',
        //   radius: 85,
        //   innerRadius: 80,
        //   color:'white',
        //   y: 10
        // }, 
        {
          name: 'Growth Achieved',
          radius: 78,
          innerRadius: 62,
          color:'green',
          y: Number(((this.new_volume/this.simulation_parameters.current_volume) - 1).toFixed(2)) * 10
      }, {
          name: 'Growth Ambition',
          radius: 48,
          innerRadius: 60,
          color:'blue',
          y: this.simulation_parameters.growth_ambition
      }],
      dataLabels: {
          enabled: false
      },
      tooltip: {
          pointFormat: '{point.name}: <b>{point.y}</b> %'
      }
  }, {
    type: 'gauge',
    data: [Number(((this.new_volume/this.simulation_parameters.current_volume) - 1).toFixed(2)) * 10]
  }];
    // this.chartOptions.series[0]['data'][0].y = 10;
    // this.chartOptions.series[0]['data'][1].y = 30;
    // this.chartOptions.series[0]['data'][2].y = 50;
    this.updateFlag= true;
 

  // ]


    
    

    this.calculate_recommendations(this.recommended_values);
    // console.log(this.simulation_parameters);
    // console.log(this.recommended_values['grp_recommendations']);

    
  }



  // dialogRef.afterClosed().subscribe(result => {

  // });

}
// highchart4 = Highcharts;
//     chartOptions4:any = {     
//       chart: {
//         type: 'column',
//         backgroundColor: 'transparent',
//           style: {
//             color: 'white',
//           }
//     },
//     credits: {enabled: false},
//     title: null,
//     subtitle: {
//         text: ''
//     },
//     xAxis: {
//         categories: [
//             'Distri-<br>bution',
//             'TV',
//             'Digital',
//             'Trade',
//             'Price',
           
//         ],
//         labels: {
//           style: {
//             color: 'white'
//           }
//         },
//         // crosshair: true
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: ''
//         },
//         gridLineWidth: 0,

//     },
//     legend: {
//       enabled: false
//     },
//     tooltip: {
//         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//             '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//         footerFormat: '</table>',
//         shared: true,
//         useHTML: true
//     },
//     plotOptions: {
//         column: {
//             pointPadding: 0.2,
//             borderWidth: 0
//         }
//     },
//     series: [{
//         name: '',
//         data: [49.9, 71.5, 106.4, 129.2, 144.0]

//     }]
//     };
