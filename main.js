"use strict";

const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const {processCommandEvents, processEventstreamEvents} = require('./events')
const UpdatePresets = require('./presets')
const PollVariables = require('./poll')

class VidblasterXModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.state = {
			program: '',
			preview: '',
		}
		this.requestQueue = []
		this.CHOICES_PGM_SOURCES = []
		this.CHOICES_PLAYER = []
		this.CHOICES_STILL_STORES = []
		this.CHOICES_TIMERS = []
		this.CHOICES_POWERPOINT = []
		this.extraVariables = {}
		this.pollJobs = {}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host && !this.config.port) {
			this.updateStatus(InstanceStatus.BadConfig, 'Missing Server port')
		} else if (!this.config.host && this.config.port) {
			this.updateStatus(InstanceStatus.BadConfig, 'Missing Server IP address or hostname')
		} else if (isNaN(parseInt(this.config.port))) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid port number (NaN)')
		} else if (this.config.host && this.config.port) {
			this.config.port = parseInt(this.config.port)
			this.connectVidBlasterX()
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'Missing Server connection info')
		}

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		await this.updatePresets()
		this.initPolling()
	}
	// When module gets deleted
	async destroy() {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
		}
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	verbose(message) {
		if (this.config.debug) {
			this.log('debug', message)
		}
	}
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Base Port',
				width: 4,
				regex: Regex.PORT,
			},
			{
				type: 'checkbox',
				id: 'debug',
				label: 'Enable debug logging (verbose)',
				width: 12,
			}
		]
	}

	async connectVidBlasterX() {
		if (this.command_server !== undefined) {
			this.command_server.destroy()
			delete this.command_server
			this.updateStatus('disconnected')
		}
		if (this.event_server !== undefined) {
			this.event_server.destroy()
			delete this.event_server
			this.updateStatus('disconnected')
		}
		this.updateStatus('connecting')
		this.command_server = new TCPHelper(this.config.host, this.config.port)
		this.event_server = new TCPHelper(this.config.host, this.config.port+1)

		const status_logger = (status, message) => {
			this.log('debug', message)
		}
		this.command_server.on('status_change', status_logger)
		this.event_server.on('status_change', status_logger)

		const error_logger = (err) => {
			this.log('error', 'Network error: ' + err)
			this.updateStatus('connection_failure')
		}
		this.command_server.on('error', error_logger)
		this.event_server.on('error', error_logger)

		const ok_logger = () => {
			this.log('debug', "connected")
			this.updateStatus('ok')
		}
		this.command_server.on('connect', async () => {
			ok_logger()
			this.initState()
		})
		this.event_server.on('connect', ok_logger)

		this.command_server.on('data', (receivebuffer) => {
			processCommandEvents(this, receivebuffer)
		})

		this.event_server.on('data', (receivebuffer) => {
			processEventstreamEvents(this, receivebuffer)
		})
		
	}

	// Get the state of Vidblaster X (defined sources, active sources, ...)
	async initState() {
		this.updateProgramSources()
		var program_selected = await this.apiread('PGM 1, selected')
		var preview_selected = await this.apiread('PVW 1, selected')
		this.state['program'] = program_selected[0].split(',',1)[0]
		this.state['preview'] = preview_selected[0].split(',',1)[0]
		this.setVariableValues(this.state)
		this.checkFeedbacks()
		this.apilist = await this.apilist()
		this.updateModuleChoices()
	}

	async updatePresets() {
		await UpdatePresets(this)
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updateModuleChoices() {
		var choicesCount = this.CHOICES_PLAYER.length
		var stillStoreCount = this.CHOICES_STILL_STORES.length
		var timerCount = this.CHOICES_TIMERS.length
		var powerpointCount = this.CHOICES_POWERPOINT.length

		this.CHOICES_PLAYER = this.apilist.filter(
			e => e.slice(0,6)=='Player'
		).map( e => {return {id: e, label: e}})

		this.CHOICES_STILL_STORES = this.apilist.filter(
			e => e.slice(0,11)=='Still Store'
		).map( e => {return {id: e, label: e}})

		this.CHOICES_TIMERS = this.apilist.filter(
			e => e.slice(0,6)=='Timer '
		).map( e => {return {id: e, label: e}})

		this.CHOICES_POWERPOINT = this.apilist.filter(
			e => e.slice(0,11)=='Powerpoint '
		).map( e => {return {id: e, label: e}})

		if (choicesCount != this.CHOICES_PLAYER.length
			|| stillStoreCount != this.CHOICES_STILL_STORES.length
			|| timerCount != this.CHOICES_TIMERS.length
			|| powerpointCount != this.CHOICES_POWERPOINT.length
		) {
			this.updateActions()
			this.updateFeedbacks()
			this.updatePresets()
			this.updateVariableDefinitions()
		}
	}

	initPolling() {
		this.pollCounter = 0
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
		}
		this.pollTimer = setInterval(async () => {
			PollVariables(this)
		},1000)
	}

	apiwrite(command) {
		this.requestQueue.push({command: command, callback: null, error: null})
		this.verbose(this.requestQueue)
		this.verbose('apiwrite '+command+'\n')
		
		this.command_server.send('apiwrite '+command+'\n')
	}

	async apiread(command) {
		return new Promise( (resolve, reject) => {
			this.requestQueue.push({command: command, callback: resolve, error: reject})
			this.command_server.send('apiread '+command+'\n')
		})
	}

	async apilist() {
		return new Promise( (resolve, reject) => {
			this.requestQueue.push({command: 'apilist', callback: resolve, error: reject})
			this.command_server.send('apilist\n')
		})
	}

	async updateProgramSources() {
		var sources = await this.apiread('PGM 1, sources')
		sources = sources[0]
		if (this.sources != sources) {
			this.CHOICES_PGM_SOURCES = sources.split(',').map( 
				(src) => { return {id: src, label: src}
			})
			this.sources=sources
			this.updateActions()
			this.updateFeedbacks()
			this.updatePresets()
		}
	}
}

runEntrypoint(VidblasterXModuleInstance, UpgradeScripts)
