'use strict'

const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	const black = combineRgb(0, 0, 0)
	const white = combineRgb(255, 255, 255)
	const red = combineRgb(255, 0, 0)
	const gray = combineRgb(64, 64, 64)

	self.setFeedbackDefinitions({
		Program: {
			name: 'Current Program Source',
			type: 'boolean',
			defaultStyle: {
				bgcolor: red,
				color: black,
			},
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,
				},
			],
			callback: async (feedback) => {
				return self.state['program'].toUpperCase() == feedback.options.source.toUpperCase()
			},
		},
		Preview: {
			name: 'Current Preview Source',
			type: 'boolean',
			defaultStyle: {
				bgcolor: red,
				color: black,
			},
			options: [
				{
					id: 'source',
					type: 'dropdown',
					label: 'Source',
					choices: self.CHOICES_PGM_SOURCES,
				},
			],
			callback: async (feedback) => {
				return self.state['preview'].toUpperCase() == feedback.options.source.toUpperCase()
			},
		},
		Playing: {
			name: 'Mediaplayer is playing',
			type: 'boolean',
			defaultStyle: {
				bgcolor: red,
				color: black,
			},
			options: [
				{
					id: 'player',
					type: 'dropdown',
					label: 'Player',
					choices: self.CHOICES_PLAYER,
				},
			],
			subscribe: (feedback) => {
				self.verbose('subscribe: ' + JSON.stringify(feedback))
				const command = `${feedback.options.player}, playing`
				const playerId = feedback.options.player.replace('Player ', '')
				const variableName = 'playerPlaying' + playerId
				self.pollJobs[command] = async () => {
					var result = await self.apiread(command)
					self.state[variableName] = 'true' == result[0]
				}
				self.extraVariables[command] = [{ variableId: variableName, name: `${feedback.options.player}: Playing` }]
				self.updateVariableDefinitions()
			},
			unsubscribe: (feedback) => {
				self.verbose('unsubscribe: ' + JSON.stringify(feedback))
				const command = `${feedback.options.player}, playing`
				delete self.pollJobs[command]
				delete self.extraVariables[command]
				self.updateVariableDefinitions()
			},
			callback: async (feedback) => {
				const playerId = feedback.options.player.replace('Player ', '')
				return self.state['playerPlaying' + playerId]
			},
		},
	})
}
