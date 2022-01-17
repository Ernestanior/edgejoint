import { BehaviorSubject, from } from "rxjs";
import request from "@/store/request";
import { userApi } from "@/store/api";
import { ISearchPage, IUserList, ICreateUserParams } from "./interface";


/**
 * 用户相关功能
 */
class User {
    readonly userList$ = new BehaviorSubject<IUserList | null>(null);

    findUser(keyWord: string, searchPage: ISearchPage) {
        from(request(userApi.FindUser({}, {
            keyWord,
            searchPage
        }))
        ).subscribe(data => {
            if (data) {
                this.userList$.next(data)
            }
            console.log(data, 'user list')
        }
        )
    }
    // create(params: ICreateUserParams) {
    //     from(request(userApi.CreateUser({
    //         ...params
    //     }, {}))
    //     ).subscribe(data => {
    //         if (data) {
    //             this.userList$.next(data)
    //         }
    //     }
    //     )
    // }
}

const userService = new User();

export default userService;