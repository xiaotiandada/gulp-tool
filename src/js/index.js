// 设置客户列表
const setClientData = () => {
  let clientData = [
    "国药汇融（上海）医疗科技有限公司",
    "上海科治好医疗设备有限公司",
    "凌鲲（上海）医疗科技有限公司",
    "尊贵视力瑷维(北京）科技有限公司上海第一分公司",
    "江苏朗道生物技术有限公司",
    "上海盟儒慧基因科技有限公司",
    "医学之星（上海）租赁有限公司",
    "杭州脉乐医疗科技有限公司",
    "镜界网络科技（南京）有限公司",
    "赫幸科技（上海）有限公司",
    "上海菲士康隐形眼镜有限公司",
    "孟楚庭贸易（上海）有限责任公司",
    "暹罗（上海）生物科技有限公司",
    "上海明林眼镜有限公司分公司",
    "昕琦隐形眼镜（上海）有限公司",
    "皓钧佰业（上海）医疗科技有限公司",
    "上海科治好医疗设备有限公司",
    "上海庐宇融资租赁有限公司",
    "嘉视达（上海）医疗设备有限公司",
    "盛势达国际贸易（上海）有限公司",
    "中国上海外经（集团）有限公司投资咨询服务分公司",
    "上海博全尔生物科技有限公司",
    "依视乐（上海）商贸有限责任公司",
    "上海复星医疗系统有限公司",
    "暹罗（上海）生物科技有限公司",
    "上海盛复源生物医药有限公司",
    "上海友联医疗器械科技有限公司",
    "上海勤达医疗器械商行",
    "赛雅生物科技（上海）有限公司",
    "上海四维医学科技有限公司",
  ]
  const clientList = $('#clientList li')
  clientData.map(item => clientList.before(`<li>${item}</li>`))
}

// 滚动导航
class ScrollNav {
  constructor(elem) {
    this.options = this.initOptions()
    Object.assign(this.options, this.getRelationTarget(elem))
  }

  initOptions() {
    return {
      navTarget: '',
      scrollTopTarget: ''
    }
  }

  getRelationTarget(elem) {
    const {
      navTarget,
      scrollTopTarget
    } = elem
    return {
      navTarget: $(navTarget),
      scrollTopTarget: $(scrollTopTarget)
    }
  }

  init() {
    const {
      navTarget,
      scrollTopTarget
    } = this.options
    this.setNavClick(navTarget, scrollTopTarget)
    this.scrollListen(navTarget, scrollTopTarget)
  }

  setNavClick(navTarget, scrollTopTarget) {
    navTarget.each((i, elem) => {
      $(elem).click(() => {
        this.toggleScrollTop(scrollTopTarget[i])
        // this.setNavActive(elem)
      })
    })
  }

  toggleScrollTop(scrollTarget) {
    $("html,body").animate({
      "scrollTop": ($(scrollTarget).offset().top) - 50
    })
  }

  setNavActive(navTarget) {
    this.removeNavActive(navTarget)
    $(navTarget).addClass('active')
  }

  removeNavActive(navTarget) {
    $(navTarget).parents('ul').find('li a').removeClass('active')
  }

  // 滚动监听
  scrollListen(navTarget, scrollTopTarget) {

    // 得到滚动数据
    const getScrollTopArr = scrollTopTarget => {
      let arr = []
      scrollTopTarget.each((i, elem) => {
        arr.push($(elem).offset().top)
      })
      return arr
    }

    const scrollArr = getScrollTopArr(scrollTopTarget)

    // 切换滚动聚焦
    const scrollToggleActive = (top, scrollArr) => {
      if (top >= scrollArr[0] && top <= scrollArr[1]) {
        // console.log(scrollArr[0])
        this.setNavActive(navTarget[0])
      } else if (top >= scrollArr[1] && top <= scrollArr[2]) {
        // console.log(scrollArr[1])
        this.setNavActive(navTarget[1])
      } else if (top >= scrollArr[2] && top <= scrollArr[3]) {
        // console.log(scrollArr[2])
        this.setNavActive(navTarget[2])
      } else if (top >= scrollArr[3]) {
        // console.log(scrollArr[3])
        this.setNavActive(navTarget[3])
      } else {
        this.removeNavActive(navTarget[0])
      }
    }

    // 防抖函数
    const debounce = (fn, wait) => {
      let timer = null
      return () => {
        clearTimeout(timer)
        timer = setTimeout(fn, wait)
      }
    }

    // 节流函数
    const throttle = (fn, delay) => {
      let lastTime = null
      return () => {
        let nowTime = Date.now()
        if (nowTime - lastTime >= delay || !lastTime) {
          fn()
          lastTime = nowTime
        }
      }
    }

    const listenScroll = () => {
      let top = ($(window).scrollTop()) + 51
      scrollToggleActive(top, scrollArr)
    }

    $(window).on('scroll', throttle(listenScroll, 150))

  }
}

// 切换类型
class ToggleType {
  constructor(el) {
    this.options = this.initOptions()
    Object.assign(this.options, this.getRelationTarget(el))
  }

  initOptions() {
    return {
      detailTarget: '',
      contentTarget: ''
    }
  }

  getRelationTarget(el) {
    let elem = $(el)

    return {
      detailTarget: elem.find('.toggle-detail__block'),
      contentTarget: elem.find('.toggle-content p'),
    }
  }

  init(i = 0) {
    const {
      detailTarget,
      contentTarget
    } = this.options

    this.toggleDom(detailTarget[i], contentTarget[i])
    this.setToggleDetailClick(detailTarget, contentTarget)
  }

  setToggleDetailClick(detail, content) {
    detail.each((i, elem) => {
      $(elem).on('mouseover', () => {
        this.toggleDom(elem, content[i])
      })
    })
  }

  toggleDom(detail, content) {
    this.setTargetActive(detail)
    this.setTargetShow(content)
  }

  setTargetActive(target) {
    this.removeActive(target)
    $(target).addClass('active')
  }

  removeActive(target) {
    $(target).parents('.toggle').find('.toggle-detail__block').removeClass('active')
  }

  setTargetShow(target) {
    this.hideTarget(target)
    $(target).show()
  }
  hideTarget(target) {
    $(target).parents('.toggle').find('.toggle-content p').hide()
  }

}


new ScrollNav({
  navTarget: '.logo-nav ul li a',
  scrollTopTarget: '.scrollTarget'
}).init()

let toggleDom = $('.toggle')
let len = toggleDom.length
while (len--) {
  new ToggleType(toggleDom[len]).init(0)
}

setClientData()

$('#closeNew').on('click', () => $('#new').hide())