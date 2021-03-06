/**
 * eadmin 表单组件
 */

class Form{

	/**
	 * 表单初始化
	 */
	static init(dom = null){
		// 定义需要处理的容器，默认处理BOX内的所有表单
		// 设置这个值是因为有时候只需要针对某一容器内部的表单进行处理，比如window中load的页面
		// 只需要针对处理即可，减少开销
		let form = (dom == null) ? box : dom;
		// 是否需要去掉自动完成
		if (module.conf.close_autocomplete)
			form.find("input[type='text']").attr('autocomplete', 'off');
		// 文本框
		form.find("input[type='text']").each(function(){
			// 私有变量
			let v = {
				this  : $(this),
				// 带图标的input的默认class
				class : 'icon-input'
			}
			// 是否需要图标
			v.icon = v.this.data('icon');
			if (v.icon != undefined)
			{
				// 判断是否是右侧图标
				if (v.icon.indexOf('|') != -1)
				{
					let arr = v.icon.split('|');
					v.icon  = arr[0];
					v.class = arr[1] == 'right' ? v.class + '-right' : v.class;
				}
				if( ! v.this.parent().is('label'))
				{
					v.this.before(`<label class="${v.class}"></label>`);
					v.label = v.this.prev('label');
					$(`<i class="fa ${v.icon}"></i>`).appendTo(v.label);
					v.this.appendTo(v.label);
				}
				else
				{
					v.this.before(`<i class="fa ${v.icon}"></i>`);
					v.this.
						parent().
						addClass(v.class);	
				}
			}
			// 文本框显示模式
			v.model = v.this.data('model');
			if (v.model != undefined)
			{
				Form.input(v.this, v.model, true);
			}
			// 前方有固定文本
			v.prepend = v.this.data('prepend');
			if (v.prepend != undefined)
			{
				let html = `<div class="input-group">
								<span class="prepend">${v.prepend}</span>
							</div>`;
				v.this.before(html);
				v.this.appendTo(v.this.prev('.input-group'));
			}
			// 后方有固定文本
			v.append = v.this.data('append');
			if (v.append != undefined)
			{
				if( ! v.this.parent().is('.input-group'))
				{
					let html = `<div class="input-group"></div>`;
					v.this.before(html);
					v.this.appendTo(v.this.prev('.input-group'));
				}
				$(`<span class="append">${v.append}</span>`).appendTo(v.this.parent());
			}
			// 带数字加减功能的文本框
			if (v.this.hasClass('num-input'))
			{
				v.val  = parseInt(v.this.val()),
				// 最小值
				v.min  = v.this.data('min') == undefined ? 0 : parseInt(v.this.data('min')),
				// 最大值
				v.max  = v.this.data('max') == undefined ? 0 : parseInt(v.this.data('max')),
				// 加
				v.add  = (v.max > 0 && v.val >= v.max) ? 'disabled' : '',
				// 减
				v.cut  = (v.val <= v.min) ? 'disabled' : '',
				v.html = `<span class="num-add-cut">
							<i class="fa fa-angle-up add ${v.add}"></i>
							<i class="fa fa-angle-down cut ${v.cut}"></i>
						</span>`;
				v.this.before(`<div class="input-group"></div>`);
				let group = v.this.prev('.input-group');
				v.this.appendTo(group);
				$(v.html).appendTo(group);
			}
		});
		// 文本域
		form.find('textarea[maxlength]').each(function(){
			// 私有变量
			let v = {
				this : $(this)
			};
			// 字数限制
			v.max  = v.this.attr('maxlength');
			v.len  = v.this.text().length;
			v.html = `<span class="font-num">${v.len} / ${v.max}</span>`;
			v.this.
				addClass('no-resize textarea-max').
				after(v.html);
		});
		// 单选框
		form.find(':radio').each(function(){
			let v = {
				this  : $(this),
				class : 'radio'
			}
			v.class += (v.this.is(':disabled')) ? '-disabled' : '';
			v.class += (v.this.is(':checked')) ? '-checked' : '';
			v.this.
				parent().
				addClass(v.class);
			v.icon = (v.this.is(':checked')) ? 'dot-' : '',
			v.html = `<i class="fa fa-${v.icon}circle-o"></i>`;
			v.this.before(v.html);
		});
		// 复选框
		form.find(':checkbox').each(function(){
			let v = {
				this  : $(this),
				class : 'checkbox'
			}
			// 判断是不是switch
			if (v.this.data('model') == 'switch')
			{
				v.checked = '';
				if (v.this.is(':checked'))
				{
					v.checked = ' switch-open';
					v.this.val(1);
				}
				else
				{
					v.this.val(0);
				}
				v.disabled = v.this.is(':disabled') ? ' switch-disabled' : '',
				v.html = `<div class="checkbox-switch${v.checked}${v.disabled}">
							<span></span>
						</div>`;
				v.this.parent().after(v.html);
			}
			else
			{
				v.class += v.this.is(':disabled') ? '-disabled' : '';
				v.class += v.this.is(':checked') ? '-checked' : '';
				v.this.parent().addClass(v.class);
				v.icon = v.this.is(':checked') ? 'check-' : '',
				v.html = `<i class="fa fa-${v.icon}square-o"></i>`;
				v.this.before(v.html);
			}
		});
		// 下拉菜单
		form.find('select').each(function(){
			let v = {
				this : $(this),
				li   : ''
			};
			v.disabled = '';
			// 如果是子级菜单也禁用
			if (v.this.is(':disabled'))
			{
				v.disabled = ' select-disabled';
			}
			// 判断是否有绑定的子菜单
			v.bind = v.this.data('bind');
			if (v.bind != undefined)
			{
				v.child = form.find('#' + v.bind);
				if (v.child.length == 0)
				{
					console.log('没有找到绑定的ID为' + v.bind + '的子菜单');
				}
				else
				{
					v.child.attr('disabled', true);
				}
			}
			// 定义真实宽度
			if (v.this.data('width') != undefined)
			{
				v.width = v.this.data('width');
				if ( ! _.endsWith(v.width, '%'))
					v.width += 'px';
			}
			else
			{
				v.width = v.this.outerWidth() + 'px';
			}
			v.txt   = v.this.find(':selected').text();
			v.class = v.this.val() == module.conf.select_default_val || v.disabled != '' ? '' : 'selected';
			v.html  = `<div style="width:${v.width};" class="select${v.disabled}" data-open="0">
							<span class="${v.class}">${v.txt}</span>
							<i class="fa fa-angle-down rotate"></i>
						</div>
						<div style="width:${v.width};" class="select-option animated faster">
							<ul class="iscroll">`;
			// 遍历下拉选项
			v.this.
				children('option').
				each(function(){
					let that = $(this),
						val  = that.val(),
						txt  = that.text(),
						c    = '';
					if (val == module.conf.select_default_val) 
						return true;
					if (that.is(':disabled'))
					{
						c = 'disabled';
					}
					else if (that.is(':selected'))
					{
						c = 'active';
					}
					v.li += `<li class="${c}" data-val="${val}">
								${txt}
							</li>`;
				});
			v.html += v.li + `</ul></div>`;
			v.this.after(v.html);
		});
	}

	/**
	 * 交互事件
	 */
	static event(){
		// 定义需要响应事件的DOM
		let dom = [
			// 下拉菜单
			'.select:not(.select-disabled)',
			// 下拉菜单选项
			'.select-option',
			// 下拉菜单选项
			'.select-option li:not(.disabled):not(.active)',
			// 数字加减
			'.add, .cut',
			// 单选
			':radio',
			// 复选
			':checkbox',
			// 开关
			'.checkbox-switch:not(.switch-disabled)'
		];
		// 下拉菜单
		body.
		on('click', dom[0], function(){
			let v = {
				this : $(this),
			}
			// 位置
			v.p = v.this.position();
			// 选项
			v.o = v.this.next('.select-option');
			// 选项容器的真实高度
			v.oHeight  = v.o.outerHeight();
			v.oHeight += 10;
			// 自动定位
			v.o.css('left', v.p.left);
			if (distance(v.this, 'bottom') < v.oHeight)
				v.o.css('top', v.p.top - v.oHeight);
			v.open = v.this.data('open') == 1 ? 0 : 1;
			v.this.data('open', v.open);
			// 下拉图标对象缓存
			v.i = v.this.children('i');
			// 判断是展开还是关闭
			if (v.open == 0)
			{
				// 下拉按钮处理
				v.i.removeClass('rotate-180').addClass('rotate');
				// 选项处理
				fadeOut(v.o);
				return;
			}
			// 箭头旋转
			v.i.removeClass('rotate').addClass('rotate-180');
			// 选项处理
			fadeIn(v.o);
			v.o.attr('tabindex', 0).focus();
		}).
		on('mouseover', dom[0], function(){
			$(this).
				next('.select-option').
				data('active', 1);
		}).
		on('mouseout', dom[0], function(){
			$(this).
				next('.select-option').
				data('active', 0);
		}).
		on('blur', dom[1], function(){
			let that = $(this);
			if (that.data('active') == 1) return;
			// 下拉按钮处理
			that.
				prev().
				data('open', 0).
				children('i').
				removeClass('rotate-180').
				addClass('rotate');
			// 选项处理
			fadeOut(that);
		}).
		// 下拉菜单选项点击
		on('click', dom[2], function(){
			let v = {
				this : $(this)
			}
			v.val = v.this.data('val'),
			v.txt = v.this.html();
			// 真实下拉菜单
			v.select = v.this.
							parent().
							parent().
							prev().
							prev();
			v.select.
				val(v.val).
				next().
				children('span').
				addClass('selected').
				html(v.txt);
			// 样式设置
			v.this.
				addClass('active').
				siblings('.active').
				removeClass('active');
			// 关闭
			v.this.
				parent().
				parent().
				trigger('blur');
			v.select.trigger('change');
			// 判断是否有绑定的子菜单
			v.bind = v.select.data('bind');
			if (v.bind == undefined)
			{
				return;
			}
			v.api = v.select.data('api');
			if (v.api == undefined || v.api == '')
			{
				console.log('没有设置子菜单数据调用的API地址');
				return;
			}
			v.child = $('#' + v.bind);
			v.child.
				next('.select').
				children('span').
				html('<i class="fa fa-spinner fa-pulse"></i>');
			axios.get(v.api += v.val).
			then((response) => {
				let option = `<option value="${module.conf.select_default_val}"></option>`;
				let li = '';
				_.each(response.data, (val, key) => {
					option += `<option value="${key}">${val}</option>`;
					li += `<li data-val="${key}">${val}</li>`;
				});
				v.child.html(option);
				v.child.
					next('.select').
					removeClass('select-disabled').
					children('span').
					html('请选择');
				v.child.
					next().
					next().
					children('ul').
					html(li);
			}).
			catch((error) => {
				console.log(error);
			});
		}).
		// 数字加减框
		on('click', dom[3], function(){
			let v = {
				this : $(this)
			}
			if (v.this.hasClass('disabled'))
				return;
			v.input = v.this.parent().prev(),
			v.min   = v.input.data('min') == undefined ? 0 : v.input.data('min'),
			v.max   = v.input.data('max') == undefined ? 0 : v.input.data('max'),
			v.step  = v.input.data('step') == undefined ? 1 : v.input.data('step'),
			v.val   = parseInt(v.input.val());
			if (v.this.hasClass('add'))
			{
				v.val += parseInt(v.step);
				if (v.max > 0 && v.val == v.max)
					v.this.addClass('disabled');
				v.input.val(v.val);
				v.this.next().removeClass('disabled');
				return;
			}
			v.val -= parseInt(v.step);
			if (v.val <= v.min)
			{
				v.this.addClass('disabled');
			}
			v.input.val(v.val);
			v.this.
				prev().
				removeClass('disabled');
		}).
		on('mousedown', dom[3], (e) => {
			e.preventDefault();
		}).
		// 单选按钮
		on('click', dom[4], function(){
			let v = {
				this : $(this)
			};
			v.radio = v.this.parent();
			if (v.radio.hasClass('radio-checked'))
				return;
			v.radio.
				removeClass('radio').
				addClass('radio-checked').
				children('i').
				attr('class', 'fa fa-dot-circle-o');
			v.radio.
				siblings('.radio-checked').
				addClass('radio').
				removeClass('radio-checked').
				children('i').
				attr('class', 'fa fa-circle-o');
		}).
		// 复选按钮
		on('click', dom[5], function(){
			let v = {
				this : $(this)
			};
			v.checkbox = v.this.parent();
			if(v.this.is(':checked'))
			{
				v.checkbox.
					attr('class', 'checkbox-checked').
					children('i').
					attr('class', 'fa fa-check-square-o');
			}
			else
			{
				v.checkbox.
					attr('class', 'checkbox').
					children('i').
					attr('class', 'fa fa-square-o');
			}
		}).
		// 开关
		on('click', dom[6], function(){
			let v = {
				this : $(this)
			};
			v.checkbox = v.this.prev().children(':checkbox');
			if(v.checkbox.is(':checked'))
			{
				v.this.removeClass('switch-open');
				v.checkbox.
					attr('checked', false).
					val(0);
			}
			else
			{
				v.this.addClass('switch-open');
				v.checkbox.
					attr('checked', true).
					val(1);
			}
		}).
		// 表单提交
		on('submit', 'form', function(){
			let v = {
				this : $(this)
			};
			v.action = v.this.attr('action');
			if (v.action == undefined)
			{
				console.log('提交的表单没有指定action参数，无法识别需要提交到哪里');
				return false;
			}
			// 验证提交表单
			Validate.submit(v.this);
			if(v.this.find('span.error').length > 0)
			{
				return false;
			}
			// 提交按钮处理
			v.submit = v.this.find('[data-submit]');
			if (v.submit.length > 0 && 
				v.submit.data('loading') != undefined)
				Button.loading(v.submit);
			if (v.this.data('native') != undefined)
			{
				return true;
			}
			// 提交数据
			v.formData = v.this.serialize();
			v.callback = v.this.data('callback');
			axios.post(v.action, v.formData).
			then((response) => {
				let data = response.data;
				// 没有执行成功码则还是调用submit回调
				if (data[module.conf.http.code_field] == undefined)
				{
					console.log('接口返回结果中没有找到定义的code码字段');
					return;
				}
				let msg = '';
				if (data[module.conf.http.msg_field] != undefined)
					msg = data[module.conf.http.msg_field];
				// 执行成功
				if (data[module.conf.http.code_field] == module.conf.http.code_success)
				{
					if (msg == '') msg = '操作执行成功';
					Eadmin.message.success({
						content : msg,
						callback : () => {
							if (v.callback != undefined)
							{
								try{
									Method != undefined;
									if ( ! _.isFunction(Method[v.callback]))
									{
										console.log('指定的' + v.callback + '不是一个可被调用的函数');
										return;
									}
									Method[v.callback](v.submit);
								}
								catch(e){
									console.log(e);
								}
							}
						}
					});
					Eadmin.button.reset(v.submit);
					return;
				}
				if (msg == '') msg = '操作执行失败';
				Eadmin.message.error({
					content : msg
				});
				Eadmin.button.reset(v.submit);
			}).
			catch((error) => {
				Eadmin.message.error({
					content : error
				});
			});
			return false;
		});
		// 限制字数的文本域
		keyup('.textarea-max', (_this) => {
			let max = _this.attr('maxlength'),
				len = _this.val().length;
			if (len > max) return;
			_this.
				next().
				html(len + ' / ' + max);
		});
	}

	/**
	 * 复选框手动设置状态，用在表格全选，穿梭框等
	 * @param {*} dom 
	 * @param {*} action 
	 */
	static checkbox(dom, action) {
		let param = {};
		if (action == 1)
		{
			param = {
				checked : true,
				i_class : 'fa fa-check-square-o',
				class   : 'checkbox-checked'
			};
		}
		else
		{
			param = {
				checked : false,
				i_class : 'fa fa-square-o',
				class   : 'checkbox'
			};
		}
		dom.
			prop('checked', param.checked).
			prev('i').
			attr('class', param.i_class).
			parent('label').
			attr('class', param.class);
	}

	/**
	 * 下拉菜单手工设置状态，用在表格搜索项重置
	 * @param {*} dom 
	 */
	static select(dom)
	{
		let select = dom.find('select');
		if (select.length == 0)
			return;
		select.
		each(function(){
			let v = {
				this : $(this)
			};
			v.txt = v.this.children('option:first').text();
			v.this.
				val(module.conf.select_default_val).
				next().
				children('span').
				removeClass('selected').
				html(v.txt);
			v.this.
				next().
				next().
				find('.active').
				removeClass('active');
		});
	}

	/**
	 * 设置文本框的状态
	 * @param {*} dom 
	 * @param {*} model 
	 * @param {*} init 
	 */
	static input(dom, model, init = false){
		if (model == dom.data('model') && ! init)
			return;
		if (model == null)
		{
			dom.
				removeData('model').
				removeClass('color-input').
				prev('i').
				remove();
			dom.
				parent().
				removeAttr('class');
			return;
		}
		if (dom.data('model') == undefined)
		{
			dom.addClass('color-input');
		}
		else
		{
			dom.prev('i').remove();
		}
		dom.data('model', model);
		let icon = '';
		switch (model)
		{
			case 'success':
				icon = 'fa-check-circle';
			break;
			case 'error':
				icon = 'fa-times-circle';
			break;
			case 'notice':
				icon = 'fa-exclamation-circle';
			break;
		}
		if( ! dom.parent().is('label'))
		{
			dom.before(`<label class="${model + '-input'}"></label>`);
			let label = dom.prev('label');
			$(`<i class="fa ${icon}"></i>`).appendTo(label);
			dom.appendTo(label);
		}
		else
		{
			dom.before(`<i class="fa ${icon}"></i>`);
			dom.
				parent().
				attr('class', model + '-input')
		}
	}

	/**
	 * 设置文本域的状态
	 * @param {*} dom 
	 * @param {*} model 
	 * @param {*} init 
	 */
	static textarea(dom, model, init = false){
		if (model == dom.data('model') && ! init)
			return;
		if (model == null)
		{
			dom.
				removeData('model').
				removeClass('color-input').
				parent().
				removeAttr('class');
			return;
		}
		if (dom.data('model') == undefined)
		{
			dom.addClass('color-input');
		}
		dom.data('model', model);
		if( ! dom.parent().is('label'))
		{
			dom.before(`<label class="${model + '-input'}"></label>`);
			let label = dom.prev('label');
			dom.appendTo(label);
		}
		else
		{
			dom.parent().attr('class', model + '-input');
		}
	}

}