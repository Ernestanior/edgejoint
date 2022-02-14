import { notification } from "antd";
import { BehaviorSubject, from } from "rxjs";
import request from "@/store/request";
import { siteApi } from "@/store/api";
import {
  ICNameList,
  ICreateSite,
  ISearchParamsSite,
  ISiteList,
  ISslList,
} from "./interface";

/**
 * 用户相关功能
 */
class Site {
  readonly siteList$ = new BehaviorSubject<ISiteList | null>(null);
  readonly siteAllList$ = new BehaviorSubject<any[] | null>(null);
  readonly siteInfo$ = new BehaviorSubject<any>(null);
  readonly sslList$ = new BehaviorSubject<any>(null);
  readonly cnameList$ = new BehaviorSubject<any>(null);
  readonly suffix$ = new BehaviorSubject<string | null>(null);

  /**
   * 条件查询site
   */
  findSite(data: ISearchParamsSite) {
    from(request(siteApi.FindSite(data))).subscribe((data) => {
      if (data) {
        this.siteList$.next(data);
      }
    });
  }
  /**
   * 条件查询site
   */
  findSiteAll() {
    from(request(siteApi.FindSiteAll())).subscribe((data) => {
      if (data) {
        this.siteAllList$.next(data);
      }
    });
  }
  getSiteInfo(uid: string) {
    from(request(siteApi.GetSiteInfo(uid))).subscribe((data) => {
      if (data) {
        this.siteInfo$.next(data);
      }
    });
  }
  /**
   * 条件查询site
   */
  findSsl(uid: string, data: ISslList) {
    from(request(siteApi.SslList(uid, data))).subscribe((data) => {
      if (data) {
        this.sslList$.next(data);
      }
    });
  }
  findCNameList(data: ICNameList) {
    from(request(siteApi.CNameList(data))).subscribe((data) => {
      if (data) {
        this.cnameList$.next(data);
      }
    });
  }
  getSuffix(uid: string) {
    from(request(siteApi.GetSuffix(uid))).subscribe((data) => {
      if (data) {
        this.suffix$.next(data);
      }
    });
  }
  // createSite(data: ICreateSite) {
  //   from(request(siteApi.CreateSite(data))).subscribe((data) => {
  //     if (data) {
  //       notification.success({
  //         message: "Create Success",
  //       });

  //     }
  //   });
  // }
  // deleteSite(data: string[]) {
  //   from(request(siteApi.DeleteSite(data))).subscribe((data) => {
  //     if (data) {
  //       notification.success({
  //         message: "Delete Success",
  //       });
  //     }
  //   });
  // }
}

const siteService = new Site();

export default siteService;
