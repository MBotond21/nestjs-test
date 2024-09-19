import { Controller, Get, Param, Render } from '@nestjs/common';
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

}
