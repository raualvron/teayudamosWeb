import { Injectable } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private storage: AngularFireStorage,
    public authService: AuthService
  ) {}

  async teacherRegistered() {
    const teacherInfo: any = await this.getTeacherInfoByUser().catch(
      (error) => error
    );
    return teacherInfo
      ? teacherInfo.firstname !== "" && teacherInfo.lastname !== ""
      : teacherInfo;
  }

  async teacherHasSchool() {
    const schoolInfo: any = await this.getSchoolInfoByUser().catch(
      (err) => err
    );
    return schoolInfo ? schoolInfo?.schoolId !== "" : schoolInfo;
  }

  async getTeacherInfoByUser() {
    const userData: any = await this.authService?.GetUserInfo();
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/teachers", (ref) =>
          ref.where("userId", "==", userData.uid)
        )
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(resp.docs[0].data());
          }
          return reject(false);
        });
    });
  }

  async getTeacherImg(teacherId) {
    const ref = this.storage.ref(`teachers/${teacherId}`);
    return ref.getDownloadURL();
  }

  async getTeachersBySchool(schoolId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/teachers", (ref) => ref.where("schoolId", "==", schoolId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }

  deleteTeacher(userId: string) {
    return this.afs.doc("/teachers/" + userId + "/").delete();
  }

  async getAlumnsBySchool(schoolId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/alumns", (ref) => ref.where("schoolId", "==", schoolId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }

  async getAlumnById(alumnId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/alumns", (ref) => ref.where("userId", "==", alumnId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(resp.docs[0].data());
          }
          return reject(false);
        });
    });
  }

  async getSchoolInfoByUser() {
    const userData: any = await this.authService?.GetUserInfo();
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/schools", (ref) =>
          ref.where("userId", "==", userData.uid)
        )
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(resp.docs[0].data());
          }
          return reject(false);
        });
    });
  }

  async getSchoolInfoById(schoolId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .doc(`/schools/${schoolId}`)
        .get()
        .subscribe((resp) => {
          if (resp.exists) {
            return resolve(resp.data());
          }
          return reject(false);
        });
    });
  }

  async getMedicineByAlumn(alumnId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/medicine")
        // .collection("/medicine", (ref) => ref.where("userId", "==", alumnId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }

  deleteMedicine(uid: string) {
    return this.afs.doc("/medicine/" + uid + "/").delete();
  }

  addMedicine(medicine: any) {
    return this.afs.collection("medicine").add(medicine);
  }

  addMinute(minute: any) {
    return this.afs.collection("minutes").add(minute);
  }

  async getChatByAlumn(alumnId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/messages")
        // .collection("/messages", (ref) => ref.where("alumnId", "==", alumnId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }

  addChat(chat: any) {
    return this.afs.collection("messages").add(chat);
  }

  async getMinutesByAlumn(alumnId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/minutes")
        // .collection("/minutes", (ref) => ref.where("userId", "==", alumnId))
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }

  async getRoutesByAlumn(alumnId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("/routes")
        // .collection("/routes", (ref) =>
        // ref.where("userId", "==", alumnId).orderBy("datetime", "desc")
        // )
        .get()
        .subscribe((resp) => {
          if (resp.docs.length) {
            return resolve(
              resp.docs.map((item) => {
                return { ...item.data(), uid: item.id };
              })
            );
          }
          return reject(false);
        });
    });
  }
}
