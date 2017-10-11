import {Login} from "../models/Login";
import {AutoInvest} from "../models/AutoInvest";
import {GlobalVariable} from "../models/GlobalVariable";
import {EnumAwardMode} from "../models/EnumModel";
let path = require('path');

/**
 *
 * 常量
 */
export const CONFIG_CONST = {
    //网站URL 地址
    siteUrl: 'https://123.jn707.com',
    //登录用户名
    username: '',
    //登录密码
    password: '',
    //系统设置 是否显示浏览器窗口
    isShowBrowser: true,
    //元、角、分 模式
    awardMode: EnumAwardMode.feng,//yuan,jiao,feng,li
};

/**
 *
 * @summary 配置文件
 * */
export class Config {
    //保存的验证码图片本地路径
    public static captchaImgSavePath: string = path.resolve(__dirname, "..", "captcha.jpeg");
    //当期选择的奖金模式
    public static currentSelectedAwardMode: number = CONFIG_CONST.awardMode;
    //全局变量
    public globalVariable: GlobalVariable = {
        last_Period: null, //上期期号 程序运行时初始化
        last_PrizeNumber: null, //上期开奖号码 程序运行时初始化
        current_Peroid: null, //当前投注期号 程序运行时初始化
        currentAccoutBalance: 100//当前账户余额 程序运行时初始化
    };

    //UI网站登录参数
    public loginModel: Login = {
        ele_username: "#username",
        ele_password: "#password",
        ele_captchaCode: "#validate",
        ele_waitComplete: "#content",//点击登录按钮后，判断页面是否加载完成的元素
        btnLogin: "#login",
        username: CONFIG_CONST.username,
        password: CONFIG_CONST.password
    };
    //UI自动投注模型
    public autoInvestModel: AutoInvest = {
        chongQiUrl: CONFIG_CONST.siteUrl + "/game?1",
        ele_chongQiTab: "#navul > ul > li.pr.submenu-box.active > div > div:nth-child(1) > ul > li.n_1",
        ele_btnHouSan: "#MainContent > div.rema.betMenu > div:nth-child(3) > a",
        ele_btnHouSanZhiXuan: "#MainContent > div.conbox03 > div > div:nth-child(3) > div:nth-child(1) > a:nth-child(3)",
        ele_textSelectedHouSanNumber: "#bet_text",
        ele_textMoneyDoubleCount: "#_game_bmultiple",
        ele_awardModel: "#game-unit",
        ele_btnQuickBuy: "#mashangtouzhu > a",
        ele_divConfirmLayer: "#layui-layer3",
        ele_btnBuyConfirm: "#layui-layer3 > div.layui-layer-btn.layui-layer-btn- > a"
    };
    //UI上期开奖号码
    public ele_lastPrizeNumber = {
        wang: '#bet-history > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1)',//奖号万位
        qian: '#bet-history > ul:nth-child(1) > li:nth-child(2) > div:nth-child(2)',//奖号千位
        bai: '#bet-history > ul:nth-child(1) > li:nth-child(2) > div:nth-child(3)',//奖号百位
        shi: '#bet-history > ul:nth-child(1) > li:nth-child(2) > div:nth-child(4)',//奖号十位
        ge: '#bet-history > ul:nth-child(1) > li:nth-child(2) > div:nth-child(5)'//奖号个位
    };
    //UI当期投注期号元素
    public ele_divPrizePeriodNumber: string = "#_game_issueno";
    //UI上期开奖期号元素
    public ele_divLastPrizePeriodNumber: string = "#_gameissue_ago";
    //UI账号当前剩余金额
    public ele_currentAccountBalance: string = "body > div.top > div.head-a > div > ul > li.show-money > a > span";
}

