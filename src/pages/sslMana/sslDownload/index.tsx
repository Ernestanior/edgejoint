import { Template } from "@/components/template";
import { IRenderConfig } from "@/components/template/fastRender";
import { Role } from "@/components/template/interface";
import IconFont from "@/components/icon";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { from } from "rxjs";
import { dnsApi } from "@/store/api";
import request from "@/store/request";

const Index: FC<Role> = (props: Role) => {
  const [params, setParams] = useState<any>();
  const [filterOption, setfilterOption] = useState<any>();
  const [deleteUid, setDeleteUid] = useState<any>();
  const [dnsCertList, setDnsCertList] = useState();

  useEffect(() => {
    if (props.type === 3) {
      if (params !== undefined) {
        if (params.filters !== undefined) {
          from(
            request(
              dnsApi.DnsCertList({
                keyword: params.filters.keyword,
                searchPage: params.searchPage,
                customerUid: params.filters.customerUid,
                sslDomains: params.filters.sslDomains,
              })
            )
          ).subscribe((data) => {
            if (data) {
              setDnsCertList(data);
            }
          });
          dnsApi.DnsCertList({
            keyword: params.filters.keyword,
            searchPage: params.searchPage,
            customerUid: params.filters.customerUid,
            sslDomains: params.filters.sslDomains,
          });
        }
      }
    }
  }, [params, props.type]);

  useEffect(() => {
    const handleDnsDomainList = async () => {
      const result = await request(
        dnsApi.FindCustomerList({
          searchPage: { page: 1, pageSize: 99999 },
          uid: "",
        })
      );
      if (result) {
        let dnsOption: object[] = [];
        Object.entries(result.content).forEach((item: any) => {
          let a = item[1];
          dnsOption.push({ uid: a.uid, name: a.name });
        });
        setfilterOption(dnsOption);
      }
    };
    handleDnsDomainList();
  }, []);

  const config = [
    {
      title: "证书",
      dataIndex: "sslDomains",
      key: "sslDomains",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "到期时间",
      dataIndex: "",
      key: "",
      render: () => {
        return <div>-</div>;
      },
    },
    {
      title: "申请时间",
      dataIndex: "operateTime",
      key: "operateTime",
      render: (key: any) => {
        if (key !== null) {
          const x = moment(key).format("YYYY-MM-DD h:mm:ss");
          return <div>{x}</div>;
        } else return <div>-</div>;
      },
    },
    {
      title: "客户",
      dataIndex: "customer",
      key: "customer",
      render: (key: any) => {
        if (key !== null) {
          return <div>{key.name}</div>;
        } else return <div>-</div>;
      },
    },
  ];

  const option: IRenderConfig[] = [
    {
      text: "证书",
      name: "sslDomains",
      type: "input",
    },
    {
      text: "客户",
      name: "customerUid",
      data: filterOption,
      type: "select",
    },
  ];
  const confirm = () => {
    from(request(dnsApi.DnsCertDelete(deleteUid))).subscribe((data) => {
      if (data) {
      }
    });
  };
  const TempConfig = {
    optList: [
      {
        icon: (
          <div>
            <Popconfirm
              title="Are you sure delete this task?"
              //visible={this.state.visible}
              //onVisibleChange={this.handleVisibleChange}
              onConfirm={() => confirm()}
              //onCancel={() => cancel()}
              okText="Yes"
              cancelText="No"
              trigger={"click"}
            >
              <div>
                <IconFont
                  type="icon-shanchu"
                  className="DeleteBtn"
                  style={{ fontSize: 17, color: "#FF8900" }}
                ></IconFont>
              </div>
            </Popconfirm>
          </div>
        ),
        event: (data: any) => {
          console.log(data.uid);
          setDeleteUid(data.uid);
        },
      },
    ],
    onSearch: (params: any) => setParams(params),
    rowId: "uid",
    data: dnsCertList,
    config: config,
  };

  return (
    <div>
      <Template
        primarySearch={"keyword"}
        searchList={option}
        {...TempConfig}
      ></Template>
    </div>
  );
};

export default Index;
