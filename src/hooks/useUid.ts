import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BehaviorSubject } from "rxjs";

const useUid = () => {
  // 获取当前路由路径
  const path = useLocation().pathname.split("/");
  if (path.length >= 2) {
    return path.filter((n) => n !== "")[1];
  }
  return "unknow";
};

export default useUid;
