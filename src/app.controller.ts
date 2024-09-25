import { Controller, Delete, Get, Param, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { quotes } from './quotes';
import { map } from 'rxjs';
import { response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('quotes')
  @Render('quotes')
  Qoutes() {
    return {
      response: quotes
    };
  };

  @Get('randomQuote')
  @Render('randomQuotes')
  RandQoutes() {
    return {
      response: quotes,
      id: Math.floor(Math.random() * quotes.quotes.length)
    };
  };

  @Get('topAuthor')
  @Render('topAuthor')
  TopAuthor() {

    let authors = new Map

    for (let i = 0; i < quotes.quotes.length; i++) {
      if (authors.has(quotes.quotes[i].author)){
        authors.set(quotes.quotes[i].author, authors.get(quotes.quotes[i].author)+1);
      }
      else{
        authors.set(quotes.quotes[i].author, 1);
      }
    }

    authors = new Map([...authors.entries()].sort((a, b) => b[1] - a[1]));

    return {
      response: authors
    };
  };

  @Get('quotes/:id')
  @Render('qoute')
  oneQuote(@Param('id') id: string){
    return {
      qoute: quotes.quotes[parseInt(id)-1].quote,
      author: quotes.quotes[parseInt(id)-1].author
    }
  }

  @Get('deleteQuote/:id')
  deleteQuote(@Param('id') id: string){
    quotes.quotes.splice(parseInt(id));
    return `${id} is deleted`;
  }

  @Get('search')
  @Render('searchInQuotes')
  getQuoteByPart(@Query('text') text: string = " "){
    let qs = [];
    for (let i = 0; i < quotes.quotes.length; i++) {
      if(quotes.quotes[i].quote.toLocaleLowerCase().includes(text.toLocaleLowerCase())){
        qs.push(quotes.quotes[i].quote);
      }
    }

    return {
      list: qs
    }
  }

  @Get('authorRandomForm')
  @Render('authorRandomForm')
  dontKnow(){ }

  @Get('authorRandom')
  @Render('authorRandom')
  getRandomQuoteByAuthor(@Query('author') author: string){ 

    try{
      return {
        quote: quotes.quotes.find((e) => e.author == author).quote
      }
    }
    catch(e){
      return {
        quote: "Nincs ilyen szerző"
      }
    }
  }

  @Get('highlight:id')
  @Render('highlight')
  makeHighlight(@Param('id') id: string, @Query('text') text: string){
    return{
      text: quotes.quotes[parseInt(id)-1].quote.replace(new RegExp(text, 'gi'), `<strong>${text}</strong>`)
    }
  }

}
