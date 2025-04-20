'use strict'

module.exports = function (self) {
	self.setActionDefinitions({
		auto: {
			name: 'Switcher: Auto',
			options: [],
			callback: async (event) => {
				self.apiwrite('PGM 1, auto')
			},
		},
		take: {
			name: 'Switcher: Take',
			options: [],
			callback: async (event) => {
				self.apiwrite('PGM 1, take')
			},
		},
		program: {
			name: 'Switcher: Program',
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,
				},
			],
			callback: async (event) => {
				self.apiwrite('PGM 1, select, ' + event.options.source)
			},
		},
		preview: {
			name: 'Switcher: Preview',
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,
				},
			],
			callback: async (event) => {
				self.apiwrite('PVW 1, select, ' + event.options.source)
			},
		},
		raw_read: {
			name: 'Raw: apiread',
			options: [
				{
					id: 'command',
					type: 'textinput',
					label: 'apiread command',
				},
			],
			callback: async (event) => {
				self.apiread(event.options.command).then((e) => {
					self.verbose('APIREAD RESULT: ' + e)
				})
			},
		},
		raw_write: {
			name: 'Raw: apiwrite',
			options: [
				{
					id: 'command',
					type: 'textinput',
					label: 'apiwrite command',
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.command)
			},
		},
		player_play: {
			name: 'Player: play',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.player + ', play')
			},
		},
		player_pause: {
			name: 'Player: pause',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.player + ', pause')
			},
		},
		player_stop: {
			name: 'Player: stop',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.player + ', stop')
			},
		},
		player_position: {
			name: 'Player: Seek position',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
				{
					id: 'position',
					type: 'textinput',
					label: 'Position (timestamp in ms or a percentage followed by a "%" sign)',
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.player + ', position, ' + event.options.position)
			},
		},
		player_open: {
			name: 'Player: Open file',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
				{
					id: 'path',
					type: 'textinput',
					label: 'Filename (including path)',
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.player + ', file, ' + event.options.path)
			},
		},
		still_open: {
			name: 'Still store: Open file',
			options: [
				{
					id: 'stillStore',
					type: 'dropdown',
					label: 'Still store',
					choices: self.CHOICES_STILL_STORES,
				},
				{
					id: 'path',
					type: 'textinput',
					label: 'Filename (including path)',
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.stillStore + ', file, ' + event.options.path)
			},
		},
		still_grab: {
			name: 'Still store: Grab image',
			options: [
				{
					id: 'stillStore',
					type: 'dropdown',
					label: 'Still store',
					choices: self.CHOICES_STILL_STORES,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.stillStore + ', grab')
			},
		},
		// still_save: {}, - No API? At least undocumented
		still_source: {
			name: 'Still store: Select video source',
			options: [
				{
					id: 'stillStore',
					type: 'dropdown',
					label: 'Still store',
					choices: self.CHOICES_STILL_STORES,
				},
				{
					id: 'source',
					type: 'dropdown',
					label: 'Video Source',
					choices: self.CHOICES_PGM_SOURCES,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.stillStore + ', videosource, ' + event.options.source)
			},
		},
		timer_start: {
			name: 'Timer: Start',
			options: [
				{
					id: 'timer',
					type: 'dropdown',
					label: 'Timer',
					choices: self.CHOICES_TIMERS,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.timer + ', start')
			},
		},
		timer_stop: {
			name: 'Timer: Stop',
			options: [
				{
					id: 'timer',
					type: 'dropdown',
					label: 'Timer',
					choices: self.CHOICES_TIMERS,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.timer + ', stop')
			},
		},
		timer_reset: {
			name: 'Timer: Reset',
			options: [
				{
					id: 'timer',
					type: 'dropdown',
					label: 'Timer',
					choices: self.CHOICES_TIMERS,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.timer + ', reset')
			},
		},
		powerpoint_open: {
			name: 'Powerpoint: Open file',
			options: [
				{
					id: 'powerpoint',
					type: 'dropdown',
					label: 'Powerpoint module',
					choices: self.CHOICES_POWERPOINT,
				},
				{
					id: 'path',
					type: 'textinput',
					label: 'Filename (including path)',
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.powerpoint + ', file, ' + event.options.path)
			},
		},
		powerpoint_next: {
			name: 'Powerpoint: Next slide',
			options: [
				{
					id: 'powerpoint',
					type: 'dropdown',
					label: 'Powerpoint module',
					choices: self.CHOICES_POWERPOINT,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.powerpoint + ', next')
			},
		},
		powerpoint_previous: {
			name: 'Powerpoint: Previous slide',
			options: [
				{
					id: 'powerpoint',
					type: 'dropdown',
					label: 'Powerpoint module',
					choices: self.CHOICES_POWERPOINT,
				},
			],
			callback: async (event) => {
				self.apiwrite(event.options.powerpoint + ', prev')
			},
		},
		mixer_volume: {
			name: 'Audio Mixer: Set volume',
			options: [
				{
					id: 'source',
					type: 'textinput',
					label: 'Audio source',
				},
				{
					id: 'volume',
					type: 'number',
					label: 'Volume (0-100)',
					default: 80,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				self.apiwrite(`Audio Mixer 1, volume, ${event.options.source}, ${event.options.volume}%`)
			},
		},
	})
}
