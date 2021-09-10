import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./leftsidebar.component.html",
  styleUrls: []
})
export class LeftSidebarComponent implements OnInit {
  navItems: any;
  constructor(private $http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.$http
      .get("/Home/GetMenuRestult_TypeScript", { responseType: "text" })
      .subscribe((data: any) => {
        localStorage.setItem("systemmenu_v2", data);
        this.navItems = localStorage.getItem("systemmenu_v2");
      });
  }
  getRoute(event) {
    const goRoute = event.target.getAttribute("data-link");
    if (goRoute) {
      if (goRoute.indexOf("?") !== -1) {
        const path = goRoute.slice(0, goRoute.indexOf("?"));
        const query = goRoute.split("?").pop();
        const queryParam = query
          .split("&")
          .reduce(function(prev, curr, i, arr) {
            const p = curr.split("=");
            prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
            return prev;
          }, {});
        this.router.navigate([path], {
          queryParams: queryParam
        });
      } else {
        this.router.navigate([goRoute]);
      }
    }
  }
}
