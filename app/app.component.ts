import { Component, OnInit  } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}
  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.router
    .events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
    let child = this.activatedRoute.firstChild;
    while (child.firstChild) {
    child = child.firstChild;
    }
    if (child.snapshot.data['title']) {
    return child.snapshot.data['title'];
    }
    return appTitle;
    })
    ).subscribe((ttl: string) => {
    this.titleService.setTitle(ttl);
    });
  }
}
