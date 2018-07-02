/**
 * 基于Date Range Picker的月份选择器扩展
 * github：
 * @param {起始时间} s 
 * @param {终止时间} e 
 * @param {最外层的div对象} classDom 
 * @param {内层的span对象} idDom 
 * @param {显示时间格式} sformat 
 * @param {是否显示日历} showCalendars 
 * @param {配置默认可选的时间范围} ranges 
 * @param {是否展示自定义范围} scrl 
 * @param {是否使用月份选择器} monthRange 
 */
var datePickers = function(s, e, classDom, idDom, sformat = 'YYYY-MM-DD', showCalendars = true, ranges, scrl = true,monthRange) {
    if (!ranges) {
        ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }
    var start = s || moment();
    var end = e || moment();

    function cb(start, end) {
        classDom.html(start.format(sformat) + " - " + end.format(sformat));
    }
    idDom.daterangepicker({
            locale: {
                format: sformat
            },
            alwaysShowCalendars: showCalendars,
            showDropdowns: true,
            startDate: start,
            showCustomRangeLabel: scrl,
            endDate: end,
            opens: "right",
            ranges: ranges
        },
        cb
    );
    cb(start, end);
    if(monthRange){
        //修改日期选择器
        $('div.drp-calendar').empty().html('<div class="s-cal"><div class="s-calTitle"><span class="glyphicon glyphicon-arrow-left s-calLastYear"aria-hidden="true"></span><p>2018</p><span class="glyphicon glyphicon-arrow-right s-calNextYear"aria-hidden="true"></span></div><ul class="s-calMonth"><li data-month="01">Jan</li><li data-month="02">Feb</li><li data-month="03">Mar</li><li data-month="04">Apr</li></ul><ul class="s-calMonth"><li data-month="05">May</li><li data-month="06">Jun</li><li data-month="07">Jul</li><li data-month="08">Aug</li></ul><ul class="s-calMonth"><li data-month="09">Sep</li><li data-month="10">Oct</li><li data-month="11">Nov</li><li data-month="12">Dec</li></ul></div>');
        $('div.drp-calendar.left > .s-cal').before('<div class="s-calViewTitle">Start Date</div>');
        $('div.drp-calendar.right > .s-cal').before('<div class="s-calViewTitle">End Date</div>');
        var timePickerDom = $('.s-timePicker'),
            sYearView = $($('.s-calTitle > p')[0]),
            eYearView = $($('.s-calTitle > p')[1]),
            monthViewLis = $('.s-calMonth > li'),
            sMonthViewLis = $($('.s-cal')[0]).find('.s-calMonth > li'),
            eMonthViewLis = $($('.s-cal')[1]).find('.s-calMonth > li'),
            tabs = $('div.daterangepicker > div.ranges > ul > li'),
            lastTab = $('div.daterangepicker > div.ranges > ul > li:last-child');
        //缓存日期
        var tempSYear,
            tempEyear,
            tempSMonth,
            tempEMonth;
        //变换日历视图修改样式
        function changeView(isAngle = false){
            var currentSYear = sYearView.text();
            var currentEYear = eYearView.text();
            eMonthViewLis.removeClass('disabled');
            if(isAngle){
                //年份不一致判断
                if(currentSYear > currentEYear){
                    eMonthViewLis.addClass('disabled');
                }
                if(currentSYear < currentEYear){
                    eMonthViewLis.removeClass('disabled');
                }
                if(currentSYear == tempSYear){
                    sMonthViewLis.eq(tempSMonth).addClass('onFocus');
                }
                if(currentEYear == tempEyear){
                    eMonthViewLis.eq(tempEMonth).addClass('onFocus');
                }
            }else{
                if(tempSMonth > tempEMonth){
                    //如果选中起始月份较大，则将日期赋值为起始月份
                    eMonthViewLis.removeClass('onFocus');
                    eMonthViewLis.eq(tempSMonth).addClass('onFocus');
                    putRangeDate();
                }
                eMonthViewLis.each(function(index){
                    if((index) == Number(tempSMonth)){
                        return false;
                    }
                    $(this).addClass('disabled');
                })
            }
        }
        //生成日期
        function putRangeDate(){
            var sYearDate = $($('.s-cal')[0]).find('.s-calTitle > p').text();
            var sMonthDate = $($('.s-cal')[0]).find('.s-calMonth > li.onFocus').data('month');
            var eYearDate = $($('.s-cal')[1]).find('.s-calTitle > p').text();
            var eMonthDate = $($('.s-cal')[1]).find('.s-calMonth > li.onFocus').data('month');
            tempSYear = sYearDate;
            tempEyear = eYearDate;
            tempSMonth = Number(sMonthDate) - 1;
            tempEMonth = Number(eMonthDate) - 1;
            timePickerDom.text(sYearDate+'-'+sMonthDate+' - '+eYearDate+'-'+eMonthDate);
            changeView();
        }
        //给View赋值样式
        function putDateView(sy,ey,sm,em){
            sy && sYearView.text(sy);//赋值起始年份
            ey && eYearView.text(ey);//赋值终止年份
            sm && sMonthViewLis.eq(sm).addClass('onFocus');//高亮起始月份
            em && eMonthViewLis.eq(em).addClass('onFocus'); //高亮终止月份
        }
        //取日期给View赋值样式
        function getRangeDate(){
            var datePeriod = timePickerDom.text().split(' - ');
            var sDate = datePeriod[0].split('-'); //起始年月
            var eDate = datePeriod[1].split('-'); //终止年月
            tempSYear = sDate[0];
            tempEyear = eDate[0];
            tempSMonth = Number(sDate[1]) - 1;
            tempEMonth = Number(eDate[1]) - 1;
            putDateView(tempSYear,tempEyear,tempSMonth,tempEMonth);
        }
        getRangeDate();
        changeView();
        //前一年
        $('.s-calLastYear').click(function(e){
            var startDateDom = $(e.target).next('p');
            startDateDom.text(Number(startDateDom.text()) - 1);
            $(this).parents('.s-cal').find('.s-calMonth > li').removeClass('onFocus');
            changeView(true);
        })
        //后一年
        $('.s-calNextYear').click(function(e){
            var startDateDom = $(e.target).prev('p');
            startDateDom.text(Number(startDateDom.text()) + 1);
            $(this).parents('.s-cal').find('.s-calMonth > li').removeClass('onFocus');
            changeView(true);
        })
        //选中月份
        monthViewLis.click(function(){
            tabs.removeClass('active');
            lastTab.addClass('active');
            //两个if处理使用箭头移动导致都没有选中月份的情况
            if(!sMonthViewLis.hasClass('onFocus')){
                sMonthViewLis.eq(0).addClass('onFocus');
            }
            if(!eMonthViewLis.hasClass('onFocus')){
                eMonthViewLis.eq(0).addClass('onFocus');
            }
            $(this).parents('.s-cal').find('.s-calMonth > li').removeClass('onFocus');
            $(this).addClass('onFocus');
            putRangeDate();
        })
        
    }
};