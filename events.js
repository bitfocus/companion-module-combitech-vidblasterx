'use strict'

var receiveEventBacklog = ''
var receiveCommandBacklog = ''

// state machine state, see docs/statemachine
var state = 'New'
var result = []

function processCommandEvents(self, receivebuffer) {
	receiveCommandBacklog += receivebuffer
	let n = receiveCommandBacklog.indexOf('\n')
	self.verbose(JSON.stringify(receiveCommandBacklog))
	while (~n) {
		var line = receiveCommandBacklog.substring(0, n).trim()
		switch (state) {
			case 'New':
				if (line == '200 Welcome') {
					state = 'Clean'
				} else {
					self.log('error', 'Unexpected message: ' + line)
				}
				break
			case 'Clean':
				if (line == '200 Ok') {
					state = 'OK'
				} else if (line.slice(0, 4) == '400-') {
					state = 'Error 1'
					result.push(line)
				} else {
					self.log('error', 'Unexpected message: ' + line)
				}
				break
			case 'OK':
				if (line == '.') {
					// End of response
					self.verbose('Message completed: ', JSON.stringify(result))
					var request = self.requestQueue.shift()
					self.verbose('Processing request: ', JSON.stringify(request))
					if (request.callback != null) {
						request.callback(result)
					}
					result = []
					state = 'Clean'
				} else {
					result.push(line)
				}
				break
			case 'Error 1':
				if (line.slice(0, 4) == '400 ') {
					result.push(line)
					self.verbose('Failed: ' + JSON.stringify(result))
					var request = self.requestQueue.shift()
					self.verbose('Processing request: ' + JSON.stringify(request))
					if (request.error != null) {
						request.error(result)
					}
					result = []
					state = 'Clean'
				} else {
					self.log('error', 'Unexpected message: ' + line)
				}
		}
		self.verbose('Line processed. State: ' + state + ', line: ' + line)
		receiveCommandBacklog = receiveCommandBacklog.substring(n + 1)
		n = receiveCommandBacklog.indexOf('\n')
	}
}

function processEventstreamEvents(self, receivebuffer) {
	receiveEventBacklog += receivebuffer
	let n = receiveEventBacklog.indexOf('\n')
	while (~n) {
		// get the first line from the backlog and split it by comma
		var lineparts = receiveEventBacklog
			.substring(0, n)
			.split(',')
			.map((e) => e.trim())

		if (lineparts[0] != 'ontally') {
			self.verbose('LINE: ' + JSON.stringify(lineparts))
		}

		if (lineparts[0] == 'onselected') {
			if (lineparts[1] == 'PGM 1') {
				self.state['program'] = lineparts[2]
			} else if (lineparts[1] == 'PVW 1') {
				self.state['preview'] = lineparts[2]
			}
			self.setVariableValues(self.state)
			self.checkFeedbacks()
		} else if (lineparts[0] == 'onmodules') {
			lineparts.shift()
			self.apilist = lineparts
			self.updateModuleChoices()
		}

		receiveEventBacklog = receiveEventBacklog.substring(n + 1)
		n = receiveEventBacklog.indexOf('\n')
	}
}

module.exports = { processCommandEvents, processEventstreamEvents }
