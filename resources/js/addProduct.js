var category = null;
var save = 0;
$.post('/shops/cat-1',function(data,status){
    category = data;
    if(category !== null){
        const len = category.length;
        for(var i=0;i<len;i++){
            $('#cat-1-select').append(`<div class="item-select-cbx first-item">
            ${category[i].ten}
        </div>`)
        }
    }
    $('#cat-1-select').append()
})

$(document).ready(function(){
    const cat_1 = $('.add-shop-category-1');
    const cat_2 = $('.add-shop-category-2');
    var choose_cat_1;

    const hideComboBox = ()=>{
        $('.drop-down-cbx').addClass("disable");
        $('.drop-down-cbx').removeClass("show");
    }

    $(this).on('click',hideComboBox);

    $('.combo_box').on('click',function(e){
        const dropdown = $(this).next();
        dropdown.removeClass("disable");
        dropdown.toggleClass("show");
        $(this).children('div').children('i').toggleClass("rotate");
        e.stopPropagation();
    })

    $('#cat-1-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        choose_cat_1 = $(this).index();
        if(category[choose_cat_1].existsCate2===false)  return;
        $('.add-shop-category-2').css('display','block');
        $('#cat-2-select').empty();
        $('#span-2').text(`${category[choose_cat_1].cate2[0].ten}`);
        $('#span-2').attr('data-maso',`${category[choose_cat_1].cate2[0].maso}`);
        const len = category[choose_cat_1].cate2.length;
        for(var i=0;i<len;i++){
            $('#cat-2-select').append(`<div class="item-select-cbx first-item" data-maso="${category[choose_cat_1].cate2[i].maso}">
            ${category[choose_cat_1].cate2[i].ten}
        </div>`)
        }
    })

    $('#cat-2-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.attr('data-maso',$(this).attr('data-maso'));
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    $('#sex').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    $('#save').on('click',function(e){
        const data = {
            tensanpham: $('#tensanpham').val(),
            danhmuccap2: +$('#span-2').attr('data-maso'),
            noisanxuat: $('#noisanxuat').val(),
            kichthuoc: $('#kichthuoc').val(),
            gioitinhsudung: $('#gioitinhsudung').text(),
            mota: editor.getData(),
            giaban: +$('#giaban').val(),
            soluong: +$('#soluong').val()
        }
        save = 1;
        $.post('/shops/add-product',data,function(data,status){
            alert('Thành công');
            window.location.replace('/');
        })
        alert('check data ');
    })
})

window.addEventListener('beforeunload', function (e) {
    if(save === 0){
        $.post('/shops/unloadFakeProduct',{},function(data,status){
            //finished unload fakeProduct
        })
    }else{
        //do nothing
    }
});