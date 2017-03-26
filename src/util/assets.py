# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:05:09
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-26 14:53:22

from flask_assets import Bundle, Environment
from .. import app

bundles = {

	'default_css' : Bundle(
		'css/screen.css',
		'css/swipebox.css',
		'css/bootstrap.css',
		'css/font-awesome.min.css',
		output='gen/default.css'),

	'default_js' : Bundle(
		'js/modernizr.custom.63321.js',
		'js/jquery-1.11.2.min.js',
		'js/jquery-ui.min.js',
		'js/bootstrap.min.js',
		'js/placeholder.js',
		'js/imagesloaded.pkgd.min.js',
		'js/masonry.pkgd.js',
		'js/instagram.js',
		'js/jquery.swipebox.min.js',
		'js/countdown.js',
		'js/sticky.js',
		'js/options.js',
		'js/plugins.js',
		output='gen/default.js')
}

assets = Environment(app)
assets.register(bundles)
