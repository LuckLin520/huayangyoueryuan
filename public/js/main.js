$(document).ready(function () {



	$('#my-menu').removeClass('submenu-content')

	var myOffside = offside('#my-menu', {
		slidingSide: 'right',
		slidingElementsSelector: '#for-side',
		buttonsSelector: '#offside-btn',
	});



	$('.pic-2').hide()

	$('.pic-3').hide()

	$('.pic-4').hide()

	$('.pic-switch').click(function () {

		console.log($(this).text())
		if ($(this).text() === '蘑菇新人') {
			$('.pic-1').show()
			$('.pic-2').hide()
			$('.pic-3').hide()
			$('.pic-4').hide()
		}
		if ($(this).text() === '蘑菇丽人') {
			$('.pic-1').hide()
			$('.pic-2').show()
			$('.pic-3').hide()
			$('.pic-4').hide()
		}
		if ($(this).text() === '蘑菇达人') {
			$('.pic-1').hide()
			$('.pic-2').hide()
			$('.pic-3').show()
			$('.pic-4').hide()
		}
		if ($(this).text() === '蘑菇名人') {
			$('.pic-1').hide()
			$('.pic-2').hide()
			$('.pic-3').hide()
			$('.pic-4').show()
		}


	})


	// $('.drawer').drawer();



	if ($('#work').length > 0) {

		var mySwiper = new Swiper(".swiper-container", {
			direction: "horizontal",
			/*横向滑动*/
			loop: true,
			/*形成环路（即：可以从最后一张图跳转到第一张图*/
			pagination: ".swiper-pagination",
			/*分页器*/
			prevButton: ".swiper-button-prev",
			/*前进按钮*/
			nextButton: ".swiper-button-next",
			/*后退按钮*/


			paginationClickable: true
		})
	}



	if ($('#star').length > 0) {

		var mySwiper = new Swiper(".swiper-container", {
			direction: "horizontal",
			/*横向滑动*/
			loop: true,
			/*形成环路（即：可以从最后一张图跳转到第一张图*/
			pagination: ".swiper-pagination",
			/*分页器*/
			prevButton: ".swiper-button-prev",
			/*前进按钮*/
			nextButton: ".swiper-button-next",
			/*后退按钮*/

			paginationClickable: true
		})
	}






	if ($('#area-nav').length > 0) {
		let temp = window.location.pathname
		let currentPath = temp.split('/')

		$(".area-a").each(
			function () {
				let href = $(this).attr("href").split('/')
				// console.log(href[2])
				if (href[2] == currentPath[2]) {
					$(this).addClass('area-active')
				}
			}
		)
	}


	// Active current Tag
	$('#wall a').click(function () {
		$('#wall a').removeClass('active');
		$(this).addClass('active');
	});
	$('#luck_lin a').click(function () {
		$('#luck_lin a').removeClass('active');
		$(this).addClass('active');
	});



	// 获取当前路径

	var pathName = window.document.location.pathname;
	var a = pathName.split('/')
	// console.log('current path: ' +a[1])
	$(".nav-a").each(

		function () {

			var t = $(this).attr("href").split('/')
			// console.log('t: ' + t[1])
			// console.log('a: ' + a[1])

			if (t[1] == a[1]) {
				// console.log(href)
				$(this).addClass('active-nav')
			}
		}
	)

	$('.mouse').animate({
		top: 'auto'
	}, 500)

	$('.mouse').animate({
		bottom: '100px'
	}, 500)


	$('#video').height(document.documentElement.clientHeight)
	$('#moveNext').click(function () {
		//   alert('ss')
		$("html,body").animate({
			scrollTop: document.documentElement.clientHeight
		}, 1000);

	})
	$('#link1').click(function () {
		window.location.href = '/culture';
	})
	$('#link2').click(function () {
		window.location.href = '/articles';
	})
	$('.area-a').on('click', function () {
		var index = $(this).parents('ul').children().index($(this).parent());
		//链接状态
		$('.tabs').each(function () {
			$(this).find('a').removeClass('area-active');
		});
		$(this).addClass('area-active');
		//切换当前
		$('.items').children().removeClass('show').addClass('hide').eq(index).addClass('show');
		//隐藏二级
		$('.group-info ').addClass('hide').removeClass('show');
		$('.group-info .text').removeClass('show').addClass('hide');
		//隐藏底部返回框
		$('.return').addClass('hide').removeClass('show');
	})




	//todo

	// $(document).on('click', '#toInfo', function () {
	// 	window.location.href = `/up/teacherInfo/${$(this).data('type')}`
	// })



	$(document).on('click', '.showInfo', tab)
	$(document).on('click', '.img p',tab)
	function tab() {
		//显示园区特色层
		$('.group-info ').removeClass('hide').addClass('show');
		//隐藏所有
		$('.group-info .text').removeClass('show').addClass('hide');
		//
		$('.img').addClass('hide').removeClass('show');
		//显示当前特色
		$('.group-info .text').eq($(this).data('id')).removeClass('hide').addClass('show');
		//显示返回框
		$('.return').addClass('show').removeClass('hide');
		switch($(this).data('id')){
			case 0:
			$('.leaf').text('华阳总园特色')
			break;
			case 1:
			$('.leaf').text('沙河分区特色')
			break;
			case 2:
			$('.leaf').text('南区分区特色')
			break;
			case 3:
			$('.leaf').text('西区分区特色')
			break;
		}
	}
	$('.return').click(function () {
		$('.img ').addClass('show').removeClass('hide');
		$('.group-info ').removeClass('show').addClass('hide');
		$('.group-info .text').removeClass('show').addClass('hide');
		$(".return").addClass('hide').removeClass('show');
	})
})