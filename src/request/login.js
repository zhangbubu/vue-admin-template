/**   
 * login接口
 */
import { get,post } from './http';

export const login = param => post('/login',param);//登录接口
export const register = param => post('/register',param);//注册接口