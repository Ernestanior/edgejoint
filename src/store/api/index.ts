import Auth from "./auth";
import UserAPI from "./user";
import SiteAPI from "./site";
import DnsAPI from "./dns";
import SupplierAPI from "./supplier";
import CustomerAPI from "./customer";
// import DnsConfigAPI from "./dnsConfig";
// import DomainAPI from "./domain";
// import SslAPI from "./ssl";

export const authApi = new Auth();
export const userApi = new UserAPI();
export const siteApi = new SiteAPI();
export const dnsApi = new DnsAPI();
export const supplierApi = new SupplierAPI();
export const customerApi = new CustomerAPI();
// export const dnsConfigApi = new DnsConfigAPI();
// export const domainApi = new DomainAPI();
// export const sslApi = new SslAPI();
