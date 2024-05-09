const { combineRgb } = require('@companion-module/base')
const icon = require('./icons')
const actions = require('./actions')

module.exports = async function (self) {
    const black = combineRgb(0, 0, 0)
    const white = combineRgb(255, 255, 255)
    const red = combineRgb(255, 0, 0)
    const gray = combineRgb(64, 64, 64)
    const blue = combineRgb(0, 0, 64)
    const gold = combineRgb(255, 215, 0)
    const green = combineRgb(0, 255, 0)
    const dark_green = combineRgb(0, 64, 0)
    const orange = combineRgb(255, 128, 0)



    var presets = {
        "auto": {
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
        "take": {
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
    }

    if (self.CHOICES_PGM_SOURCES.length != '0') {
        presets["section_program"] = {
            type: 'text',
            category: 'Switcher',
            name: 'Program',
            text: 'Set program to a video source'
        }

        self.CHOICES_PGM_SOURCES.forEach( (src) => {
           presets["program_"+src.id] = {
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
           }
        })

        presets["section_preview"] = {
               type: 'text',
               category: 'Switcher',
               name: 'Preview',
               text: 'Set preview to a video source',
        }

       self.CHOICES_PGM_SOURCES.forEach( (src) => {
           presets["preview_"+src.id] = {
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
           }
        })

        presets["br"] = {
            type: 'text',
            category: 'Switcher',
            name: '',
            text: '',
        }
    }

    if (self.CHOICES_PLAYER.length != 0) {
        self.CHOICES_PLAYER.forEach( (player) => {
            player = player.id
            presets[player] = {
                type: "text",
                category: "Player",
                name: player,
                text: '',
            }

            presets[player+" play"] = {
                type: 'button',
                category: 'Player',
                style: {
                    text: player,
                    size: "14",
                    alignment: 'center:bottom',
                    png64: icon["white"]["play"],
                    pngalignment: 'center:top',
                    color: white,
                },
                steps: [{
                    down: [{
                        actionId: 'player_play',
                        options: {player: player}
                    }],
                    up: []
                }],
                feedbacks: [{
                    feedbackId: 'Playing',
                    options: { player: player},
                    style: {
                        color: white,
                        bgcolor: dark_green,
                    },
                    isInverted: true
                }]
            }
 
            presets[player+" pause"] = {
                type: 'button',
                category: 'Player',
                style: {
                    text: player,
                    png64: icon["white"]["pause"],
                    alignment: 'center:bottom',
                    size: "14",
                    pngalignment: 'center:top',
                    color: white,
                },
                steps: [{
                    down: [{
                        actionId: 'player_pause',
                        options: {player: player}
                    }],
                    up: []
                }],
                feedbacks: [{
                    feedbackId: 'Playing',
                    options: { player: player},
                    style: {
                        color: white,
                        bgcolor: dark_green,
                    },
                    isInverted: false
                }]
            }

            presets[player+" stop"] = {
                type: 'button',
                category: 'Player',
                style: {
                    text: player,
                    png64: icon["white"]["stop"],
                    alignment: 'center:bottom',
                    size: "14",
                    pngalignment: 'center:top',
                    color: white,
                },
                steps: [{
                    down: [{
                        actionId: 'player_stop',
                        options: {player: player}
                    }],
                    up: []
                }],
                feedbacks: [{
                    feedbackId: 'Playing',
                    options: { player: player},
                    style: {
                        color: white,
                        bgcolor: dark_green,
                    },
                    isInverted: false
                }]
            }
        })
    }

    if (self.CHOICES_STILL_STORES.length != 0) {
        self.CHOICES_STILL_STORES.forEach( (store) => {
            store = store.id
            presets[store] = {
                type: 'text',
                category: 'Still Store',
                name: store,
                text: 'Grab image from videosource to the still store'
            }

            self.CHOICES_PGM_SOURCES.forEach( (source) => {
                source = source.id
                presets[store+source] = {
                    type: 'button',
                    category: 'Still Store',
                    style: {
                        text: `${source} to ${store}`,
                        size: "14",
                        color: black,
                        bgcolor: gold,
                    },
                    steps: [{
                        down: [
                            {
                                actionId: 'still_source',
                                options: {
                                    stillStore: store,
                                    source: source
                                },
                                delay: 0,
                            }, {
                                actionId: 'still_grab',
                                options: {
                                    stillStore: store
                                },
                                delay: 40,
                            }
                        ],
                        up: []
                    }],
                    feedbacks: []
                }
            })
        })
    }

    if (self.CHOICES_TIMERS.length != 0) {
        self.CHOICES_TIMERS.forEach( (timer) => {
            timer = timer.id
            presets[timer] = {
                type: 'text',
                category: 'Timer',
                name: timer,
                text: ''
            }

            presets[timer+"start"] = {
                type: 'button',
                category: 'Timer',
                style: {
                    text: 'Start '+timer,
                    size: "18",
                    color: white,
                    bgcolor: blue,
                },
                steps: [{
                    down: [{
                        actionId: 'timer_start',
                        options: {
                            timer: timer
                        }
                    }],
                    up: []
                }],
                feedbacks: []
            }

            presets[timer+"stop"] = {
                type: 'button',
                category: 'Timer',
                style: {
                    text: 'Stop '+timer,
                    size: "18",
                    color: white,
                    bgcolor: blue,
                },
                steps: [{
                    down: [{
                        actionId: 'timer_stop',
                        options: {
                            timer: timer
                        }
                    }],
                    up: []
                }],
                feedbacks: []
            }
            presets[timer+"reset"] = {
                type: 'button',
                category: 'Timer',
                style: {
                    text: 'Reset '+timer,
                    size: "18",
                    color: white,
                    bgcolor: blue,
                },
                steps: [{
                    down: [{
                        actionId: 'timer_reset',
                        options: {
                            timer: timer
                        }
                    }],
                    up: []
                }],
                feedbacks: []
            }
        })
    }

    if (self.CHOICES_POWERPOINT.length != 0) {
        self.CHOICES_POWERPOINT.forEach( (powerpoint) => {
            powerpoint = powerpoint.id
            presets[powerpoint] = {
                type: 'text',
                category: 'Powerpoint',
                name: powerpoint,
                text: ''
            }
            presets[powerpoint+"previous"] = {
                type: 'button',
                name: 'Previous slide',
                category: 'Powerpoint',
                style: {
                    text: powerpoint.replace('Powerpoint', 'PPT'),
                    size: "14",
                    alignment: 'center:bottom',
                    png64: icon["black"]["back"],
                    pngalignment: 'center:top',
                    color: black,
                    bgcolor: orange,
                },
                steps: [{
                    down: [{
                        actionId: 'powerpoint_previous',
                        options: {
                            powerpoint: powerpoint
                        }
                    }],
                    up: []
                }],
                feedbacks: [{
                    feedbackId: 'Program',
                    options: { source: powerpoint},
                    style: {
                        color: black,
                        bgcolor: red,
                    }
                }]
            }
            presets[powerpoint+"next"] = {
                type: 'button',
                name: 'Next slide',
                category: 'Powerpoint',
                style: {
                    text: powerpoint.replace('Powerpoint', 'PPT'),
                    size: "14",
                    alignment: 'center:bottom',
                    png64: icon["black"]["play"],
                    pngalignment: 'center:top',
                    color: black,
                    bgcolor: orange,
                },
                steps: [{
                    down: [{
                        actionId: 'powerpoint_next',
                        options: {
                            powerpoint: powerpoint
                        }
                    }],
                    up: []
                }],
                feedbacks: [{
                    feedbackId: 'Program',
                    options: { source: powerpoint},
                    style: {
                        color: black,
                        bgcolor: red,
                    }
                }]
            }
        })
    }

    self.verbose('Presets:', JSON.stringify(presets))
    self.setPresetDefinitions(presets)
}