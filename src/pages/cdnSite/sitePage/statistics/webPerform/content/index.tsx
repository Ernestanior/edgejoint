import useUid from "@/hooks/useUid";
import { statApi, supplierApi } from "@/store/api";
import {
  useStatSiteAvail,
  useStatSiteBandwidth,
  useStatSiteFlow,
  useStatSiteResTime,
  useStatSupplierAvail,
  useStatSupplierResTime,
} from "@/store/network/stat";
import statService from "@/store/network/stat/service";
import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TableComp from "./table";
import { useLoading } from "@/components/loading";
import TimeFilter, { ETimeFilter, ITimeFilter } from "@/components/timeFilter";
import { Radio, Select, TreeSelect } from "antd";
import { useSiteSupplierList } from "@/store/network/supplier";
import SupplierService from "@/store/network/supplier/service";
import { treeData } from "@/common/data/area_tree";
import IconFont from "@/components/icon";
import "./index.less";
import Flow from "@/components/charts/flow/flow";
import Loading from "@/components/loading/context";

const { Option } = Select;
const GlobalData = treeData[2]["children"];
const ChinaData = treeData[1]["children"];

interface IProps {
  type: "availability" | "responseTime";
}
const Index: FC<IProps> = ({ type }): ReactElement => {
  const uid = useUid();
  const siteSupplier = useSiteSupplierList();
  const statSiteAvail = useStatSiteAvail();
  const statSiteResTime = useStatSiteResTime();
  const loading = useLoading();
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<ITimeFilter>({
    reportType: ETimeFilter.CURRENT_MONTH,
  });
  const [scope, setScope] = useState<string>("global");
  const [lines, setLines] = useState<string[]>([]);
  const lineData = useMemo(
    () => (scope === "global" ? GlobalData : ChinaData),
    [scope]
  );
  const currData = useMemo(
    () => (type === "availability" ? statSiteAvail : statSiteResTime),
    [statSiteAvail, statSiteResTime, type]
  );
  useEffect(() => {
    !siteSupplier && SupplierService.findSiteSupplier(uid);
  }, []);
  useEffect(() => {
    if (uid && timeFilter) {
      const data: any = {
        lines,
        suppliers,
        scope,
        reportType: timeFilter.reportType,
      };
      if (data.reportType === ETimeFilter.CUSTOM && timeFilter.startDate) {
        data.startDate = timeFilter.startDate.format("YYYY/MM/DD");
      }
      if (data.reportType === ETimeFilter.CUSTOM && timeFilter.endDate) {
        data.endDate = timeFilter.endDate.format("YYYY/MM/DD");
      }
      switch (type) {
        case "availability":
          statService.statSiteAvail(uid, data);
          break;
        case "responseTime":
          statService.statSiteResTime(uid, data);
          break;
        default:
          statService.statSiteAvail(uid, data);
          break;
      }
    }
  }, [uid, timeFilter, suppliers, scope, lines, type]);
  return (
    <div className="stat-platform">
      <section className="top">
        <Radio.Group
          onChange={(e) => {
            setLines([]);
            setScope(e.target.value);
          }}
          defaultValue="global"
          style={{ marginTop: 10, width: 200 }}
        >
          <Radio.Button value="global">全球</Radio.Button>
          <Radio.Button value="China">大陆</Radio.Button>
        </Radio.Group>
        <TimeFilter value={timeFilter} onChange={setTimeFilter}></TimeFilter>
      </section>
      <section className="middle">
        <section>
          地区选择
          <TreeSelect
            multiple
            style={{ width: 200, marginTop: 10 }}
            suffixIcon={
              <IconFont type="sanjiaoxing" style={{ fontSize: "12px" }} />
            }
            onChange={(e) => setLines(e)}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeNodeFilterProp="title"
            value={lines}
            treeData={lineData}
          ></TreeSelect>
        </section>
        <section>
          平台选择
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200, marginTop: 10 }}
            onChange={(e) => setSuppliers(e)}
          >
            {siteSupplier &&
              siteSupplier.content &&
              siteSupplier.content.map((i: any) => (
                <Option value={i.code} key={i.code}>
                  {i.displayName}
                </Option>
              ))}
          </Select>
        </section>
      </section>
      <section
        style={{ position: "relative", minHeight: 200, marginBottom: 20 }}
      >
        <Loading display={loading}></Loading>
        <Flow data={currData && currData.chart} type={type}></Flow>
      </section>
      <TableComp data={currData && currData.table} type={type}></TableComp>
    </div>
  );
};

export default Index;