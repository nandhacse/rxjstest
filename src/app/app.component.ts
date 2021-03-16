import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataServiceService } from './data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  constructor(private appService: DataServiceService){}
  brandCtrl = new FormControl();
  engineCtrl = new FormControl();
  yearCtrl = new FormControl();
  segmentCtrl = new FormControl();

  data:any[] = [];
  brandArr:any[] = [];
  segmentArr: any[] = [];
  engineArr: any[] = [];
  yearArr: any[] = [];
  total_count = 0;
  // loadDrpdwnData = ['brand_key', 'engine_type_key', 'segment_key', 'year']
  ngOnInit(){
    this.appService.getJson().subscribe((res) => {
      this.data =res['body']['data'];
      this.appService.dataSubject.next(this.data);
    });
    this.total_count = this.appService.getCount();
    // this.appService.getDistinctBrand().subscribe((res) => this.brandArr.push(res))
    this.loadData();
  }
  loadData() {
    this.brandArr = this.appService.getDistinctBrand();
    this.segmentArr = this.appService.getDistinctSegment();
    this.yearArr = this.appService.getDistinctYear();
    this.engineArr = this.appService.getDistinctEngine();
  }

  onBrandChange(selected){
    // console.log(selected.value);
    this.appService.brandFiltrSub.next(selected.value);
    this.appService.getFilteredData();
  }


  onSegmentChange(selected){
    // console.log(selected.value);
    this.appService.segFiltrSub.next(selected.value);
    this.appService.getFilteredData();
  }

  onEngineChange(selected){
    // console.log(selected.value);
    this.appService.engineFiltrSub.next(selected.value);
    this.appService.getFilteredData();
  }

  onYearChange(selected){
    // console.log(selected.value);
    this.appService.yearFiltrSub.next(selected.value);
    this.appService.getFilteredData();
  }}
