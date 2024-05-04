"use strict";

module.exports = function (self) {
	self.setActionDefinitions({
		auto: {
			name: 'Switcher: Auto',
			options: [],
			callback: async (event) => {
				console.log("auto")
				self.apiwrite('PGM 1, auto')
			}
		},
		take: {
			name: 'Switcher: Take',
			options: [],
			callback: async (event) => {
				console.log("take")
				self.apiwrite('PGM 1, take')
			}
		},
		program: {
			name: 'Switcher: Program',
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,				
				}
			],
			callback: async (event) => {
				console.log('program'),
				self.apiwrite('PGM 1, select, ' + event.options.source)
			}
		},
		preview: {
			name: 'Switcher: Preview',
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,				
				}
			],
			callback: async (event) => {
				console.log('preview'),
				self.apiwrite('PVW 1, select, ' + event.options.source)
			}
		},
		raw_read: {
			name: 'Raw: apiread',
			options: [
				{
					id: 'command',
					type: 'textinput',
					label: 'apiread command'
				}
			],
			callback: async (event) => {
				console.log('Raw command')
				self.apiread(event.options.command).then( (e) => {console.log('APIREAD RESULT: '+e)})
			}
		},
		raw_write: {
			name: 'Raw: apiwrite',
			options: [
				{
					id: 'command',
					type: 'textinput',
					label: 'apiwrite command'
				}
			],
			callback: async (event) => {
				console.log('Raw command')
				self.apiwrite(event.options.command)
			}
		},
		play: {
			name: 'Player: play',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,				
				}
			],
			callback: async (event) => {
				console.log('play')
				self.apiwrite(event.options.player + ', play')
			}
		},
		pause: {
			name: 'Player: pause',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,				
				}
			],
			callback: async (event) => {
				console.log('pause')
				self.apiwrite(event.options.player + ', pause')
			}
		},
		stop: {
			name: 'Player: stop',
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,				
				}
			],
			callback: async (event) => {
				console.log('stop')
				self.apiwrite(event.options.player + ', stop')
			}
		},
		position: {
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
				}
			],
			callback: async (event) => {
				console.log('position')
				self.apiwrite(event.options.player + ', position, ' + event.options.position)
			}
		}
	})
}
