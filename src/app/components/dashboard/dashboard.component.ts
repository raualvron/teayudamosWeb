import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/shared/services/firestore.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  schoolUrl: Observable<string | null>;
  schoolInfo: any;
  userInfo: any;
  teacherInfo: any = null;
  loading: boolean = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage
  ) {
    this.getUserInfo();
    this.getSchoolInfo();
    this.makeRedirection();
    this.getSchoolImg();
    this.getUserImg();
  }

  ngOnInit() {}

  async getSchoolInfo() {
    const teacherInfo: any = await this.firebaseService.getTeacherInfoByUser();
    if (teacherInfo?.title === "head") {
      this.schoolInfo = await this.firebaseService.getSchoolInfoByUser();
    } else if (teacherInfo.schoolId) {
      this.schoolInfo = await this.firebaseService.getSchoolInfoById(
        teacherInfo.schoolId
      );
    }
    return teacherInfo;
  }

  async getUserInfo() {
    this.userInfo = await this.authService?.GetUserInfo();
    this.teacherInfo = await this.firebaseService.getTeacherInfoByUser();
  }

  async getSchoolImg() {
    const teacherInfo: any = await this.firebaseService.getTeacherInfoByUser();
    const ref = this.storage.ref(`school/${teacherInfo?.schoolId}`);
    this.schoolUrl = ref.getDownloadURL();
    this.loading = false;
  }

  async getUserImg() {
    const userInfo: any = await this.authService?.GetUserInfo();
    const ref = this.storage.ref(`teachers/${userInfo?.uid}`);
    this.userInfo = { ...this.userInfo, photo: ref.getDownloadURL() };
  }

  async makeRedirection() {
    const teacherFound = await this.firebaseService.teacherHasSchool();
    const teacherInfo: any = await this.firebaseService.getTeacherInfoByUser();
    if (
      !teacherFound &&
      teacherInfo.title === "head" &&
      teacherInfo.schoolId === ""
    ) {
      this.router.navigate(["school"]);
    }
  }
}
