const { combineRgb } = require('@companion-module/base')
//const icon = require('./icons')

module.exports = async function (self) {
    const black = combineRgb(0, 0, 0)
    const white = combineRgb(255, 255, 255)
    const red = combineRgb(255, 0, 0)
    const gray = combineRgb(64, 64, 64)
    const blue = combineRgb(0, 0, 64)
    const gold = combineRgb(255, 215, 0)
    const green = combineRgb(0, 255, 0)



    var presets = [
        {
            type: 'button',
            category: 'Switcher',
            style: {
                text: 'AUTO',
                color: white,
                bgcolor: black,
            },
            steps: [{
                down: [{
                    actionId: 'auto',
                    options: {}
                }],
                up: []
            }],
            feedbacks: [],
        },
        {
            type: 'button',
            category: 'Switcher',
            style: {
                text: 'TAKE',
                color: white,
                bgcolor: black,
            },
            steps: [{
                down: [{
                    actionId: 'take',
                    options: {}
                }],
                up: []
            }],
            feedbacks: [],
        },
        {
            type: 'text',
            category: 'Switcher',
            name: 'Program',
            text: 'Set program to a video source'
        }
    ]

    self.CHOICES_PGM_SOURCES.forEach( (src) => {
        presets.push({
            type: 'button',
            category: 'Switcher',
            style: {
                text: src.id,
                color: red,
                bgcolor: black,
            },
            steps: [{
                down: [{
                    actionId: 'program',
                    options: { source: src.id}
                }],
                up: []
            }],
            feedbacks: [{
                feedbackId: 'Program',
                options: { source: src.id},
                style: {
                    color: white,
                    bgcolor: red,
                }
            }]
        })
    })

    presets.push({
            type: 'text',
            category: 'Switcher',
            name: 'Preview',
            text: 'Set preview to a video source',
    })

    self.CHOICES_PGM_SOURCES.forEach( (src) => {
        presets.push({
            type: 'button',
            category: 'Switcher',
            style: {
                text: src.id,
                color: green,
                bgcolor: black,
            },
            steps: [{
                down: [{
                    actionId: 'preview',
                    options: { source: src.id}
                }],
                up: []
            }],
            feedbacks: [{
                feedbackId: 'Preview',
                options: { source: src.id},
                style: {
                    color: white,
                    bgcolor: green,
                }
            }]
        })
    })
    
    console.log('Presets:', JSON.stringify(presets))
    self.setPresetDefinitions(presets)
}