'use strict'

module.exports = async function (self) {
	var variables = [
		{ variableId: 'program', name: 'Program: Current source' },
		{ variableId: 'preview', name: 'Preview: Current source' },
	]
	for (const key in self.extraVariables) {
		for (const variable in self.extraVariables[key]) {
			variables.push(self.extraVariables[key][variable])
		}
	}
	self.verbose('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
	self.verbose(JSON.stringify(variables))
	self.setVariableDefinitions(variables)
}
