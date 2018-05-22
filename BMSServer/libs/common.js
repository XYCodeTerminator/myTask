// 引入node.js的加密模块
const crypto = require('crypto');

module.exports = {
    salt: 'afkljf&@#$fafa()faffa><?<MNLKJ)',
    encrypt: function(str) {
        var md5 = crypto.createHash('md5');//创建md5算法
        md5.update(str);//将str用md5加密
        return md5.digest('hex');//返回16进制的md5加密字符串
    }
}

/* 
MD5加密是函数型加密。就是每次加密的结果一定相同，没有随机位。
特点：
1.不管加密的文字，多长多短，永远都是32位英语字母、数字混合。
2.哪怕只改一个字，密文都会大变。
3.MD5没有反函数破解的可能，网上的破解工具，都是通过字典的模式，通过大量列出明-密对应的字典，找到明码。两次加密网上也有对应的字典。所以我们不要直接用一层md5，这样对黑客来说和明码是一样
4.MD5常用于作为版本校验。可以比对两个软件、文件是否完全一致。

node中自带了一个模块，叫做crypto模块，负责加密。
首先创建hash，然后update和digest
*/