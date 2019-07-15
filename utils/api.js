// var API_URL = 'http://servicedataxn2.youzy.cn';
// var API_URL = 'http://183.61.174.14:8018';
const request = require('request.js'); 
const API_URL_C = 'https://wxcode.youzy.cn';
const API_URL_CPC = 'https://apigateway.youzy.cn/Data';
const API_URL_CPB = 'https://apigateway.youzy.cn/ToB';

// var API_URL = 'https://capiand.youzy.cn';
// var API_URL_C = 'http://xn2api.youzy.cn';

//Colleges/QueryByKeywords

const anOrios = wx.getSystemInfoSync();
function fetchApi(url, type, bOrC, params) {
  if (bOrC == "C") {
    var url = `${API_URL_C}/${url}`;
  } else if (bOrC == "CPC") {
    var url = `${API_URL_CPC}/${url}`;
  } else if (bOrC == "CPB") {
    var url = `${API_URL_CPB}/${url}`;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: type,
      data: params,
      header: {
        'content-type': 'application/json;charset=utf-8',
        'YouzyApp_Sign': youzySign(),
        'YouzyApp_ApiSign': youzyApiSign(),
        'YouzyApp_DataSign': youzyDATASign(),
        'YouzyApp_SuperSign': youzySuperSign(),
        'YouzyApp_FromSource': anOrios.system,
        "YouzyApp_IP": "",
      },
      success: resolve,
      fail: function () { }
    })
  })
};
wx.onNetworkStatusChange(function (res) {
  if (res.isConnected == false) {
  }
})
module.exports = {
  
  // 获取可根据志愿评估方案计算的靠谱率
  RecommendationGetKPL: function (url, type, provinceId, batch, wishs) {
    return request.fetchApi(url, type, "CPD",{
      "provinceId": provinceId,
      "batch": batch,
      "wishs": wishs
    }).then(res => res.data)
  },
  // 测录取概率搜索
  CollegeEnrollQuery: function (url, type, provinceId, course, batch, keywords) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": provinceId,
      "course": course,
      "batch": batch,
      "keywords": keywords,
      "takeCount": 10
    }).then(res => res.data)
  },
  // 新增视频观看记录
  WatchLogsInsert: function (url, type, classRoomType, userNumId, numId) {
    return request.fetchApi(url, type, "CPToC", {
      "type": parseInt(classRoomType),
      "userNumId": parseInt(userNumId),
      "numId": numId
    }).then(res => res.data)
  },
  // 获取Banner列表
  BannersQuery: function (url, type, provinceNumId) {
    return request.fetchApi(url, type, "CPToC",{
      "provinceNumId": provinceNumId,
      "bannerType": 1,
      "versionType": 2,
      "count": 5
    }).then(res => res.data)
  },
  // 根据学科分类获取课程点击数
  VideoDeZhiHits: function (url, type) {
    return request.fetchApi(url, type, "CPToC").then(res => res.data)
  },
  updateUserGaoKaoInfo: function (url, type, id, provinceNumId, examYear, couseType) {
    var parameter = {
      "id": id,
      "provinceNumId": provinceNumId,
      "examYear": examYear,
      "couseType": couseType
    }
    return request.fetchApi(url, type, "CPU", parameter).then(res => res.data)
  },
  baiduMapGeocoder: function (url, type, latitude, longitude) {
    var parameter = {
      "latitude": latitude,
      "longitude": longitude
    }
    return request.fetchApi(url, type, "CPToC", parameter).then(res => res.data)
  },
  queryCollegesFractions: function (url, type, provinceNumId, uCode) { //通过省份和UCode 以及年份区间查询院校分数线
    //
    url += "?provinceNumId=" + provinceNumId + "&ucode=" + uCode
    return request.fetchApi(url, type, "CPD").then(res => res.data);
  },
  // 上海位次
  shangHaiRecommendRanks: function (url, type, provinceId, totalScore) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": provinceId,
      "course": -1,
      "totalScore": totalScore
    }).then(res => res.data)
  },
  // 传统版自选院校搜索
  QueryCollegesByManualFillout: function (url, type, provinceId, batch, course, keywords) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": provinceId,
      "batch": batch,
      "course": course,
      "keywords": keywords,
      "count": 10
    }).then(res => res.data)
  },
  // 自选院校推荐
  getRecommendZixuanV2: function (url, type, provinceId, batch, course, uCode, totalScore, rank) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": provinceId,
      "batch": batch,
      "course": course,
      "uCode": uCode,
      "lineDiff": 0,
      "totalScore": totalScore,
      "rank": rank
    }).then(res => res.data)
  },
  // 专业优先推荐
  getRecommendMajorV2: function (url, type, ProvinceId, Batch, CourseType, Total, IntentionProvinces, CollegeType, ChooseLevel, PageIndex, GroupName, Rank, RecommendType, keywords, majorCode) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": ProvinceId,
      "batch": Batch,
      "course": CourseType,
      "totalScore": Total,
      "provinceIds": IntentionProvinces,
      "collegeTypes": CollegeType,
      "chooseLevel": ChooseLevel,
      "pageIndex": PageIndex,
      "abType": GroupName,
      "rank": Rank,
      "recommendType": RecommendType,
      "pageSize": 10,
      "lineDiff": 0,
      "educationTypeLevels": "",
      "sort": -1,
      "isASC": false,
      "levels": "",
      "keywords": keywords,
      "majorCode": majorCode,
    }).then(res => res.data)
  },
  // 通用搜索
  CommonSearch: function (url, type, keywords, searchType, count, provinceId, score, course, batch) {
    return request.fetchApi(url, type, "CPToC", {
      "keywords": keywords,
      "type": searchType,
      "count": count,
      "provinceId": provinceId,
      "score": score,
      "course": course,
      "batch": batch
    }).then(res => res.data)
  },
  // 获取单个成绩信息
  GetScore: function (url, type) {
    return request.fetchApi(url, type, "CPU").then(res => res.data)
  },
  //是否开启高考版本
  ///Configuration/GaoKao/IsOpened
  gaoKaoIsOpened: function (url, type, provinceId) {
    url += "?provinceId=" + provinceId;
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  //TZY/Func/GetRightBatch
  //通过成绩总分获取正确的批次（从配置的省控线里获取）
  getRightBatch: function (url, type, provinceId, totalScore, course) {
    //?provinceId=787&totalScore=450&course=-1
    url += "?provinceId=" + provinceId + "&totalScore=" + totalScore + "&course=" + course
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  ///ScoreLines/Pcls/QueryAllByLatest
  //获得省份控制线
  getProvinceControl: function (url, type, provinceNumId) {
    url += "?provinceNumId=" + provinceNumId;
    return request.fetchApi(url, type, "CPD", parameter).then(res => res.data)
  },
  ///Users/Scores/Insert
  //插入一条用户成绩
  insertUserScore: function (url, type, userNumId, provinceNumId, total, rank, batch, scoreType, courseType, chooseSubjects, chooseLevelList) {
    var parameter = {
      "userNumId": userNumId,
      "provinceNumId": provinceNumId,
      "total": total,
      "rank": rank,
      "batch": batch,
      "scoreType": scoreType,
      "courseType": courseType,
      "chooseSubjects": chooseSubjects,
      "chooseLevelList": chooseLevelList,
      "isFromMiniProgram":true,
      "isFromBaiduMiniProgram":false
    }
    return request.fetchApi(url, type, "CPU", parameter).then(res => res.data)
  },
  //Users/Scores/GetByUserNumId
  getUserScoreByNumId: function (url, type, userNumId, provinceNumId, isGaoKao, isFillProvinceName) {
    var parameter = {
      "userNumId": userNumId,
      "provinceNumId": provinceNumId,
      "isGaoKao": isGaoKao,
      "isFillProvinceName": isFillProvinceName
    }
    return request.fetchApi(url, type, "CPU", parameter).then(res => res.data)
  },
  /**Users/Statistics/Count */
  getUserStatisticsCount: function (url, type, userNumId) {
    url += "?userNumId=" + userNumId;
    return request.fetchApi(url, type, "CPToC").then(res => res.data)
  },
  getUserPermission: function (url, type, mobile) {
    url += "?mobile=" + mobile;
    return request.fetchApi(url, type, "CPU").then(res => res.data)
  },
  ///Users/GetBrief
  // 获取单个用户基本信息 测试NumId 9621

  getUserBrief: function (url, type, numId, isFillAreaName) {
    url += "?numId=" + numId + "&isFillAreaName=" + isFillAreaName;
    return request.fetchApi(url, type, "CPU").then(res => res.data)
  },
  //小程序用户登录
  //Users/Socials/Validate
  //第三方用户登录验证
  //AuthWeixinAppMini
  validateSocialUser: function (url, type, socialLoginType, openId) {
    var parameter = {
      "socialLoginType": socialLoginType,
      "openId": openId
    }
    return request.fetchApi(url, type, "CPU", parameter).then(res => res.data)
  },

  queryByKeywords: function (url, type, keywords, pageIndex, pageSize) {
    var parameter = {
      keywords: keywords,
      pageIndex: pageIndex,
      pageSize: pageSize
    }
    return request.fetchApi(url, type, "CPD", parameter).then(res => res.data)
  },
  getCollegeList: function (url, type, pros, is985, is211, firstClass, isKey, isProvincial, cls, isBen, keywords, pn) {
    return fetchApi(url, type, "CPC", {
      "provinceIds": pros,
      "levels": {
        "is985": is985,
        "is211": is211,
        "firstClass": firstClass,
        "isKey": isKey,
        "isProvincial": isProvincial
      },
      "classify": cls,
      "natures": [],
      "arts": [],
      "isArt": false,
      "isBen": isBen,
      "type": -1,
      "isSingleRecruit": false,
      "wordSegment": false,
      "keywords": keywords,
      "pageIndex": pn,
      "pageSize": 20
    }).then(res => res.data)
  },
  getCollegeMien: function (url, type, collegeId, pn) {    //大学列表  v2/getColleges
    return fetchApi(url, type, "C", {
      "CollegeId": collegeId,
      "PageIndex": pn,
      "PageSize": 10
    }).then(res => res.data)
  },
  getCollegeDetail: function (url, type) {    //大学详情页   Colleges/getCollegeIntro?collegeId=
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getAreas: function (url, type) {   //城市  common/areas/getPovinceList
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getCollegeRating: function (url, type, pn = 1, count = 20) {   //大学排名  
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getMajorList: function (url, type) {   //专业list
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getJianZhang: function (url, type) {   //简章
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getJianZhangDetail: function (url, type) {   //简章详情页
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getMajor: function (url, type) {   //专业列表
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getsmallMajor: function (url, type) {   //专业小类
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getMajorDetail: function (url, type) {
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  getCareerProspects: function (url, type) {   //专业详情--就业前景
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getMajorCollege: function (url, type) {
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  getHotMajors: function (url, type) {
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  getMajorHotRanking: function (url, type) {    //分类 1=女生适合专业 2=男生适合专业 3=文科热门专业 4=理科热门专业 5=工科热门专业 6=医学类热门专业
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getUCode: function (url, type) {    //获取批次和招生代码
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getCollegeScoreLines: function (url, type) {    //获取院校分数线(Version3.0) 所有省份分数线都调用这一个接口 和找大学里面模型不一样
    return fetchApi(url, type, "CPC").then(res => res.data)
  },
  getProbability: function (url, type, collegeId, course, pro, score, batch, jsteam, Ucode, rank, YfydRank) {    //获取测录取概率结果页面
    return fetchApi(url, type, "C", {
      "CollegeId": collegeId,
      "CourseTypeId": course,
      "ProvinceId": pro,
      "Total": score,
      "Batch": batch,
      "ChooseLevel": jsteam,
      "UCode": Ucode,
      "IsOnlySearch": true,
      "Rank": rank,
      "YfydRank": YfydRank
    }).then(res => res.data)
  },
  login: function (url, type, openid, actype, fromsce) {    //登录 
    return fetchApi(url, type, "C", {
      "OpenId": openid,
      "AccountType": actype,
      "FromSource": fromsce,
      "FromType": 4
    }).then(res => res.data)
  },
  search: function (url, type, keywords, lei, cityId, course) {    //搜索
    return fetchApi(url, type, "C", {
      "Keywords": keywords,
      "Type": lei,
      "CurrentProvinceId": cityId,
      "Course": course
    }).then(res => res.data)
  },
  searchV2: function (url, type, Keywords, CurrentProvinceId, ProvinceId, Score, Couse, Course, Batch) {    //专业优先搜索
    return fetchApi(url, type, "C", {
      "Keywords": Keywords,
      "Type": 8,
      "CurrentProvinceId": CurrentProvinceId,
      "ProvinceId": ProvinceId,
      "Score": Score,
      "Couse": Couse,
      "Course": Course,
      "Batch": Batch
    }).then(res => res.data)
  },
  getHotSearch: function (url, type) {    //热门搜索
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getCollegeDep: function (url, type) {    //获取院系设置
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getPorfessionAdmissPlan: function (url, type) {    //获取招生计划
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getSendAuthCode: function (url, type, mobile) {    //发送验证码
    return fetchApi(url, type, "C", {
      "Mobile": mobile
    }).then(res => res.data)
  },
  // 通过配置获取最新的省控线信息
  getPrvControlLine: function (url, type) {
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  registration: function () {    //注册 ********************************************************
  },
  recommend: function (url, type, pro, batch, course, score, pros, coltype, sort, jsteam, pn, count, rank, YfydRank, groupName) {    //院校优先填报
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "Batch": batch,
      "CourseType": course,
      "Total": score,
      "IntentionProvinces": pros,
      "CollegeType": coltype,
      "Sort": sort,
      "ChooseLevel": jsteam,
      "PageIndex": pn,
      "PageSize": count,
      "Rank": rank,
      "YfydRank": YfydRank,
      "GroupName": groupName
    }).then(res => res.data)
  },
  getRecommendCount: function (url, type, pro, score, course, batch, jsteam, YfydRank, pros, coltype, rank) {    //获取首页满足条件的智能推荐的院校个数
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "Total": score,
      "CourseType": course,
      "Batch": batch,
      "ChooseLevel": jsteam,
      "IntentionProvinces": pros,
      "IntentionMajors": coltype,
      // "GroupName": "sample string 8",
      "Rank": rank,
      "YfydRank": YfydRank
    }).then(res => res.data)
  },
  updateMobile: function (url, type, userid, mobilePhone, yanzhengma, password) {    //更新手机
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "MobilePhone": mobilePhone,
      "MobileAuthCode": yanzhengma,
      "Password": password,
      "IsMiniApp": 1
    }).then(res => res.data)
  },
  createScore: function (url, type, pro, userid, course, score, jsName1, jsLevel1, jsName2, jsLevel2, zhejiang3, rank, batch, scoreType) {    //创建成绩
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "UserId": userid,
      "CourseTypeId": course,
      "Total": score,
      "ChooseLevel1Name": jsName1,
      "ChooseLevel1Num": jsLevel1,
      "ChooseLevel2Name": jsName2,
      "ChooseLevel2Num": jsLevel2,
      "ChooseLevel3Name": zhejiang3,
      "Rank": rank,
      "Batch": batch,
      "ScoreType": scoreType,
    }).then(res => res.data)
  },
  getRecommendCollegeDetail: function (url, type, pro, ChiefId, CollegeId, UCode) {
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "ChiefId": ChiefId,
      "CollegeId": CollegeId,
      "UCode": UCode,
    }).then(res => res.data)
  },
  payments: function (url, type, userid, mobile, PayDeviceType, BussType, cityId, Price, IsTest, ProvinceName, Remark) {    //创建支付订单(包括讲堂和VIP在线升级)
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "MobilePhone": mobile,
      "PayType": 2,
      "PayDeviceType": PayDeviceType,
      "BussType": BussType,
      "ProvinceId": cityId,
      "Price": Price,
      "IsTest": IsTest,
      "UserRemark": Remark,
      "Quantity": 1,
      "ProvinceName": ProvinceName
    }).then(res => res.data)
  },
  getProvinces: function (url, type) {    //获取系统支持的省份信息（包含区县）
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getSchool: function (url, type) {    //根据区/县ID获取学校列表
    return fetchApi(url, type, "C").then(res => res.data)
  },
  wanshanUserIndex: function (url, type, userid, pro) {  //完善用户信息Index
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "ProvinceId": pro
    }).then(res => res.data)
  },
  wanshanUser: function (url, type, userid, pro, city, county, school, year, sex) {  //完善用户信息
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "ProvinceId": pro,
      "CityId": city,
      "CountyId": county,
      "SchoolId": school,
      // "MobilePhone": mobile,
      "Grade": year,
      "Sex": sex,
    }).then(res => res.data)
  },
  wanshanUserSex: function (url, type, userid, sex) {  //完善用户性别
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "Sex": sex
    }).then(res => res.data)
  },
  wanshanUserMobile: function (url, type, userid, pro, city, county, mobile) {  //支付后绑定手机
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "ProvinceId": pro,
      "CityId": city,
      "CountyId": county,
      "MobilePhone": mobile
    }).then(res => res.data)
  },
  //获取小程序登录code
  getJsCode2Session: function (url, type, code) {
    return request.fetchApi(url, type, "CPToC", {
      code: code
    }).then(res => res.data)
  },
  ///Users/Socials/BindMobile第三方用户登录绑定手机号
  bindUserMobile: function (url, type, openId, socialLoginType, mobile, password, mobileAuthCode, sourceType, accountType, device) { //通过院校Id获取院校新闻
    var parameter = {
      "openId": openId,
      "socialLoginType": socialLoginType,
      "mobile": mobile,
      "password": password,
      "mobileAuthCode": mobileAuthCode,
      "nickName": "",
      "headImgUrl": "",
      "sourceType": sourceType,
      "accountType": accountType,
      "platform": 3,
      "device": device,
      "appVersion": "",
      "appChannel": "",
      "sourceSign": ""
    }
    return request.fetchApi(url, type, "CPU", parameter).then(res => res.data)
  },
  // 解密手机号
  getPhoneNumberFromServer: function (url, type, iv, sessionKey, encryptedData) {
    var parameter = {
      "iv": iv,
      "sessionKey": sessionKey,
      "encryptedData": encryptedData
    }
    return request.fetchApi(url, type, "CPToC", parameter).then(res => res.data)
  },
  getPayUnifiedorder: function (url, type, Data) {
    return fetchApi(url, type, "C", {
      Data: Data
    }).then(res => res.data)
  },
  checkUnique: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getUserScore: function (url, type) {  // 获取用户成绩模型
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getUserById: function (url, type) {  // 获取用户成绩模型
    return fetchApi(url, type, "C").then(res => res.data)
  },

  // 课堂***********************************************************************************************************
  getFirstPageDatas: function (url, type) {  // 获取课堂
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getNewPacks: function (url, type, pageIndex) {  // 获取最新课程
    return request.fetchApi(url, type, "CPToC",{
      "videoType": -1,
      "keyword": "",
      "sortId": 0,
      "videoObjectId": 0,
      "userPermision": 3,
      "pageIndex": pageIndex,
      "pageSize": 10
    }).then(res => res.data)
  },
  searchPacks: function (url, type, classRoomType, sort, pageIndex, pageSize) {  //课程包列表
    return request.fetchApi(url, type, "CPToC",{
      "type": parseInt(classRoomType),
      "sort": sort,
      "pageIndex": pageIndex,
      "pageSize": 10
    }).then(res => res.data)
  },
  getPackDetail: function (url, type, packId, packType, userNumId) {  //获取课程包详情
    return request.fetchApi(url, type, "CPToC",{
      "numId": parseInt(packId),
      "type": parseInt(packType),
      "userNumId": parseInt(userNumId)
    }).then(res => res.data)
  },
  getVideoUrl: function (url, type) {  //德智课程Url获取
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  GetClassroomQuestion: function (url, type) {  //获取视频问答
    return fetchApi(url, type, "C").then(res => res.data)
  },
  updateFabulousCount: function (url, type) {  //更改点赞数 一个赞一个U币 点赞的人Id答案Id
    return fetchApi(url, type, "C").then(res => res.data)
  },
  postAnswer: function (url, type, userId, pro, questionId, body) {  //提交答案(用来传文字)
    return fetchApi(url, type, "C", {
      "UserId": userId,
      "ProvinceId": pro,
      "QuestionId": questionId,
      "Body": body
    }).then(res => res.data)
  },
  getJTWatchLogs: function (url, type) {  //讲堂用户的观看记录
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getKTWatchLogs: function (url, type) {  //德智视频观看记录
    return fetchApi(url, type, "C").then(res => res.data)
  },
  payAddress: function (url, type) {  //购买自主招生后完善用户收货地址
    return fetchApi(url, type, "C").then(res => res.data)
  },

  zhejiangRecommend: function (url, type, pro, rank, chooseLevel, pros, coltype, rankFrom, rankTo, sort, pn, totalScore) {  //浙江版院校智能推荐列表
    return request.fetchApi(url, type, "CPD", {
      "provinceId": pro,
      "totalScore": totalScore,
      "rank": 0,
      "getDataType": sort,
      "provinceIds": pros,
      "classify": coltype,
      "chooseLevel": chooseLevel,
      "keywords": [],
      "levels": [],
      "collegeTypes": [],
      "oriBacthNames": [],
      "sort": 0,
      "isASC": false,
      "rankFrom": rankTo,
      "rankTo": rankFrom,
      "pageIndex": pn,
      "pageSize": 10
    }).then(res => res.data)
  },
  zhejiangRecommendRanks: function (url, type, pro, rank) {  //获取浙江版智能推荐上下位次区间
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "Rank": rank
    }).then(res => res.data)
  },
  zhejiangRecommendDetail: function (url, type, pro, majorCode, UCode) {  //浙江版本智能推荐详情
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "MajorCode": majorCode,
      "UCode": UCode
    }).then(res => res.data)
  },
  zhejiangCreateTable: function (url, type, StudentId, ProvinceId, TotalScore, Ranking, Remark, PlanNum, Colleges) {  //浙江志愿表生成
    return fetchApi(url, type, "C", {
      "StudentId": StudentId,
      "ProvinceId": ProvinceId,
      "TotalScore": TotalScore,
      "Ranking": Ranking,
      "Remark": Remark,
      "PlanNum": PlanNum,
      "Colleges": Colleges
    }).then(res => res.data)
  },
  zhejiangDetele: function (url, type) {  //浙江志愿表删除
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getZheJiangTables: function (url, type) {  //浙江志愿表列表
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getZheJiangTablesDetail: function (url, type, tableId) {  //浙江志愿表详细信息
    return fetchApi(url, type, "C", {
      "TableId": tableId
    }).then(res => res.data)
  },
  zhejiangUptate: function (url, type, tableid, colleges) {  //浙江修改志愿表
    return fetchApi(url, type, "C", {
      "ZyTableId": tableid,
      "Colleges": colleges
    }).then(res => res.data)
  },

  // 测评
  getBanners: function (url, type) {  //获取测评Banner
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getE360TypeV2: function (url, type) {  //获取360测评列表页面(专业定位、学业测评) 在以前基础上面新增专业定位测评
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getE360Question: function (url, type) {  //获取测评题目
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  getReportNum: function (url, type) {  //获取个人中心首页报告
    return request.fetchApi(url, type, "CPToC").then(res => res.data)
  },
  saveResults: function (url, type, cepingType, userid, answer, answer2, Result) {  //保存测评结果
    return request.fetchApi(url, type, "CPToC", {
      "type": cepingType,
      "userNumId": userid,
      "answer1": answer,
      "answer2": answer2,
      "result": Result
    }).then(res => res.data)
  },
  getReportDetail: function (url, type) {  //获取某个用户某一个测评下面的报告----------这是专业定位测评
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getcepingZAndK: function (url, type) {  //获取用户测评推荐专业
    return fetchApi(url, type, "C").then(res => res.data)
  },


  // 根据专业选科目
  getUserMajors: function (url, type) {  //我的专业
    return fetchApi(url, type, "C").then(res => res.data)
  },
  setUserMajor: function (url, type, userid, majorArr, zOrShanFlag) {  //添加或者取消我的专业
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "majorCodes": majorArr,
      "flag": zOrShanFlag
    }).then(res => res.data)
  },
  getTijianResults: function (url, type) {  //体检结果信息
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getEvaluationPrice: function (url, type) {  //获取测评价格
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getCollegeContrasts: function (url, type, CollegeIds, pro, Course, Total, batch) {  //获取测评价格
    return request.fetchApi(url, type, "CPD", {
      "provinceId": pro,
      "courseType": Course,
      "batch": batch,
      "lineDiff": 0,
      "totalScore": Total,
      "colleges": CollegeIds
    }).then(res => res.data)
  },
  GetMiddleMajors: function (url, type) {
    return request.fetchApi(url, type, "CPD").then(res => res.data)
  },
  getShangHaiRecommendProfessions: function (url, type, pro, rank, chooselevel, CdiProvince, CdiClassify, CdiRankFrom, CdiRankTo, CSB, pn, totalScore, keywords) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": pro,
      "totalScore": totalScore,
      "rank": rank,
      "getDataType": CSB,
      "provinceIds": CdiProvince,
      "classify": CdiClassify,
      "chooseLevel": chooselevel,
      "keywords": keywords,
      "levels": [],
      "collegeTypes": [],
      "oriBacthNames": [],
      "sort": 0,
      "isASC": false,
      "rankFrom": CdiRankFrom,
      "rankTo": CdiRankTo,
      "pageIndex": pn,
      "pageSize": 10

    }).then(res => res.data)
  },
  getShangHaiRecommendCollegeDetail: function (url, type, pro, ucode, CollegeCode, rank, sort) {
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "UCode": ucode,
      "CollegeCode": CollegeCode,
      "Ranking": rank,
      "Sort": sort,
    }).then(res => res.data)
  },
  getShangHaiRecommendProfessionDetail: function (url, type, pro, ucode, CollegeCode, rank, sort, majorcode) {
    return fetchApi(url, type, "C", {
      "ProvinceId": pro,
      "UCode": ucode,
      "CollegeCode": CollegeCode,
      "Ranking": rank,
      "Sort": sort,
      "MajorCode": majorcode
    }).then(res => res.data)
  },
  getShangHaiTables: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  generateShangHaiZyTable: function (url, type, SHTable, Colleges) {
    return fetchApi(url, type, "C", {
      "SHTable": SHTable,
      "Colleges": Colleges
    }).then(res => res.data)
  },
  getShangHaiTableByTableId: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getShangHaiRecommendSearchColleges: function (url, type, Keywords) {
    return fetchApi(url, type, "C", {
      "SearchCollegeKeywords": Keywords,
    }).then(res => res.data)
  },
  getShangHaiRecommendSearchCollegeDetail: function (url, type, CollegeName, CollegeCode) {
    return fetchApi(url, type, "C", {
      "CollegeName": CollegeName,
      "CollegeCode": CollegeCode,
    }).then(res => res.data)
  },

  // 普通版智能推荐
  getRecommendCollegeV2: function (url, type, ProvinceId, Batch, CourseType, Total, IntentionProvinces, CollegeType, ChooseLevel, PageIndex, GroupName, Rank, RecommendType, pageSizeForCSB) {
    return request.fetchApi(url, type, "CPD", {
      "provinceId": ProvinceId,
      "batch": Batch,
      "course": CourseType,
      "totalScore": Total,
      "provinceIds": IntentionProvinces,
      "collegeTypes": CollegeType,
      "chooseLevel": ChooseLevel,
      "pageIndex": PageIndex,
      "abType": GroupName,
      "rank": Rank,
      "recommendType": RecommendType,
      "pageSize": 10,
      "lineDiff": 0,
      "educationTypeLevels": "",
      "sort": 0,
      "isASC": true,
      "pageSizeForCSB": pageSizeForCSB,
      "levels": "",

    }).then(res => res.data)
  },
  getRecommendCollegeFractions: function (url, type, UCode, ProvinceId, CourseType, Batch) {
    return fetchApi(url, type, "C", {
      "UCode": UCode,
      "ProvinceId": ProvinceId,
      "CourseType": CourseType,
      "Batch": Batch
    }).then(res => res.data)
  },
  getRecommendProfessionFractions: function (url, type, ProfessionName, UCode, ProvinceId, CourseType, Total, Batch, Rank, YfydRank) {
    return fetchApi(url, type, "C", {
      "ProfessionName": ProfessionName,
      "UCode": UCode,
      "ProvinceId": ProvinceId,
      "CourseType": CourseType,
      "Total": Total,
      "Batch": Batch,
      "Rank": Rank,
      "YfydRank": YfydRank
    }).then(res => res.data)
  },
  getZyTables: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getZyTable: function (url, type) {
    return request.fetchApi(url, type, "CPToC").then(res => res.data)
  },
  generatedZyTable: function (url, type, ProvinceId, name, Batch, BatchName, UserId, UserScoreId, CourseType, chooseLevel, Total, Colleges, scoreType, rank, reliableRate) {
    return request.fetchApi(url, type, "CPToC", {
      "numId": 0,
      "provinceNumId": ProvinceId,
      "batch": Batch,
      "scoreNumId": UserScoreId,
      "userNumId": UserId,
      "batchName": BatchName,
      "reliableRate": reliableRate,
      "courseType": CourseType,
      "groupName": name,
      "totalScore": Total,
      "chooseLevel": chooseLevel,
      "scoreType": scoreType,
      "ranking": rank,
      "lineD": 0,
      "colleges": Colleges
    }).then(res => res.data)
  },
  getManualQueryColleges: function (url, type, ProvinceId, Batch, Total, CourseType, CollegeKeywords, Rank, YfydRank) {
    return fetchApi(url, type, "C", {
      "ProvinceId": ProvinceId,
      "Batch": Batch,
      "Total": Total,
      "CourseType": CourseType,
      "CollegeKeywords": CollegeKeywords,
      "Rank": Rank,
      "YfydRank": YfydRank
    }).then(res => res.data)
  },
  getZyCount: function (url, type, ProvinceId, Total, Course, Batch, GroupName) {
    return fetchApi(url, type, "C", {
      "ProvinceId": ProvinceId,
      "Total": Total,
      "Course": Course,
      "Batch": Batch,
      "GroupName": GroupName
    }).then(res => res.data)
  },
  // 活动   获取院校热门专业
  queryCollegeHotMajors: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  generate: function (url, type, pro, UserName, CollegeId, CollegeName, MajorName, Type) {
    return fetchApi(url, type, "C", {
      "Province": pro,
      "UserName": UserName,
      "CollegeId": CollegeId,
      "CollegeName": CollegeName,
      "MajorName": MajorName,
      "Type": Type
    }).then(res => res.data)
  },
  countOfStat: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  doLike: function (url, type, pro) {
    return fetchApi(url, type, "C", {
      "Province": pro
    }).then(res => res.data)
  },
  QueryColleges: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getReportsByTypeAndUserId: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  HuoDongAdmissionNoticeIsOpend: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 一键填报
  queryOneKeyRecommendColleges: function (url, type, AbType, Batch, ChooseLevel, CollegeTags, Course, IsIncludeZWBX, ProvinceId, ProvinceIds, Total, Rank) {
    return request.fetchApi(url, type, "CPD", {
      "isIncludeZWBX": IsIncludeZWBX,
      "isLoadProfessions": true,
      "provinceId": ProvinceId,
      "batch": Batch,
      "course": Course,
      "chooseLevel": ChooseLevel,
      "lineDiff": 0,
      "totalScore": Total,
      "rank": Rank,
      "provinceIds": ProvinceIds,
      "collegeTypes": CollegeTags,
      "abType": AbType,
      "levels": "",
      "educationTypeLevels": "",
      "sort": -1,
      "isASC": false,
      "pageIndex": 1,
      "pageSize": 66,
      "pageSizeForCSB": 0
    }).then(res => res.data)
  },

  // 活动-祝福
  blessingGenerate: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  blessingCountOfStat: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },

  // 小优快讯
  getQuickNews: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getQuickNew: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 推送
  saveForm: function (url, type, UserId, FormId, OpenId) {
    return fetchApi(url, type, "C", {
      "UserId": UserId,
      "FormId": FormId,
      "OpenId": OpenId,
      "IsActive": true
    }).then(res => res.data)
  },
  // 绑卡
  bindCard: function (url, type, CardNo, CardPassWord, UserId, sourceSign) {
    return request.fetchApi(url, type, "CPU", {
      "userId": UserId,
      "cardNo": CardNo,
      "cardPassword": CardPassWord,
      "platform": 3,
      "device": 6,
      "sourceSign": sourceSign
    }).then(res => res.data)
  },
  bindCardAndMobileByMiniApp: function (url, type, CardNo, CardPassWord, UserId, MobilePhone, MobileAuthCode, PassWord, ProvinceId) {
    return fetchApi(url, type, "C", {
      "CardNo": CardNo,
      "CardPassWord": CardPassWord,
      "UserId": UserId,
      "MobilePhone": MobilePhone,
      "MobileAuthCode": MobileAuthCode,
      "PassWord": PassWord,
      "ProvinceId": ProvinceId
    }).then(res => res.data)
  },
  // 浙江版分数线-最新
  queryCollegeScoreLines: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  queryPlanNumbers: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  queryCalendarYearEnrollmentData: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  queryCollegesByCollegeId: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 传统版分数线-最新
  queryUCodesAndBatchs: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  queryCollegeFractions: function (url, type, ucode, course, provinceid) {
    return fetchApi(url, type, "C", {
      "UCode": ucode,
      "Course": course,
      "ProvinceId": provinceid
    }).then(res => res.data)
  },
  queryCollegeProfessionsAndPlans: function (url, type, ucode, batch, course, provinceid) {
    return fetchApi(url, type, "C", {
      "UCode": ucode,
      "Batch": batch,
      "CourseType": course,
      "ProvinceId": provinceid
    }).then(res => res.data)
  },
  searchV2Common: function (url, type, provinceid, keywords) {
    return fetchApi(url, type, "C", {
      "CurrentProvinceId": provinceid,
      "Keywords": keywords,
      "Type": 10
    }).then(res => res.data)
  },
  // 获取banners
  queryBanners: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 推送文章
  getArticle: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 浙江智能填报分数线
  queryNewFractionProfessions: function (url, type, CollegeId, ProvinceId, Ucodes, Year) {
    return fetchApi(url, type, "C", {
      "CollegeId": CollegeId,
      "ProvinceId": ProvinceId,
      "Ucodes": Ucodes,
      "Year": Year
    }).then(res => res.data)
  },
  //获取游学列表
  getProjects: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  //更新点击率
  updateClickRate: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  //获取游学项目详情
  getProjectDetail: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  //获取用户游学订单
  getStudyTourOrderByUserId: function (url, type) {
    return fetchApi(url, type, "C").then(res => res.data)
  },
  registrationByMobileAuthCode: function (url, type, mobile, MobileAuthCode) {
    return fetchApi(url, type, "C", {
      "Mobile": mobile,
      "MobileAuthCode": MobileAuthCode,
      "RegistrationFromType": 6,
      "RegistrationFromSource": "小程序游学优惠券"
    }).then(res => res.data)
  },
  createOrder: function (url, type, userid, mobile, Price, IsTest, Remark, UserRemark, ProjectId, ProjectName, ChooseTime) {    //创建支付订单(包括讲堂和VIP在线升级)
    return fetchApi(url, type, "C", {
      "UserId": userid,
      "MobilePhone": mobile,
      "PayType": 2,
      "PayDeviceType": 6,
      "BussType": 42,
      "ProvinceId": 0,
      "Price": Price,
      "IsTest": IsTest,
      "Remark": Remark,
      "Quantity": 1,
      "ProvinceName": 0,
      "UserRemark": UserRemark,
      "ProjectId": ProjectId,
      "ProjectName": ProjectName,
      "ChooseTime": ChooseTime
    }).then(res => res.data)
  },
  queryStudyTourOrderGroup: function (url, type) { //用户拼团订单
    return fetchApi(url, type, "C").then(res => res.data)
  },
  // 选科
  QueryCollege: function (url, type, provinceId, keywords, year) { //大学查询选科搜索
    return fetchApi(url, type, "CPC", {
      "provinceId": provinceId,
      "subjects": "",
      "keywords": keywords,
      "isBen": true,
      "year": year,
      "count": 10
    }).then(res => res.data)
  },
  chooseSubjectProvince: function (url, type) { //选科开放省份
    return fetchApi(url, type, "CPC").then(res => res.data)
  },
  QueryCollegeChooseSubject: function (url, type) { //大学选考科目查询
    return fetchApi(url, type, "CPC").then(res => res.data)
  },
  QueryMajorChooseSubject: function (url, type) { //专业选考科目查询
    return fetchApi(url, type, "CPC").then(res => res.data)
  },
  QueryMajor: function (url, type, provinceId, keywords, year) { //专业查询选科搜索
    return fetchApi(url, type, "CPC", {
      "provinceId": provinceId,
      "subjects": "",
      "keywords": keywords,
      "isBen": true,
      "year": year,
      "count": 10
    }).then(res => res.data)
  },
  DoDefaultRecommendationColleges: function (url, type) { //默认推荐院校
    return fetchApi(url, type, "CPB").then(res => res.data)
  },
  DoDefaultRecommendationMajors: function (url, type, studentId, provinceId) { //默认推荐专业
    return fetchApi(url, type, "CPB", {
      "studentId": studentId,
      "provinceId": provinceId,
      "isBen": true,
      "pageIndex": 0,
      "pageSize": 6
    }).then(res => res.data)
  },
  DoChooseSubjectRecommendationMajors: function (url, type, provinceId, sex, subjects, year) { //最佳选科
    return fetchApi(url, type, "CPC", {
      "provinceId": provinceId,
      "sex": sex,
      "majorCodes": [],
      "subjects": subjects,
      "year": year,
      "isBen": true
    }).then(res => res.data)
  },
  QueryByCodeList: function (url, type, codeList) { //通过中类查小类
    return fetchApi(url, type, "CPC", codeList).then(res => res.data)
  },
  ComplexQuestions: function (url, type, codeList) { //获取所有问题
    return fetchApi(url, type, "CPC", codeList).then(res => res.data)
  },
  // 砍价0元购
  isParticipate: function (url, type, UserId, BargainId) { //判断好友是否参与过当前砍价活动
    return fetchApi(url, type, "C", {
      'UserId': UserId,
      'BargainId': BargainId
    }).then(res => res.data)
  },
  queryBargainFriend: function (url, type) { //获取好友砍价前20条记录
    return fetchApi(url, type, "C").then(res => res.data)
  },
  getBargain: function (url, type, UserId, BargainId, OpenId) { //获取砍价活动信息(分享砍价获取信息活动ID不允许为空,)
    return fetchApi(url, type, "C", {
      'UserId': UserId,
      'BargainId': BargainId,
      'OpenId': OpenId
    }).then(res => res.data)
  },
  insertBargain: function (url, type, UserId, Username, AvatarUrl, ProvinceId, Device, formId, OpenId) { //用户参与活动
    return fetchApi(url, type, "C", {
      'UserId': UserId,
      'Username': Username,
      'AvatarUrl': AvatarUrl,
      'ProvinceId': ProvinceId,
      'Device': Device,
      'FormId': formId,
      'OpenId': OpenId
    }).then(res => res.data)
  },
  insertBargainFriend: function (url, type, UserId, Username, AvatarUrl, BargainId, formId) { //好友砍价
    return fetchApi(url, type, "C", {
      'UserId': UserId,
      'Username': Username,
      'AvatarUrl': AvatarUrl,
      'BargainId': BargainId,
      'FormId': formId
    }).then(res => res.data)
  },
  activationUserPermission: function (url, type) { //激活会员卡
    return fetchApi(url, type, "C").then(res => res.data)
  },
  bargainGetStatus: function (url, type) { //活动状态
    return fetchApi(url, type, "C").then(res => res.data)
  },
};
function getChars(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'Z';
        break;
      case '1':
        chars[i] = 'O';
        break;
      case '2':
        chars[i] = 'T';
        break;
      case '3':
        chars[i] = 't';
        break;
      case '4':
        chars[i] = 'F';
        break;
      case '5':
        chars[i] = 'f';
        break;
      case '6':
        chars[i] = 'S';
        break;
      case '7':
        chars[i] = 's';
        break;
      case '8':
        chars[i] = 'E';
        break;
      case '9':
        chars[i] = 'N';
        break;
      case '-':
        chars[i] = 'L';
        break;
      case ':':
        chars[i] = 'D';
        break;
      case ' ':
        chars[i] = 'B';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzyApiSign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'L';
        break;
      case '1':
        chars[i] = 'l';
        break;
      case '2':
        chars[i] = 'V';
        break;
      case '3':
        chars[i] = 'v';
        break;
      case '4':
        chars[i] = 'R';
        break;
      case '5':
        chars[i] = 'r';
        break;
      case '6':
        chars[i] = 'Y';
        break;
      case '7':
        chars[i] = 'y';
        break;
      case '8':
        chars[i] = 'P';
        break;
      case '9':
        chars[i] = 'I';
        break;
      case '-':
        chars[i] = 'W';
        break;
      case ':':
        chars[i] = 'w';
        break;
      case ' ':
        chars[i] = 'Q';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzyDATASign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'P';
        break;
      case '1':
        chars[i] = 'O';
        break;
      case '2':
        chars[i] = 'I';
        break;
      case '3':
        chars[i] = 'U';
        break;
      case '4':
        chars[i] = 'Y';
        break;
      case '5':
        chars[i] = 'T';
        break;
      case '6':
        chars[i] = 'R';
        break;
      case '7':
        chars[i] = 'E';
        break;
      case '8':
        chars[i] = 'W';
        break;
      case '9':
        chars[i] = 'Q';
        break;
      case '-':
        chars[i] = 'A';
        break;
      case ':':
        chars[i] = 'S';
        break;
      case ' ':
        chars[i] = 's';
        break;
    }
  }
  return chars.join("");
}
function getCharsyouzySuperSign(str) {
  var chars = str.split("");
  for (var i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case '0':
        chars[i] = 'M';
        break;
      case '1':
        chars[i] = 'N';
        break;
      case '2':
        chars[i] = 'B';
        break;
      case '3':
        chars[i] = 'V';
        break;
      case '4':
        chars[i] = 'C';
        break;
      case '5':
        chars[i] = 'X';
        break;
      case '6':
        chars[i] = 'Z';
        break;
      case '7':
        chars[i] = 'L';
        break;
      case '8':
        chars[i] = 'K';
        break;
      case '9':
        chars[i] = 'J';
        break;
      case '-':
        chars[i] = 'H';
        break;
      case ':':
        chars[i] = 'G';
        break;
      case ' ':
        chars[i] = 'F';
        break;
    }
  }
  return chars.join("");
}

function youzySign() {  //yyyy-MM-dd HH:mm:ss:SSS
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = secss + "-" + mon + "-" + day + " " + hours + ":" + mins + ":" + secs + ":" + hao;
  var str = getChars(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "G" + getChars(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "C" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzyApiSign() {  //MM-yyyy-HH dd-mm-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  var str = mon + "-" + secss + "-" + hours + " " + day + "-" + mins + "-" + secs;
  var str = getCharsyouzyApiSign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "h" + getCharsyouzyApiSign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "U" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzyDATASign() {  //HH:MM-yyyy:::dd-SSS-mm-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = hours + ':' + mon + '-' + secss + ':::' + day + '-' + hao + '-' + mins + '-' + secs;
  var str = getCharsyouzyDATASign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "t" + getCharsyouzyDATASign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "T" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}
function youzySuperSign() {  //mm-dd-SSS-ss
  var data = new Date();
  var hours = data.getHours();
  var mins = data.getMinutes();
  var secs = data.getSeconds();
  var hao = data.getMilliseconds();
  var secss = data.getFullYear();
  var mon = data.getMonth() + 1;
  var day = data.getDate();
  if (mon < 10) {
    mon = '0' + mon
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (mins < 10) {
    mins = '0' + mins
  }
  if (secs < 10) {
    secs = '0' + secs
  }
  if (hao < 10) {
    hao = '00' + hao
  } else if (hao < 100 && hao > 10) {
    hao = '0' + hao
  };
  var str = mins + '-' + day + '-' + hao + '-' + secs;
  var str = getCharsyouzySuperSign(str);
  var sign = Math.floor(Math.random() * 999999999) + 1;
  str = str + "Q" + getCharsyouzySuperSign(sign + "");
  var ran = Math.floor(Math.random() * 6) + 2
  var newString = "";
  for (var i = 0; i <= ran; i++) {
    var strLen = str.length;
    var ranc = Math.floor(Math.random() * (strLen - 3)) + 2;
    newString = str.substring(0, ranc) + "q" + str.substring(ranc, strLen);
    str = newString;
  }
  return newString;
}