import { Common } from 'app/dy/Common.js';
import { Comment } from 'app/dy/Comment.js';
import { User } from 'app/dy/User.js';
import { Video } from 'app/dy/Video.js';
import { statistics } from 'common/statistics';
import { V } from 'version/V.js';

let Message = {
    showAll() {
        let showTag = Common.id(V.Message.showAll[0]).text(V.Message.showAll[1]).clickable(true).isVisibleToUser(true).findOnce();

        if (showTag) {
            showTag.click();
            Common.sleep(1000 * Math.random() + 2000);
        }
    },

    getNumForDetail(str) {
        hour = /(\d+)小时前/.exec(str);
        if (hour && hour[1]) {
            return hour * 60;
        }

        minute = /(\d+)分钟前/.exec(str);
        return minute && minute[1];
    },

    //监听回复用户消息
    backMsg() {
        let rp = 3;
        while (rp--) {
            //读取消息数量
            let commentCountTags = Common.id(V.Message.backMsg[0]).descContains(V.Message.backMsg[1]).isVisibleToUser(true).find();
            if (!commentCountTags || commentCountTags.length === 0) {
                Common.sleep(10 * 1000);//休眠10秒
                Log.log('没消息，休息10秒');
                return false;
            }

            for (let i in commentCountTags) {
                if (isNaN(i)) {
                    continue;
                }

                let msgTag = commentCountTags[i].parent().children().findOne(Common.id(V.Message.backMsg[2]).descContains(V.Message.backMsg[3]));
                if (!msgTag) {
                    continue;
                }

                Log.log('点击评论数量');
                Common.click(msgTag);
                Common.sleep(3000 + 2000 * Math.random());
            }

            let hudongTag = Common.id(V.Message.backMsg[2]).descContains(V.Message.backMsg[3]).isVisibleToUser(true).findOnce();

            if (hudongTag) {
                Common.click(hudongTag);
                Common.sleep(3000 + 2000 * Math.random());
            }
            Log.log('点击成功');
            break;
        }

        //进入了消息详情
        //this.showAll();
        let contents = [];
        let rpCount = 0;
        let stopCount = 0;

        while (true) {
            let containers = Common.id(V.Message.backMsg[4]).descMatches("[\\s\\S]+[小时|分钟]前，[\\s\\S]+").isVisibleToUser(true).clickable(true).className(V.Message.backMsg[5]).find();
            if (containers.length === 0) {
                stopCount++;
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }

                rpCount++;
                if (contents.includes(containers[i].desc())) {
                    continue;
                }

                let minutes = this.getNumForDetail(containers[i].desc());
                if (!minutes && minutes < 60) {
                    continue;
                }

                contents.push(containers[i].desc());

                let zanTag = containers[i].children().findOne(Common.id(V.Message.backMsg[6]).descContains(V.Message.backMsg[7]));
                if (zanTag) {
                    zanTag.click();
                    Common.sleep(500);
                }

                let commentTag = containers[i].children().findOne(Common.id(V.Message.backMsg[8]).descContains(V.Message.backMsg[9]));
                if (!commentTag) {
                    continue;
                }

                if (commentTag.click()) {
                    Common.sleep(2000 + 1000 * Math.random());
                }

                let iptTag = Common.id(V.Message.backMsg[10]).isVisibleToUser(true).findOnce();
                if (iptTag) {
                    Comment.iptEmoj(1 + Math.round(Math.random() * 3));
                    let rp = 3;
                    while (rp--) {
                        let submitTag = Common.id(V.Message.backMsg[11]).findOnce();
                        if (!submitTag) {
                            break;
                        }

                        Common.click(submitTag);
                        Common.sleep(1000 + 1000 * Math.random());
                    }
                }
            }

            if (containers.length === rpCount) {
                stopCount++;
            } else {
                stopCount = 0;
            }

            if (stopCount >= 4) {
                Common.back();
                return true;
            }

            Log.log('stopCount', containers.length, rpCount);
            Common.swipe(0, 0.7);
            Common.sleep(3000 + 2000 * Math.random());
        }
    },

    search(account) {
        let searchTag = Common.id(V.Message.search[0]).clickable(true).desc(V.Message.search[1]).isVisibleToUser(true).findOnce();
        if (!searchTag) {
            throw new Error('遇到错误，找不到输入框');
        }
        Common.click(searchTag);
        Common.sleep(2000);

        let iptTag = Common.id(V.Message.search[2]).clickable(true).text(V.Message.search[1]).isVisibleToUser(true).findOnce();
        if (!iptTag) {
            Log.log(Common.id(V.Message.search[2]).clickable(true).text(V.Message.search[1]).isVisibleToUser(true).findOne());
            throw new Error('遇到错误，找不到输入框-2');
        }

        iptTag.setText(account);
        Common.sleep(1000);
    },

    intoFansGroup(account, index) {
        this.search(account);
        let contents = [];

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let allRp = 0;
            let groupTag = Common.id(V.Message.intoFansGroup[0]).text(V.Message.intoFansGroup[1]).isVisibleToUser(true).findOnce();
            if (!groupTag) {
                throw new Error('找不到群聊');
            }

            let contains = Common.id(V.Message.intoFansGroup[2]).isVisibleToUser(true).find();
            if (contains.length === 0) {
                throw new Error('找不到群聊-2');
            }

            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                if (contains[i].bounds().top < groupTag.bounds().top) {
                    Log.log('非群聊');
                    continue;
                }

                let titleTag = contains[i].children().findOne(Common.id(V.Message.intoFansGroup[3]));
                if (!titleTag || !titleTag.text()) {
                    continue;
                }

                allRp++;
                if (contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                contents.push(titleTag.text());
                if (contents.length === index) {
                    contains[i].click();
                    Common.sleep(3000 + 2000 * Math.random());
                    return true;
                }
            }
            if (allRp === rp) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return false;
            }
            Common.swipe(0, 0.5);
        }
    },

    intoGroupUserList(contents, getMsg, machineInclude, machineSet) {
        let tag = Common.id(V.Message.intoGroupUserList[0]).desc(V.Message.intoGroupUserList[1]).isVisibleToUser(true).findOnce();

        if (!tag) {
            throw new Error('找不到“更多“');
        }
        tag.click();
        Common.sleep(2000 + 2000 * Math.random());

        let groupTag = UiSelector().descContains(V.Message.intoGroupUserList[2]).isVisibleToUser(true).findOnce();

        if (!groupTag) {
            throw new Error('找不到“groupTag“');
        }

        groupTag.click();
        Common.sleep(2300);
        Log.log(groupTag);

        let groupTag2 = UiSelector().textContains(V.Message.intoGroupUserList[3]).isVisibleToUser(true).findOnce();

        if (groupTag2) {
            Common.click(groupTag2);
            Common.sleep(3000);
        }

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let count = 0
            let contains = Common.id(V.Message.intoGroupUserList[4]).find();
            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                count++;
                if (contains[i].bounds().top < groupTag.bounds().top) {
                    rp++;
                    continue;
                }

                if (contains[i].bounds().top > Device.height()) {
                    rp++;
                    continue;
                }

                let titleTag = contains[i].children().findOne(Common.id(V.Message.intoGroupUserList[5])) || contains[i].children().findOne(Common.id(V.Message.intoGroupUserList[6]));
                if (!titleTag || !titleTag.text()) {
                    rp++;
                    continue;
                }

                if (contents.includes(titleTag.text()) || machineInclude(titleTag.text())) {
                    rp++;
                    continue;
                }

                contains[i].click();
                Common.sleep(2000 + 2000 * Math.random());
                statistics.viewUser();
                let isPrivateAccount = User.isPrivate();
                if (isPrivateAccount) {
                    Common.back();
                    machineSet(titleTag.text());
                    contents.push(titleTag.text());
                    continue;
                }
                Log.log('是否是私密账号：' + isPrivateAccount);

                Log.log('即将进入视频');
                if (Video.intoUserVideo()) {
                    //点赞
                    if (Math.random() < 0.7) {
                        Video.clickZan();
                    }
                    Common.sleep(5000 + 5000 * Math.random());

                    //随机评论视频
                    let msg = getMsg(0, Video.getContent());
                    if (msg) {
                        Video.openComment(!!Video.getCommentCount());
                        Log.log('开启评论窗口');
                        Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                        Log.log('评论了');
                        Common.back(2, 800);
                    } else {
                        Common.back();//从视频页面到用户页面
                    }
                } else {
                    Log.log('未进入视频');
                }

                machineSet(titleTag.text());
                contents.push(titleTag.text());
                Common.back();
            }

            if (rp === count) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return true;
            }
            Common.swipe(0, 0.6);
            Log.log('滑动');
            Common.sleep(1000 + 1000 * Math.random());
        }
    }
}

module.exports = { Message };
