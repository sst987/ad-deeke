// log(id('root_layout').findOne());

// log(descContains('更多').find());

// let tag = scrollable(true).find();
// tag.scrollForward();

// log(desc('更多').find());

// log(textContains('北京交个朋友').findOne().parent().findOne(textMatches(/[\s\S]+/)));


// let tags = id('cy').scrollable(true).find();
// for (let i in tags) {
//     log(tags[i]);
//     tags[i].scrollForward();
//     sleep(3000);
// }
// log('完成');

// tag = id('cy').filter(v => {
//     return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0 && v.bounds().width() >= device.width && v.bounds().height() >= device.height;
// }).findOne();

// log(tag);
// tag.scrollForward();

// let tags = scrollable(true).find();
// for (let i in tags) {
//     if (i == 0) {
//         continue;
//     }

//     log(tags[i]);
//     tags[i].scrollForward();
//     sleep(3000);
// }
// log('完成');

// log(id('eu=').findOne());

log(id('ebl').find());
