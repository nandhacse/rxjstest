import { HttpClient } from '@angular/common/http';
import { typeofExpr } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, of, combineLatest } from 'rxjs';
import { distinct, map, count } from 'rxjs/operators';
import * as data from '../assets/json/query_results.json';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  constructor(private http: HttpClient) {
    this.respDataSub.next(of(...data.body.data));
  }
  private _jsonURL = '../assets/json/query_results.json';
  public dataSubject = new BehaviorSubject([]);
  public dataObs = this.dataSubject.asObservable();
  public brandFiltrSub = new BehaviorSubject<any>([]);
  public brandFiltrObs = this.brandFiltrSub.asObservable();
  public segFiltrSub = new BehaviorSubject<any>([]);
  public segFiltrObs = this.segFiltrSub.asObservable();
  public yearFiltrSub = new BehaviorSubject<any>([]);
  public yearFiltrObs = this.yearFiltrSub.asObservable();
  public engineFiltrSub = new BehaviorSubject<any>([]);
  public engineFiltrObs = this.engineFiltrSub.asObservable();
  public respDataSub = new BehaviorSubject<any>([]);
  public respDataObs = of(...data.body.data);
  getJson(){
    return this.http.get(this._jsonURL);
  }

  getCount(){
    let counter = 0;
    this.respDataObs
    .pipe(
      map(x => {
        console.log(x.car_stock);
        return x.car_stock;
      }),
    ).subscribe(val => {
      counter+=val;
    });
    return counter;
  }

  getDistinctBrand(){
    let brands = [];
    this.respDataObs.pipe(
      distinct(obj => obj.brand_key)  
    ).subscribe(val => {
      brands.push(val.brand_key);
    });
    return brands;
  }

  getDistinctEngine(){
    let engines = [];
    this.respDataObs.pipe(
      distinct(obj => obj.engine_type_key)  
    ).subscribe(val => {
      engines.push(val.engine_type_key);
    });
    return engines;
  }
  getDistinctSegment(){
    let segments = [];
    this.respDataObs.pipe(
      distinct(obj => obj.segment_key)  
    ).subscribe(val => {
      segments.push(val.segment_key);
    });
    return segments;
  }
  getDistinctYear(){
    let years = [];
    // this.dataObs.subscribe(val => console.log(val));
    this.respDataObs.pipe(
      distinct(obj => obj['year'])  
    ).subscribe(val => {
      console.log(val)
      years.push(val['year']);
    });
    return years;
  }
  getFilteredData(){
     combineLatest(
      this.respDataObs, 
      this.brandFiltrObs, this.segFiltrObs,
      this.yearFiltrObs, this.engineFiltrObs)
      .pipe(
      map(([data, filter1, filter2, filter3, filter4]) => {
        console.log(data);
        return this.runFilters(data, filter1, filter2, filter3, filter4);
      })
    ).subscribe(val => console.log(val));
  }

  runFilters (data, filter1, filter2, filter3, filter4){
    console.log(data);
    return this.brandFilter1(this.segFilter2(this.yearFilter3(
      this.engineFilter4(data, filter4), filter3), filter2), filter1)
  }
  brandFilter1(data, filters){
    console.log(filters)
    if(filters == null || !filters){
      return data;
    }
    if(Array.isArray(data)){
      return data.filter(d => filters.every(f=> d['brand_key'] == f));
    }else{
      return [data].filter(d => filters.every(f=> d['brand_key'] == f));
    }
  }
  segFilter2(data, filters){
    if(filters == null || !filters){
      return data;
    }
    if(Array.isArray(data)){
      return data.filter(d => filters.every(f=> d['segment_key'] == f));
    }else{
      return [data].filter(d => filters.every(f=> d['segment_key'] == f));
    }
  }
  yearFilter3(data, filters){
    if(filters == null || !filters){
      return data;
    }
    if(Array.isArray(data)){
      return data.filter(d => filters.every(f=> d['year'] == f));
    }else{
      return [data].filter(d => filters.every(f=> d['year'] == f));
    }
  }
  engineFilter4(data, filters){
    if(filters == null || !filters){
      return data;
    }
    if(Array.isArray(data)){
      return data.filter(d => filters.every(f=> d['engine_type_key'] == f));
    }else{
      return [data].filter(d => filters.every(f=> d['engine_type_key'] == f));
    }
    
  }
}
