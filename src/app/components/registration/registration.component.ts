import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  DocumentData,
  QuerySnapshot,
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";
import { AuthService } from "src/app/shared/services/auth.service";
import { FirebaseService } from "src/app/shared/services/firestore.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;
  public submitted = false;
  public isSubmitle = false;
  public schoolsList = [];
  public userId: any = null;
  public file = null;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public afs: AngularFirestore,
    public alertService: AlertService,
    private router: Router,
    private firebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private storage: AngularFireStorage
  ) {
    this.spinner.show();
    this.makeRedirection();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      title: ["teacher", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      teacherphoto: [""],
      telephone: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{2,3}-? ?[0-9]{6,7}$")],
      ],
      email: ["", [Validators.required, Validators.email]],
      dob: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
        ],
      ],
      schoolassociated: [""],
    });

    this.setUserEmail();
    this.getSchoolCollections();
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.saveTeacherInfo();
      this.uploadFile();
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  onTitleChange(e) {
    const schoolElem = document.getElementsByClassName(
      "control-school-associated"
    )[0] as HTMLElement;
    if (e.target.value === "head") {
      schoolElem.style.display = "none";
    } else {
      schoolElem.style.display = "block";
    }
  }

  async setUserEmail() {
    const userData: any = await this.authService?.GetUserInfo();
    this.registerForm.patchValue({ email: userData?.email });
    this.userId = userData?.uid;
  }

  saveTeacherInfo() {
    this.submitted = true;
    const form = this.registerForm,
      {
        title,
        firstName,
        lastName,
        address,
        dob,
        telephone,
        schoolassociated,
      } = form.value;

    this.afs
      .collection("teachers")
      .add({
        title: title,
        firstname: firstName,
        lastname: lastName,
        address: address,
        datebirth: dob,
        telephone: telephone,
        userId: this.userId,
        schoolId: schoolassociated,
      })
      .then((success) => {
        if (title === "head") {
          this.router.navigate(["school"]);
        } else {
          this.router.navigate(["dashboard"]);
        }
      })
      .catch((error) => {
        this.alertService.error("There was an error, try again please", {
          autoClose: true,
          keepAfterRouteChange: true,
        });
        console.log("error-postTeacherCollection", error);
      });
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

  async makeRedirection() {
    const teacherFound = await this.firebaseService.teacherRegistered();
    if (teacherFound) {
      this.router.navigate(["school"]);
    } else {
      this.spinner.hide();
    }
  }

  onFileChange(event) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    const filePath = `teachers/${this.userId}`;
    const ref = this.storage.ref(filePath);
    ref.put(this.file);
  }
}
