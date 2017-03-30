# -*- coding: utf-8 -*-
# @Author: amaneureka
# @Date:   2017-03-30 13:53:13
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-30 14:14:50

from dateutil import parser
from .. import app

@app.template_filter('strftime')
def _jinja2_filter_datetime(date, fmt=None):
    date = parser.parse(date)
    native = date.replace(tzinfo=None)
    return native.strftime('%b %d, %Y')
