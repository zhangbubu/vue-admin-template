// 在http.js中引入axios
import axios from "axios"; // 引入axios
// import QS from "qs"; // 引入qs模块，用来序列化post类型的数据，后面会提到
// iview的Message提示框组件
import { Message } from "iview";


// axios.create({
//   baseURL: window.g.ApiUrl,
//   timeout: window.g.AXIOS_TIMEOUT // 请求超时时间
// });
axios.defaults.baseURL = window.g.ApiUrl;
axios.defaults.timeout = window.g.AXIOS_TIMEOUT;

axios.defaults.headers.post["Content-Type"] ="application/x-www-form-urlencoded;charset=UTF-8";
// axios.defaults.transformRequest = [obj => Qs.stringify(obj)];
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
import store from "@/store";

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = 'abc';
    // token && (config.headers.Authorization = token);
    const token = sessionStorage.token;
    // token && (config.headers.Authorization = "JWT " + token);
    //是否存在 token
    // console.log('29',sessionStorage.token);
    if (token) {
      config.headers.Authorization = "JWT " + token;
    } else {
      location.href = window.g.loginUrl;
    }
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里跟后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response.status) {
      // console.log('59',error.response.status);
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          Message.info({
            content: "权限拒绝",
            duration: 1.5
          });
          break;

          // 403 token过期
          // 登录过期对用户进行提示
          // 清除本地token和清空vuex中token对象
          // 跳转登录页面
        case 403:
          Message.info({
            content: "登录过期，请重新登录",
            duration: 10,
            closable: true
          });
          // 清除token
          // sessionStorage.removeItem("token");
          // store.commit("loginSuccess", null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //   path: "/login",
          //   query: {
          //     redirect: router.currentRoute.fullPath
          //     }
          //   });
          // }, 1000);
          break;
          // 404请求不存在
        case 404:
          Message.info({
            content: "网络请求不存在",
            duration: 1.5
          });
        break;
          // 其他错误，直接抛出错误提示
        case 500:
          // Message.info({
          //   content: "暂无数据",
          //   duration: 1.5
          // });
          break;
        default:
          Message.info({
            content: error.response.data.message,
            duration: 1.5
          });
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
      .then(res => {
        if(res.data.error_code===1&&res.data.message==="Token过期"){
          sessionStorage.clear();
          location.href = window.g.loginUrl;
          Message.info({content: res.data.message+",请重新登录"});
          return;
        }
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  // console.log('138',QS.stringify(params));
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      res => {
        resolve(res.data);
      },
      err => {
        reject(err.data);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, params) {
  // console.log('178::',params);
  return new Promise((resolve, reject) => {
    axios.put(url,params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
/**
 * 封装delete
 * 请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function Delete(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {data:params})
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err.data);
    });
  });
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}