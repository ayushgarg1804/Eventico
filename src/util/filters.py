# -*- coding: utf-8 -*-
# @Author: amaneureka
# @Date:   2017-03-30 13:53:13
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-30 22:10:02

from dateutil import parser
from .. import app

@app.template_filter('strftime')
def _jinja2_filter_datetime(date, fmt):
    date = parser.parse(date)
    native = date.replace(tzinfo=None)
    return native.strftime(fmt)
