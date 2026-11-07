module.exports = async function (self) {
	self.pollCounter++
	self.verbose('--- poll ---')
	if (self.pollCounter % 5 == 0) {
		self.updateProgramSources()
	}

	for (fn in self.pollJobs) {
		self.verbose('FN = ' + fn)
		await self.pollJobs[fn](self)
	}

	self.setVariableValues(self.state)
	self.checkFeedbacks()
}
