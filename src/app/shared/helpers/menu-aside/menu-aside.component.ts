import { Component, Input, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "menu-aside",
  templateUrl: "./menu-aside.component.html",
  styleUrls: ["./menu-aside.component.css"],
})
export class MenuAsideComponent implements OnInit {
  @Input()
  classActive: string;

  public authService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit(): void {}
}
