import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/shared/interface/characterInterface';
import { CharacterService } from 'src/app/shared/services/character.service';
import { filter, take } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

type RequestInfo = {
  count: number;
  next: String;
  pages: number;
}

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  characters:Character[] = [];
  info: RequestInfo = {
    count: null,
    next: null,
    pages: null,
  }
  public page = 1;
  public pageSize = 0;
  private query:string;
  
  constructor(private characterSvc: CharacterService, private route:ActivatedRoute, private router:Router) { 

    this.onUrlChanged()

  }

  ngOnInit(): void {
   
  }

  private onUrlChanged():void{
    this.router.events
    .pipe(filter((event)=> event instanceof NavigationEnd))
    .subscribe(()=>{
      this.characters=[];
      this.page=1;
      this.getCharactersByQuery();
    });
  }
  

  private getCharactersByQuery():void{

    this.route.queryParams.pipe(
      take(1)).subscribe((params:ParamMap)=>{
        console.log("Parametro->", params)
        this.query = params['q'];
        this.getDataFromService();
      });
  }

  private getDataFromService():void{
    
    this.characterSvc
    .searchCharacters(this.query, this.page)
    .pipe(take(1))
    .subscribe((res:any)=>{

      if(res?.results?.length){

        console.log('Response->', res);
        const {info, results} = res;
        this.characters = [...this.characters, ...results];
        this.info = info;
        this.pageSize = results.length;

      }else{

        this.characters = [];

      }
    });
  }

}
