"use strict";
// 18301787894
class Coupon {
  constructor() {
    this.phoneNum = $("#phoneNum");
    this.vCode = $("#vCode");
    this.vCodeButton = $("#vCodeButton");
    this.couponButton = $("#couponButton");
    this.checkError = $("#checkError");
    this.rule = $("#rule");
    this.full = $("#full");
    this.fullImg = $("#full .dialog-img");
    this.fullDate = $("#full .dialog-img p");
    this.dialogClose = $("#dialogClose");
    this.status = false; // 状态
    this.coupon = null; // 1
    this.tiemr = null; // 定时器
    this.openId = "";
    this.phoneNumber = null
  }

  async init() {
    this.getWxCode();

    this.inputBlur();
    this.setVCodeButtonClick();
    this.setCouponButtonClick();
    this.setPhoneNumEvent();
    this.setRuleClick();
    this.dialogCloseClick();
  }

  // 解决微信输入框顶住页面造成下面空白
  inputBlur() {
    $("input").on("blur", function (e) {
      let offsetTop = $(this).offset().top;
      if ($(e.relatedTarget).is("input")) return;
      $("html body").animate({
        scrollTop: offsetTop
      });
    });
  }
  // 初始化弹窗
  initCoupon(coupon) {
    // coupon ? this.toggleDialogShow() : this.toggleDialogHide();
    if (!coupon) return
    if (coupon.useTime) {
      console.log('已使用')
      this.setDialogClassName('used')
    } else if (coupon.createDate) {
      // 小于等于七天 未使用
      console.log('未使用')
      this.setDialogClassName('unused')
    } else {
      console.log('已过期')
      this.setDialogClassName('timeout')
    }
    this.setDate(coupon.createDate)
    this.toggleDialogShow()
  }

  // 消息提示
  msgWay(val) {
    layui.use("layer", function () {
      var layer = layui.layer;
      layer.msg(val);
    });
    return this;
  }

  // 手机号 验证码 是否为空
  phoneNumInEmpty() {
    return !this.phoneNum.val() ? true : false;
  }
  vCodeInEmpty() {
    return !this.vCode.val() ? true : false;
  }
  // 手机号 验证码 聚焦
  phoneNumFocus() {
    this.phoneNum.focus();
    return this;
  }
  vCodeFocus() {
    this.vCode.focus();
    return this;
  }

  // 验证码class改变
  vCodeButtonActive() {
    this.vCodeButton.addClass("active");
    return this;
  }
  vCodeButtonRemoveActive() {
    this.vCodeButton.removeClass("active");
    return this;
  }

  setDate(createDate) {
    // 天数需要加七天
    this.fullDate.text(`有效期至${createDate}`)
    return this
  }

  // 立即领取
  sendSave(openId, vCode, phoneNum) {
    var url = `https://webapitest.youyu-erp.com/openApi/coupon/save`;
    $.ajax({
      url: url,
      data: {
        'enpCoupon.openId': openId,
        vCode: vCode,
        'enpCoupon.phoneNum': phoneNum
      },
      type: "post",
      success: data => {
        this.msgWay(data)
        if (data.returnCode == '0') {
          // 天数加七
          this.setDate(data.createDate)
          this.toggleDialogShow()
            .setDialogClassName('unused')
        } else {
          this.msgWay(data.returnMessage)
        }
      },
      error: err => {
        console.log(err);
        this.msgWay(3)
      }
    });
  }

  getVCode(phoneNum) {
    var url = `https://webapitest.youyu-erp.com/openApi/coupon/vcode`;
    $.ajax({
      url: url,
      data: {
        phoneNum: phoneNum
      },
      type: "post",
      success: data => {
        console.log(data)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  toggleCheckError(status) {
    // 能否获取验证码
    if (status) {
      this.vCodeButtonActive()
        .checkErrorHide()
        .setCheckErrorText("")
        .toggleStatus(true);
    } else {
      this.vCodeButtonRemoveActive()
        .checkErrorShow()
        .setCheckErrorText("该手机号码已获取优惠券,无法重复获取!")
        .toggleStatus(false);
    }
  }

  // 验证手机号能否使用
  isPhoneNumUse(phoneNum) {
    var url = `https://webapitest.youyu-erp.com/openApi/coupon/phoneNum`;
    let flag = false;
    const getStatus = () => {
      $.ajax({
        url: url,
        data: {
          phoneNum: phoneNum
        },
        type: "get",
        success: data => {
          if (data["returnCode"] === "0") {
            flag = true;
          } else {
            flag = false;
          }
          this.toggleCheckError(flag);
          this.phoneNumber = phoneNum
        },
        error: err => {
          console.log(err);
          flag = false;
        }
      });
    };
    getStatus()
  }

  // 控制错误信息是否显示
  checkErrorShow() {
    this.checkError.show();
    return this;
  }
  checkErrorHide() {
    this.checkError.hide();
    return this;
  }
  // 设置提示文字
  setCheckErrorText(val) {
    this.checkError.text(val);
    return this;
  }
  // 切换是否可以输入验证码
  toggleStatus(boolean) {
    this.status = boolean;
    return this;
  }

  // 切换dialog显示隐藏
  toggleDialogShow() {
    this.full.show();
    return this;
  }
  toggleDialogHide() {
    this.full.hide();
    return this;
  }



  // 设置dialogclass

  setDialogClassName(className) {
    this.removeDiaLogBc()
    this.setDiaLogBc(className)
    return this
  }

  removeDiaLogBc() {
    this.fullImg.removeClass('timeout used unused')
    return this
  }

  setDiaLogBc(className) {
    this.fullImg.addClass(className)
    return this
  }


  setVCodeButtonClick() {
    this.vCodeButton.on("click", () => {
      if (!this.status) return;
      if (this.phoneNumInEmpty())
        return this.msgWay("请输入手机号码").phoneNumFocus();
      this.countDown();
      this.getVCode(this.phoneNumber)
    });
  }


  setCouponButtonClick() {
    this.couponButton.on("click", () => {
      if (!this.status) return;
      if (this.phoneNumInEmpty())
        return this.msgWay("请输入手机号码").phoneNumFocus();
      if (this.vCodeInEmpty()) return this.msgWay("请输入验证码").vCodeFocus();
      if (this.vCode.val().length < 6) return this.msgWay('请输入六位数验证码');
      this.sendSave(this.openId, this.vCode.val(), this.phoneNumber)
    });
  }


  setPhoneNumEvent() {
    this.phoneNum
      .on("blur", () => {
        let val = this.phoneNum.val();
        if (val.length > 0 && val.length < 11)
          this.vCodeButtonRemoveActive()
          .checkErrorShow()
          .setCheckErrorText("手机号码格式错误");
      })
      .on("input propertychange", () => {
        let val = this.phoneNum.val();
        if (val.length <= 0)
          this.vCodeButtonRemoveActive()
          .checkErrorHide()
          .setCheckErrorText("")
          .toggleStatus(false);
        if (val.length !== 11)
          return this.vCodeButtonRemoveActive()
            .checkErrorHide()
            .setCheckErrorText("")
            .toggleStatus(false);
        this.isPhoneNumUse(val);
      });
  }
  setRuleClick() {
    this.rule.on("click", function () {
      layui.use("layer", function () {
        var layer = layui.layer;
        layer.open({
          type: 1,
          title: "规则说明",
          area: ["90%", "auto"],
          content: $("#rule-detail")
        });
      });
    });
  }

  countDown() {
    let timeNum = 6;
    this.vCodeButtonRemoveActive().toggleStatus(false);
    const setCodeText = val => this.vCodeButton.text(val);
    const countDownFun = () => {
      const setTimeNum = num => {
        if (timeNum === 0) {
          clearInterval(this.tiemr);
          setCodeText("获取验证码");
          this.vCodeButtonActive().toggleStatus(true);
          return;
        }
        setCodeText(`${num}s`);
      };
      clearInterval(this.tiemr);
      this.tiemr = setInterval(() => {
        setTimeNum(--timeNum);
      }, 1000);
    };
    return countDownFun();
  }

  dialogCloseClick() {
    this.dialogClose.on("click", () => {
      this.toggleDialogHide();
      wx.closeWindow();
    });
  }

  //
  isSuccess(openId) {
    var url = `https://webapitest.youyu-erp.com/openApi/coupon/openId`;
    $.ajax({
      url: url,
      data: {
        openId: openId
      },
      type: "get",
      success: data => {
        this.coupon = data;
        this.initCoupon(this.coupon);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 获取id
  getOpenId(code) {
    var url = `https://webapitest.youyu-erp.com/openApi/weChat/getOpenId`;
    $.ajax({
      url: url,
      data: {
        code: code
      },
      type: "get",
      success: data => {
        this.openId = data;
        this.isSuccess(this.openId);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getWxCode() {
    var searchStr = location.search;
    searchStr = searchStr.substr(1);
    var searchs = searchStr.split("&");
    var codes = searchs[0].split("=");
    var wcCode = codes[1];

    this.getOpenId(wcCode);
  }
}

new Coupon().init();