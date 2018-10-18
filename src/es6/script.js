$(function () {
    /**
     * 引入 Clamp.js 控制文本两行显示
     * clamp 行数
     */
    $('.doc-ud__text').each(function (index, element) {
        $clamp(element, {clamp: 2})
    })

    /**
     * 单击展开列表
     */
    $('.doc-ud__more').each(function (index, element) {
        $(element).on('click', function () {
            $('.doc-more').eq(index).slideToggle()
        })
    })
})
