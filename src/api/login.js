import service from '@/utils/request'

/**
 * 获取验证码
 * @param {userName:用户名,module：模块名} data
 */
export function GetSms(data) {
    return service.request({
        method: 'POST',
        url: '/getSms/',
        data,
    })
}

/**
 * 注册
 * @param {userName：用户名,password：密码,code：验证码} data
 */
export function Register(data) {
    return service.request({
        method: 'POST',
        url: '/register/',
        data,
    })
}

/**
 * 登录
 * @param {userName：用户名,password：密码,code：验证码} data
 */
export function Login(data) {
    return service.request({
        method: 'POST',
        url: '/login/',
        data,
    })
}