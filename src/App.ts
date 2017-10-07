import {Config, CONFIG_CONST} from './config/Config';
import {NightmareLoginService} from "./services/NightmareLoginService";
import Promise = require('bluebird');
import Nightmare = require('nightmare');
import {ErrorService} from "./services/ErrorService";
import {NightmarePlatformService} from "./services/NightmarePlatformService";
let nightmarePlugin = require('./plugins/Index');
let log4js = require('log4js');
log4js.configure('./config/log4js.json');

//导入所有插件
nightmarePlugin.install(Nightmare);

let log = log4js.getLogger('App'),
    config = new Config(),
    loginService = new NightmareLoginService(),
    errorService = new ErrorService(),
    platformService = new NightmarePlatformService(),
    nightmare = Nightmare({
        show: CONFIG_CONST.isShowBrowser,
        width: 800,
        heigh: 600,
        alwaysOnTop: false,
        typeInterval: -1,//设置type的速度
        Promise: require('bluebird'),
        webSecurity: false,
        allowRunningInsecureContent: true //允许在https的页面中调用http的资源
    });

export class App {

    /**
     *
     *
     * 启动nightmare应用并执行投注
     */
    public start(): void {
        log.info('程序已启动，持续监视中...');
        //破解验证码
        loginService.getCaptchaCodeString(nightmare, config)
            .then((captchaCodeString) => {
                //登录
                return loginService.login(nightmare, config, captchaCodeString);
            })
            .then(() => {
                //初始化开奖号码等全局变量
                return platformService.initGlobalVariablesFromPage(nightmare, config);
            })
            .then(() => {
                //获取当前账号余额 并更新全局变量中的账号余额
                return platformService.getAccountBalance(nightmare, config);
            })
            .then(() => {
                //使用nightmare 正式投注
                return platformService.autoInvest(nightmare, config.autoInvestModel);
            })
            .catch((err) => {
                //启动失败后结束electron进程
                errorService.appErrorHandler(nightmare, log, err, config);
            });
    }
}

let app = new App();
app.start();