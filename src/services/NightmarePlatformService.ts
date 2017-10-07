import {AutoInvest} from "../models/AutoInvest";
import {Config} from "../config/Config";
import {GlobalVariable} from "../models/GlobalVariable";
import Promise = require('bluebird');


let fs = require('fs'),
    path = require('path'),
    log4js = require('log4js'),
    log = log4js.getLogger('NightmarePlatformService');


export class NightmarePlatformService {
    /**
     *
     *
     * 从页面中获取开奖号码 上期期号 当前期号等信息
     */
    public initGlobalVariablesFromPage(nightmare: any, config: Config): Promise<GlobalVariable> {
        return nightmare
            .evaluate((config) => {
                //获取上期开奖号码
                config.globalVariable.last_PrizeNumber = $(config.ele_lastPrizeNumber.wang).text()
                    + $(config.ele_lastPrizeNumber.qian).text()
                    + $(config.ele_lastPrizeNumber.bai).text()
                    + $(config.ele_lastPrizeNumber.shi).text()
                    + $(config.ele_lastPrizeNumber.ge).text();

                //上期期号
                config.globalVariable.last_Period = $(config.ele_divLastPrizePeriodNumber).text();
                //本期期号
                config.globalVariable.current_Peroid = $(config.ele_divPrizePeriodNumber).text();
                //当前账号余额
                config.globalVariable.currentAccoutBalance = Number($(config.ele_currentAccountBalance).text());

                return config;
            }, config);
    }

    /**
     *
     * 获取当前账户余额
     */
    public getAccountBalance(nightmare: any, config: Config): Promise<number> {
        return nightmare.wait(2000)
            .evaluate((config) => {
                return Number($(config.ele_currentAccountBalance).text());
            }, config)
            .then((accountBalance: number) => {
                //保存获取的账号余额
                config.globalVariable.currentAccoutBalance = accountBalance;
            });
    }

    /**
     *
     * 执行投注
     */
    public autoInvest(nightmare: any, investModel: AutoInvest, moneyDoubleCount: number = 1): Promise<any> {
        log.info('正在买号...');
        return nightmare.click(investModel.ele_btnHouSan)
            .wait(500)
            .click(investModel.ele_btnHouSanZhiXuan)
            .wait(500)
            .type(investModel.ele_textSelectedHouSanNumber, '345,567,990,223')
            .type(investModel.ele_textMoneyDoubleCount, '')
            .type(investModel.ele_textMoneyDoubleCount, moneyDoubleCount)
            .select(investModel.ele_awardModel, String(Config.currentSelectedAwardMode))
            .wait(500)
            .click(investModel.ele_btnQuickBuy)
            .wait(500)
            .then(() => {
                log.info('买号完毕！');
            });
    }
}