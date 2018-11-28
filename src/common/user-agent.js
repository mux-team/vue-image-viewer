
let ua = navigator.userAgent;

let mod = {
    // OS
    isAndroid() {
        return /android/i.test(ua);
    },
    isIOS() {
        return /(iPhone|iPod|iPad)/.test(ua);
    },
    isWinPhone() {
        return /Windows Phone ([\d.]+)/.test(ua);
    },

    // Version
    iosVersion() {
        let match = /OS (\d+)_(\d+)/.exec(ua);
        return match ? [Number(match[1]), Number(match[2])] : [];
    },
    appleWebkitVersion() {
        let match = ua.match(/ applewebkit\/([0-9.]+)/i);
        return match ? match[1].split('.').map(parseFloat) : [];
    },
    baiduBoxVersion() {
        // 非手百版本号返回 0
        if (!this.isBaiduBox()) {
            return 0;
        }
        let version;
        let oldReg = /([\d+.]+)_(?:diordna|enohpi)_/i;
        let newReg = /baiduboxapp\/([\d+.]+)/i;
        if (oldReg.test(ua)) {
            version = ua.match(oldReg)[1].split('.').reverse();
        }
        else if (newReg.test(ua)) {
            version = ua.match(newReg)[1].split('.');
        }

        return version ? version.map(parseFloat) : [];
    },
    // 简单搜索版本号
    secrVersion() {
        // 非简单浏览器版本返回 0
        if (!this.isSearchCraft()) {
            return 0;
        }

        let match = ua.match(/ SearchCraft\/([0-9]+_)?([0-9.]+)/i);
        let version = /(iPhone|iPod|iPad)/.test(ua) ? match[2].split('.') : match[2].split('.');

        return version ? version.map(parseFloat) : [];
    },
    // chrome 内核版本
    getChromeVersion() {
        // 非 chrome 内核，chrome 内核版本返回 0
        if (!this.isChromeDesktop() && !this.isChromeMobile()) {
            return 0;
        }

        let match = ua.match(/ Chrome\/([0-9]+_)?([0-9.]+)/i);

        return match && match[2] ? match[2].split('.').map(parseFloat) : [];
    },
    androidVersion() {
        let match = ua.match(/Android ([0-9.]+);/);
        if (!match) {
            return [];
        }

        let version = match[1].split('.').map(parseFloat);

        return version;
    },

    // Browser
    isBaiduBox() {
        return /baiduboxapp/.test(ua);
    },
    isBaiduBoxLite() {
        return /lite baiduboxapp/.test(ua);
    },
    // isQQ 会判断是否 QQ 浏览器
    // 但 Android 平台的手机内置 QQ 的 UA 没有 QQBrowser 字段
    // 所以请使用 isQQApp || isWeixinApp || isQQBrowser 代替此接口
    isQQ() {
        return /QQBrowser/.test(ua);
    },
    isQQApp() {
        return /QQ\/[0-9]+/.test(ua);
    },
    isWeixinApp() {
        return /MicroMessenger/.test(ua);
    },
    // isQQBrowser 会判断是否 QQ 浏览器 但不包括 QQ 微信内置
    isQQBrowser() {
        return /QQBrowser/.test(ua) && !(/QQ\//.test(ua) || /MicroMessenger/.test(ua));
    },
    isBaiduBrowser() {
        return /baidubrowser/.test(ua);
    },
    isSearchCraft() {
        return /SearchCraft/i.test(ua);
    },
    isUC() {
        return /UCBrowser/.test(ua);
    },
    isChromeDesktop() {
        return /Chrome\//.test(ua);
    },
    isChromeMobile() {
        return /Chrome\/(\S*) Mobile/.test(ua);
    },
    // ios 上 chrome 不是 chrome 内核
    isCriOS() {
        return /CriOS/.test(ua);
    },
    isSogouMobile() {
        return /SogouMobileBrowser/.test(ua);
    },
    isMiuiBrowser() {
        return /MiuiBrowser\/(\S*)/.test(ua);
    },
    isHUAWEIBrowser() {
        return /HUAWEI/i.test(ua);
    },
    isMZBrowser() {
        return /MZBrowser/i.test(ua);
    },

    // kernel
    isWKWebview() {
        let webkitVersion = mod.appleWebkitVersion();
        return mod.isIOS() && webkitVersion[0] && webkitVersion[0] > 600;
    },
    isUIWebview() {
        let webkitVersion = mod.appleWebkitVersion();
        return mod.isIOS() && webkitVersion[0] && webkitVersion[0] <= 600;
    }
};

export default mod;
