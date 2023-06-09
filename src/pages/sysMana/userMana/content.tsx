import { Template } from "@/components/template";
import { notification } from "antd";
import { FC, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CreateDrawer from "./createDrawer";
import EditDrawer from "./editDrawer";
import { useLoading } from "@/components/loading";
import { from } from "rxjs";
import request from "@/store/request";
import { companyApi } from "@/store/api";
import { EdgeModal } from "@/components/modal";
import useEvent from "@/hooks/useEvent";
import { ICustomerList } from "@/store/network/customer/interface";
import useRole from "@/hooks/useRole";
import { IUserType } from "@/hooks/useInfo";

const Content: FC = () => {
  const [createFlag, setCreateFlag] = useState<boolean>(false);
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [enableFlag, setEnableFlag] = useState<boolean>(false);
  const [disableFlag, setDisableFlag] = useState<boolean>(false);
  const [resetPwdFlag, setPwdFlag] = useState<boolean>(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [editData, setEditData] = useState<any>({});
  const [customerUid, setCustomerUid] = useState<string>();
  const [customerList, setCustomerList] = useState<ICustomerList>();
  const [event$, sendMessage] = useEvent();
  const loading = useLoading();
  const routerState: any = useLocation().state;
  const roleAuth = useRole();
  const type = useMemo(() => {
    return routerState && routerState.userMana;
  }, [routerState]);
  const roleList = useMemo(() => {
    switch (type) {
      case IUserType.ADMIN:
        return [];
      case IUserType.SALE:
        return [IUserType.SALE];
      case IUserType.OPERATION:
        return [IUserType.OPERATION];
      case IUserType.AGENT:
        return [IUserType.SALE, IUserType.AGENT];
    }
  }, [type]);
  const deleteCustomer = (data: string[]) => {
    from(request(companyApi.DeleteCustomer(data))).subscribe((data) => {
      data instanceof Object
        ? notification.success({ message: "Delete Success" })
        : notification.error({ message: "Delete failed", description: data });
      sendMessage("reload");
      setDeleteFlag(false);
      setSelected([]);
    });
  };
  const disableCustomer = (data: string[]) => {
    from(request(companyApi.DisableCustomer(data))).subscribe((data) => {
      data instanceof Object
        ? notification.success({ message: "Disable Success" })
        : notification.error({ message: "Disable failed", description: data });
      sendMessage("reload");
      setDisableFlag(false);
      setSelected([]);
    });
  };
  const enableCustomer = (data: string[]) => {
    from(request(companyApi.EnableCustomer(data))).subscribe((data) => {
      data instanceof Object
        ? notification.success({ message: "Enable Success" })
        : notification.error({ message: "Enable failed", description: data });
      sendMessage("reload");
      setEnableFlag(false);
      setSelected([]);
    });
  };
  const resetPwd = () => {
    customerUid &&
      from(request(companyApi.ResetPassword(customerUid))).subscribe((data) => {
        data instanceof Object
          ? notification.success({
              message: "Reset Password Success",
              description: data.password,
              duration: null,
            })
          : notification.error({
              message: "Reset Password failed",
              description: data,
            });
        sendMessage("reload");
        setPwdFlag(false);
        setSelected([]);
      });
  };

  const TempConfig = {
    batchBtns: [
      {
        text: "批量删除",
        onClick: (value: any) => {
          setDeleteFlag(true);
          setSelected(value);
        },
      },
      {
        text: "批量启用",
        onClick: (value: any) => {
          setEnableFlag(true);
          setSelected(value);
        },
      },
      {
        text: "批量禁用",
        onClick: (value: any) => {
          setDisableFlag(true);
          setSelected(value);
        },
      },
    ],
    normalBtns: roleAuth(
      [
        {
          text: "新增客户",
          onClick: () => setCreateFlag(true),
          loading: loading,
        },
      ],
      roleList
    ),
    optList: [
      {
        text: "编辑",
        event: (data: any) => {
          setEditData(data);
          setEditFlag(true);
        },
      },
      {
        text: "重置密码",
        event: (data: any) => {
          setCustomerUid(data.uid);
          setPwdFlag(true);
        },
      },

      {
        text: "删除",
        event: (data: any) => {
          setSelected([data.uid]);
          setDeleteFlag(true);
        },
      },
    ],
    onSearch: async (params: any) => {
      const payload = {
        keyword: params.filters.keyword || "",
        searchPage: params.searchPage,
        email: params.filters.email,
        status: params.filters.status,
        name: params.filters.name || "",
        type: type || "admin",
      };
      const res = await request(companyApi.FindCustomer(payload));
      res && setCustomerList(res);
    },
    rowId: "uid",
    data: customerList,
    config: [
      {
        title: "用户名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (status: any) =>
          status === 1 ? (
            <div className={`${"status-box"} ${"status-normal"}`}>正常</div>
          ) : (
            <div className={`${"status-box"} ${"status-error"}`}>故障</div>
          ),
      },
    ],
  };
  return (
    <div>
      <Template
        primarySearch={"keyword"}
        searchList={[
          {
            text: "使用者名称",
            name: "name",
            type: "input",
          },
          {
            text: "邮箱",
            name: "email",
            type: "input",
          },
          {
            text: "状态",
            name: "status",
            data: [
              { uid: 0, name: "未启用" },
              { uid: 1, name: "正常" },
            ],
            type: "select",
          },
        ]}
        {...TempConfig}
        event$={event$}
      ></Template>
      <CreateDrawer
        onClose={() => setCreateFlag(false)}
        reload={() => sendMessage("reload")}
        visible={createFlag}
        loading={loading}
        type={type}
      ></CreateDrawer>
      <EditDrawer
        onClose={() => setEditFlag(false)}
        reload={() => sendMessage("reload")}
        data={editData}
        visible={editFlag}
        loading={loading}
      ></EditDrawer>
      <EdgeModal
        visible={deleteFlag}
        onCancel={() => setDeleteFlag(false)}
        onOk={() => deleteCustomer(selected)}
        title="删除"
        loading={loading}
      >
        你确定删除此账户？
      </EdgeModal>
      <EdgeModal
        visible={enableFlag}
        onCancel={() => setEnableFlag(false)}
        onOk={() => {
          enableCustomer(selected);
        }}
        title="启用"
        loading={loading}
      >
        你确定启用此账户？
      </EdgeModal>
      <EdgeModal
        visible={disableFlag}
        onCancel={() => setDisableFlag(false)}
        onOk={() => {
          disableCustomer(selected);
        }}
        title="禁用"
        loading={loading}
      >
        你确定禁用此账户？
      </EdgeModal>
      <EdgeModal
        visible={resetPwdFlag}
        onCancel={() => setPwdFlag(false)}
        onOk={resetPwd}
        title="禁用"
        loading={loading}
      >
        你确定为此账户重置密码？
      </EdgeModal>
    </div>
  );
};

export default Content;
