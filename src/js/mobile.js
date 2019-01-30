"use strict";

// 联系方式切换
class ToggleCancat {
  constructor(elem) {
    this.options = this.initOptions()
    Object.assign(this.options, this.getRelationHanle(elem))
  }

  initOptions() {
    return {}
  }

  getRelationHanle(elem) {
    let el = $(elem)
    return {
      listsTarget: el.find('.concat-list a'),
      contentsTarget: el.find('.concat-content')
    }
  }

  init(i = 0) {
    const {
      listsTarget,
      contentsTarget
    } = this.options

    this.setListClick(listsTarget, contentsTarget)
    this.toggleDom(listsTarget[i], contentsTarget[i])
  }

  setListClick(listsTarget, contentsTarget) {
    listsTarget.each((i, elem) => {
      $(elem).click(() => {
        this.toggleDom(elem, contentsTarget[i])
      })
    })
  }

  toggleDom(listTarget, contentTarget) {
    this.setListActive(listTarget)
    this.setContentShow(contentTarget)
  }
  setListActive(listTarget) {
    this.removeListActive(listTarget)
    $(listTarget).addClass('active')
  }

  removeListActive(listTarget) {
    $(listTarget).siblings('a').removeClass('active')
  }

  setContentShow(contentTarget) {
    this.removeContentHide(contentTarget)
    $(contentTarget).show()
  }

  removeContentHide(contentTarget) {
    $(contentTarget).siblings('.concat-content').hide()
  }


}

// 切换更多
class ToggleFull {
  constructor(elem) {
    this.options = this.initOptions()
    Object.assign(this.options, this.getRelationHanle(elem))
  }

  initOptions() {
    return {
      fullHeadNameArr: ['卓越的产品特性', '特色功能', '我们的客户'],
      fullFilterStatus: [0, 0, 0],
      now: 0
    }
  }
  init() {
    this.setMoreClick(this.options)
    this.setFullBackClick(this.options.fullBackTarget)
    this.fullTouch()
  }
  getRelationHanle(elem) {
    let more = $(elem.more)
    let full = $(elem.full)
    return {
      moresTarget: more,
      fullTarget: full,
      fullHeadTarget: full.find('.title-name'),
      fullBackTarget: full.find('.full-head__black'),
      fullFilterTarget: full.find('.full-head__filter'),
      fullFilterEmptyTarget: full.find('.full-head__filter_empty'),
      fullContainers: full.find('.full-toggle')
    }
  }

  // 设置更多事件
  setMoreClick(options) {
    const {
      moresTarget,
      fullContainers,
      fullHeadNameArr,
      fullFilterStatus
    } = options
    moresTarget.each((i, elem) => {
      $(elem).on('click', () => {
        this.toggleSlideShow()
        this.setHeadName(fullHeadNameArr[i])
        this.setContainerShow(fullContainers[i])
        this.setFilterShowOrHide(fullFilterStatus[i])
        this.setFilterEmptyToggle(fullFilterStatus[i])
        this.setNow(i)
      })
    })
  }
  // 设置遮罩层返回
  setFullBackClick(fullBackTarget) {
    $(fullBackTarget).on('click', () => {
      this.backSlideHide()
      this.removeContainerHide()
    })
  }
  // 切换列表显示
  toggleSlideShow() {
    this.options.fullTarget.addClass('active')
  }
  // 切换列表隐藏
  backSlideHide() {
    this.options.fullTarget.removeClass('active')
  }
  // 设置头部名称
  setHeadName(name) {
    $(this.options.fullHeadTarget).text(name)
  }
  // 显示内容
  setContainerShow(container) {
    $(container).show()
  }
  // 隐藏所有内容
  removeContainerHide() {
    $(this.options.fullContainers).hide()
  }
  // 设置筛选是否开启
  setFilterShowOrHide(i) {
    i ? $(this.options.fullFilterTarget).show() : $(this.options.fullFilterTarget).hide()
  }
  // 设置筛选布局占位元素
  setFilterEmptyToggle(i) {
    i ? $(this.options.fullFilterEmptyTarget).hide() : $(this.options.fullFilterEmptyTarget).show()
  }
  // 设置当前索引
  setNow(i) {
    this.options.now = i
  }

  // 遮罩层滑动
  fullTouch() {
    let fullDom = this.options.fullTarget
    let startX, startY, moveEndX, moveEndY, X, Y;
    fullDom.on('touchstart', (e) => {
      // e.preventDefault()
      startX = e.touches[0].pageX
      startY = e.touches[0].pageY
      e.stopPropagation()
    })
    fullDom.on('touchmove', (e) => {
      // e.preventDefault()
      moveEndX = e.changedTouches[0].pageX;
      moveEndY = e.changedTouches[0].pageY;

      X = moveEndX - startX;
      Y = moveEndY - startY;

      // if (Math.abs(X) > Math.abs(Y) && X > 0) {
      //   console.log("向右");
      //   this.backSlideHide()
      //   this.removeContainerHide()
      // } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      //   console.log("向左");
      // } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      //   console.log("向下");
      // } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      //   console.log("向上");
      // } else {
      //   console.log("没滑动");
      // }
      console.log(X)
      if (Math.abs(X) > Math.abs(Y) && X > 100) {
        this.backSlideHide()
        this.removeContainerHide()
      }
      e.stopPropagation()
    })
  }

}

// 切换列表显示
class ToggleList {
  constructor(elem) {
    this.listsTarget = $(elem).find('li')
  }
  init() {
    this.setListToggle(this.listsTarget)
  }

  setListToggle(listsTarget) {
    listsTarget.each((i, elem) => $(elem).on('click', () => this.setListActive(elem)))
  }

  setListActive(listTarget) {
    this.removeListActive(listTarget)
    $(listTarget).toggleClass('active')
  }
  removeListActive(listTarget) {
    $(listTarget).siblings('li').removeClass('active')
  }
}


var listProduct = [{
    imgName: 'listIcon-hybj.png',
    title: '专业的行业管理背景',
    detail: '拥有一批资深的医疗器械监管领域的法规专家,时刻关注与行业相关的法律法规的变化，确保系统设计持续符合监管要求。'
  },
  {
    imgName: 'listIcon-zlgglc.png',
    title: '完整的质量管理流程',
    detail: '支持对医疗器械产品的首营、采购、验收，入库、盘点、养护、库管、销售、出库、退货、质量跟踪及售后服务全过程的质量管理，满足监管追溯的要求。'
  },
  {
    imgName: 'listIcon-zlglzd.png',
    title: '合规的质量管理制度',
    detail: '和软件配套的质量管理制度、操作流程、质量管理记录等质量管理体系文件，完全符合现行法规管理要求，全方位匹配软件功能。'
  },
  {
    imgName: 'listIcon-rjbb.png',
    title: '丰富实用的软件版本',
    detail: '面向不同规模的企业，提供全品类（医疗器械、角膜接触镜及非医疗器械）、全模式（批发、零售、批发兼零售）、多层级（标准版、企业版、专业版）的版本供企业灵活选择。'
  },
  {
    imgName: 'listIcon-sjpdkz.png',
    title: '严格的数据判断与控制',
    detail: '严格的供货者、产品、购货者首营审核流程，严谨的经营节点判断与控制功能， 规避了超范围经营、过期经营等各类风险。'
  },
  {
    imgName: 'listIcon-yjsd.png',
    title: '及时的跟踪预警与锁定',
    detail: '覆盖全系统的效期预警功能，对近效期的首营企业和产品资质、 库存产品效期等进行及时提醒，过期的证照和产品将自动锁定，禁止进行业务操作。'
  },
  {
    imgName: 'listIcon-qxkz.png',
    title: '灵活的权限设定与操作控制',
    detail: '基于岗位角色，授权方便快捷，操作者通过身份验证登录，在权限范围内处理业务数据；支持对业务数据查询范围、价格查询范围进行灵活控制，确保数据安全。'
  },
  {
    imgName: 'listIcon-sjbf.png',
    title: '稳固的数据备份',
    detail: '提供阿里云国内异地（上海、杭州）双备份，系统内每天自动备份，同时支持企业下载数据后再备份，确保您的数据安全。'
  },
  {
    imgName: 'listIcon-rjcz.png',
    title: '便捷的软件操作',
    detail: '采用数据驱动技术，确保每位员工的待处理工作都在个人工作台上，各类业务操作方便快捷。'
  },
  {
    imgName: 'listIcon-xtbz.png',
    title: '安全的信息系统保障',
    detail: '基于等保四级的阿里云平台，提供专属唯一的系统登录地址，采用HTTPS全链路加密进行安全访问，并通过密码+验证码登录双验证方式确保系统安全。通过采用国产加密算法进行数据加密等多种安全措施，让数据安全掌握在您自己手中。'
  }
]

var listFeatures = [{
    imgName: 'listIcon-plcl.png',
    title: '批量处理',
    detail: '提供企业首营、采购订单、产品验收、客户订单、销售出库等数据的批量导入和导出，还可以直接导入“上海红会系统”的产品信息模板，提升企业的业务操作效率。'
  },
  {
    imgName: 'listIcon-zcsm.png',
    title: '支持扫码',
    detail: '支持直接扫描产品条形码（GS128，HIBC等）进行产品的验收、出库、销后退回等业务操作，提高工作效率和数据准确度。'
  },
  {
    imgName: 'listIcon-zzsz.png',
    title: '自主设置',
    detail: '提供业务审核流程、业务参数的自定义管理功能，企业可以根据自身规模和管理制度进行自主修改，确保系统符合企业管理要求。'
  },
  {
    imgName: 'listIcon-zncg.png',
    title: '智能仓管',
    detail: '允许企业在系统中创建多仓库，每个仓库支持独立的货位管理，系统在验收过程中会智能判断产品存放的仓库和货位，提高了验收过程的便捷性和准确性。'
  },
  {
    imgName: 'listIcon-gydj.png',
    title: '广域对接',
    detail: '可以与企业现有的业务系统（如：	SAP、Oracle、金蝶、用友、医疗器械第三方物流、温湿度监控等）进行系统级对接，还可以与监管部推出的监管系统（包括追溯申报、杨浦精细化等）进行数据对接。'
  },
  {
    imgName: 'listIcon-wxbg.png',
    title: '微信办公',
    detail: '提供企业通过微信扫码快速登录ERP系统，并可以通过我们的微信公众号接收业务消息和进行快捷审核操作。'
  },
  {
    imgName: 'listIcon-sjgx.png',
    title: '数据共享',
    detail: ' 企业可以将采购订单数据在系统内直接发送给供货者，供货者可以直接接收并转换成客户订单；供货者在完成销售出库后可以将数据直接发送给企业，企业同样可以直接接收并转换为产品验收。实现上下家数据实时关联，数据共享。'
  },
  {
    imgName: 'listIcon-lhdy.png',
    title: '灵活打印',
    detail: '允许企业用户自定义各类单据显示列，满足自身需要。支持各类单据自定义打印和多模板管理，实现不同打印要求的快速切换，灵活打印各类报表。'
  },
  {
    imgName: 'listIcon-xjfl.png',
    title: '新旧分类',
    detail: '系统内新、旧医疗器械分类目录双轨并存，产品首营时可以直接查询选择，系统会自动识别新、旧医疗器械分类标准，确保信息准确。'
  },
  {
    imgName: 'listIcon-zlbb.png',
    title: '质量报表',
    detail: '内置各类规范的监管报表50余份，方便企业建立各种质量管理记录和管理档案，便于监管人员进行日常监管和数据核实。'
  },
  {
    imgName: 'listIcon-qczs.png',
    title: '全程追溯',
    detail: ' 为用户提供根据产品批号进行的全环节、全流程的实时追溯。一键查询一个产品的完整经销周期。'
  },
  {
    imgName: 'listIcon-cwfx.png',
    title: '财务分析',
    detail: '提供验收和出库汇总表、销售利润、销售排行榜及存货周转率等丰富的财务分析统计报表功能。'
  },
  {
    imgName: 'listIcon-rzlh.png',
    title: '日志留痕',
    detail: '系统实时记录用户登录、人员管理、授权管理及各类业务功能的操作痕迹，并提供查询统计功能，方便企业时刻了解软件的使用情况。'
  }
]

// 设置客户列表
var setFullClientData = function setFullClientData(clientData) {
  var clientList = $('#fullClient');
  clientData.map(function (item) {
    return clientList.append("<li>" + item + "</li>");
  });
};
var setClientData = function setFullClientData(clientData) {
  const clientList = $('#clientList')
  const spliceClientData = (arr, index, num) => arr.splice(index, num)
  const clientDataArr = spliceClientData(clientData, 0, 30)
  clientDataArr.map(item => clientList.append(`<li>${item}</li>`))
}


// 设置遮罩列表
const setFullList = (elem, arr) => {
  let ulDom = $(elem);
  arr.map((item) => {
    return ulDom.append(`<li><div class="list-head"><div class="list-title"><img src="./img/official-website/public/${item.imgName}" alt="有鱼ERP" />${item.title}</div><div class="jiantou"></div></div><div class="list-container">${item.detail}</div></li>`);
  });
}



setClientData(clientListData)
setFullClientData(clientListData);


setFullList('#listProduct', listProduct)
setFullList('#listFeatures', listFeatures)


new ToggleCancat('#concat').init(0)
new ToggleFull({
  more: '.more',
  full: '#full'
}).init()
$('.full-list').each((i, elem) => {
  new ToggleList(elem).init()
})


$('#closeNew').on('click', () => {
  $('#new').hide()
  $('#concat,#full').css('margin-bottom', '0')
})