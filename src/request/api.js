/**   
 * api接口统一管理
 */
import { get, post, patch, put } from './http';

export const login = param => post('/user/login',param);