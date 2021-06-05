import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "src/app/shared/services/firestore.service";
import * as moment from "moment";
import { AlertService } from "src/app/shared/helpers/alert/alert.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
  private moduleId: string;

  loading: boolean = true;
  chatForm: FormGroup;
  alumn: any;
  chats: any;
  submitted = false;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      message: ["", Validators.required],
    });
    this.moduleId = this.route.snapshot.paramMap.get("id");
    this.getChatByAlumn();
  }

  async getChatByAlumn() {
    this.alumn = await this.getAlumnById();
    this.chats = await this.firebaseService
      .getChatByAlumn(this.alumn.userId)
      .catch((err) => (this.loading = false));
    if (this.chats)
      this.chats?.sort((a, b) => {
        const prevDate: any = new Date(a.datetime);
        const currDate: any = new Date(b.datetime);
        return prevDate - currDate;
      });
    this.loading = false;
    this.chatForm.reset();
  }

  async getAlumnById() {
    return this.firebaseService.getAlumnById(this.moduleId);
  }

  get f() {
    return this.chatForm.controls;
  }

  formatDate(date: string) {
    return moment(date, "YYYY-MM-DD HH:mm").format("LLL");
  }

  async onSubmit() {
    this.submitted = true;
    if (this.chatForm.valid) {
      const { message } = this.chatForm.value;
      const teacher: any = await this.firebaseService.getTeacherInfoByUser();
      this.firebaseService
        .addChat({
          message,
          datetime: moment().format("YYYY-MM-DD HH:mm").toString(),
          type: "incoming",
          alumnId: this.alumn.userId,
          userId: teacher.userId,
        })
        .then(() => {
          this.alertService.success("The chat has been added", {
            autoClose: true,
          });
          this.loading = true;
          this.getChatByAlumn();
          this.submitted = false;
        })
        .catch(() => {
          this.alertService.success("Couldn't added the medicine", {
            autoClose: true,
          });
        });
    }
  }
}
