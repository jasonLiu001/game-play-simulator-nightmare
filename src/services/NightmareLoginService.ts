import {Config, CONFIG_CONST} from "../config/Config";
import Promise = require('bluebird');
import {ResponseData} from "../models/ResponseData";
import {CaptchaDecoderService} from "./CaptchaDecoderService";
import Nightmare = require('nightmare');

let path = require('path'),
    log4js = require('log4js'),
    log = log4js.getLogger('NightmareLoginService'),
    captchaService = new CaptchaDecoderService();
/**
 * 登录服务
 */

export class NightmareLoginService {
    /**
     *
     *
     * 根据验证码图片 ，返回图片中对应字符
     * *
     */
    public getCaptchaCodeString(nightmare: any): Promise<string> {
        log.info('正在破解登录验证码...');
        return nightmare
            .goto(CONFIG_CONST.siteUrl + '/Login')
            .wait(500)
            .inject('js', path.join(__dirname, "../", "lib/jquery-3.2.1.js"))
            .wait(() => {
                let btnLogin = $('#login');
                return btnLogin.length > 0;
            })
            .saveCaptchaCode(CONFIG_CONST.siteUrl + '/verifyCode?' + Math.random())
            .wait(500)
            .then(() => {
                return captchaService.decoder();
            })
            .then((parserRes: ResponseData) => {
                log.info('验证码破解成功. 验证码字符:%s', parserRes.pic_str);
                return parserRes.pic_str;
            });
    }

    /**
     *
     *
     * 登录站点
     */
    public login(nightmare: any, config: Config, captchaCodeString: string): Promise<any> {
        log.info('正在尝试登陆网站...');
        return nightmare
            .type(config.loginModel.ele_username, config.loginModel.username)
            .type(config.loginModel.ele_password, config.loginModel.password)
            .type(config.loginModel.ele_captchaCode, captchaCodeString)
            .click(config.loginModel.btnLogin)
            .wait(2000)
            .wait(() => {
                let flag = $('#navul > ul > li:nth-child(3) > a');
                return flag.length > 0;
            })
            .goto(config.autoInvestModel.chongQiUrl)
            .wait(2000)
            .wait(() => {
                let flag = $('#_game_user_point');
                return flag.length > 0;
            })
            .then(() => {
                log.info('恭喜！ 登录成功');
            });
    }
}
