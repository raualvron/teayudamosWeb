import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/services/auth.service";

import {
  AngularFirestore,
  DocumentData,
  QuerySnapshot,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";
import { FirebaseService } from "src/app/shared/services/firestore.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-school",
  templateUrl: "./school.component.html",
  styleUrls: ["./school.component.css"],
})
export class SchoolComponent implements OnInit {
  public schoolForm: FormGroup;
  public submitted = false;
  public schoolsList = [];
  public userId = null;
  public file = null;
  public userData = null;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public afs: AngularFirestore,
    private router: Router,
    public alertService: AlertService,
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.getUserData();
    this.makeRedirection();
  }

  async onSubmit() {
    const schoolId = await this.saveSchoolCollection();
    this.uploadFile(schoolId);
    this.saveSchoolByTeacher(schoolId);
  }

  async getUserData() {
    this.userData = await this.authService?.GetUserInfo();
  }

  getSchoolCollections() {
    this.afs
      .collection("schools")
      .get()
      .toPromise()
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc: any) => {
          this.schoolsList.push({
            label: `${doc.data().schoolname} - Director: ${
              doc.data().headteacher
            }`,
            value: doc.id,
          });
        });
      });
  }

  async saveSchoolByTeacher(schoolId) {
    const doc = this.afs.collection("teachers", (ref) =>
      ref.where("userId", "==", this.userData.uid)
    );
    doc.snapshotChanges().subscribe((res: any) => {
      let id = res[0].payload.doc.id;
      this.afs
        .collection("teachers")
        .doc(id)
        .update({ schoolId })
        .then(() => {
          this.router.navigate(["dashboard"]);
        })
        .catch((error) => {
          this.alertService.error("There was an error, try again please", {
            autoClose: true,
            keepAfterRouteChange: true,
          });
          console.log("error-saveSchoolByTeacher", error);
        });
    });
  }

  async saveSchoolCollection() {
    const form = this.schoolForm,
      {
        headteacher,
        schoolname,
        schooladdress,
        schoolmobile,
        schooltelephone,
        institution,
        level,
        schedule,
        website,
        schoolemail,
      } = form.value;

    return this.afs
      .collection("schools")
      .add({
        headteacher: headteacher,
        schoolname: schoolname,
        schooladdress: schooladdress,
        schoolmobile: schoolmobile,
        schooltelephone: schooltelephone,
        institution: institution,
        level: level,
        schedule: schedule,
        website: website,
        schoolemail: schoolemail,
        userId: this.userId,
      })
      .then(function (docRef) {
        return docRef.id;
      });
  }

  get f() {
    return this.schoolForm.controls;
  }

  ngOnInit() {
    this.getSchoolCollections();

    this.schoolForm = this.formBuilder.group({
      headteacher: ["", Validators.required],
      schooladdress: ["", Validators.required],
      schoolname: ["", Validators.required],
      schoolmobile: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{2,3}-? ?[0-9]{6,7}$")],
      ],
      schooltelephone: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{2,3}-? ?[0-9]{6,7}$")],
      ],
      schedule: ["", Validators.required],
      institution: ["", Validators.required],
      level: ["", Validators.required],
      website: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
          ),
        ],
      ],
      schoolemail: ["", [Validators.required, Validators.email]],
    });

    this.setUserEmail();
  }

  onFileChange(event) {
    this.file = event.target.files[0];
  }

  uploadFile(schoolId: string) {
    const filePath = `school/${schoolId}`;
    const ref = this.storage.ref(filePath);
    ref.put(this.file);
  }

  async setUserEmail() {
    this.schoolForm.patchValue({ email: this.userData?.email });
    this.userId = this.userData?.uid;
  }

  async makeRedirection() {
    const teacherFound = await this.firebaseService.teacherHasSchool();
    const teacherInfo: any = await this.firebaseService.getTeacherInfoByUser();
    if (teacherFound || teacherInfo.schoolId !== "") {
      this.router.navigate(["dashboard"]);
    }
    this.spinner.hide();
  }
}
