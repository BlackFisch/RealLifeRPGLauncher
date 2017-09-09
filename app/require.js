const {ipcRenderer, shell} = require('electron')
const iCheck = require('icheck')
const fs = require('fs')
const {dialog, app} = require('electron').remote
const storage = require('electron-json-storage')
const unzip = require('unzip')
const marked = require('marked')
const $ = window.jQuery = require('./resources/jquery/jquery-1.12.3.min.js')
const Shepherd = require('tether-shepherd')
const path = require('path')
const child = require('child_process')
const ping = require('ping')
const moment = require('moment')
const Chart = require('chart.js')
const config = require('./config')
const helpers = require('./app/helpers')
const Winreg = require('winreg')
const humanizeDuration = require('humanize-duration')
const L = require('leaflet')