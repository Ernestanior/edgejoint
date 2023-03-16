import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Content from "./content";
import { Tabs } from "antd";
import useRole from "@/hooks/useRole";
import useLoginInfo, { IUserType } from "@/hooks/useInfo";
const { TabPane } = Tabs;
const Index: FC = (): ReactElement => {
  const navigator = useNavigate();
  const path: any = useLocation().state;
  const userType = useLoginInfo()?.userType;
  const roleAuth = useRole();
  const index = useMemo(() => {
    return (path && path.userMana) || userType || "admin";
  }, [path, userType]);

  useEffect(() => {
    return navigator(".", { state: {} });
  }, []);
  return (
    <Tabs
      style={{ marginBottom: 32 }}
      activeKey={index}
      onChange={(activeKey: string) =>
        navigator(".", { state: { userMana: activeKey } })
      }
      destroyInactiveTabPane
    >
      {roleAuth(
        <TabPane tab="管理员" key="admin">
          <Content />
        </TabPane>,
        []
      )}
      {roleAuth(
        <TabPane tab="运维" key="operation">
          <Content />
        </TabPane>,
        [IUserType.OPERATION]
      )}
      {roleAuth(
        <TabPane tab="销售" key="sales">
          <Content />
        </TabPane>,
        [IUserType.SALE]
      )}
      {roleAuth(
        <TabPane tab="代理" key="agent">
          <Content />
        </TabPane>,
        [IUserType.OPERATION, IUserType.SALE, IUserType.AGENT]
      )}
    </Tabs>
  );
};

export default Index;
