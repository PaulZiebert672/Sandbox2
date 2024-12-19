exports.getProblemsList = async (req, res) => {
    var problemsModel = {
        collection: [
            {
                id: 'mp',
                title: 'Mathematical pendulum',
                desc: 'The classical physical system that allows an analytic solution',
                thumb: 'img/thumbs/mp_sm.png'
            },
            {
                id: 'kepler',
                title: 'Kepler problem',
                desc: 'The two-body problem in celestial dynamics',
                thumb: 'img/thumbs/kepler_sm.png'
            },
            {
                id: 'dpm',
                title: 'Double pendulum (mathematical)',
                desc: 'The simple physical system that exhibits rich dynamic behavior with a strong sensitivity to initial conditions',
                thumb: 'img/thumbs/dpm_sm.png'
            },
            {
                id: 'cr3bp',
                title: 'Circular restricted 3-body problem',
                desc: 'The 3-body problem in celestial dynamics where the mass of the tertiary object is extremely small and the two primary objects orbit in a circle',
                thumb: 'img/thumbs/cr3bp_sm.png'
            }
        ]
    };
    res.render('ode/problems', problemsModel);
};

exports.getOrbit = async (req, res) => {
    var id = req.query.id || 'mp';
    var inventory = {
        'mp': {
            method: 'rk4',
            time: [0, 1],
            scale: true,
            step: [36, 1],
            q0: 0,
            p0: 1
        },
        'kepler': {
            method: 'gauss4',
            time: [0, 1],
            step: [60, 1],
            scale: true,
            q0: [1, 0],
            p0: [0, 1]
        },
        'dpm': {
            method: 'gauss4',
            time: [0, 50],
            step: [5000, 10],
            q0: [0, Math.PI/2],
            p0: [0, 0]
        },
        'cr3bp': {
            method: 'su[gauss4,4]',
            params: JSON.stringify({ "mu": 0.001 }),
            time: [0, 24],
            step: [12000, 50],
            q0: [0.5, 0, 0],
            p0: [0, 0, 0]
        }
    };
    var orbitModel = {
        settings: (inventory[id].id = id, inventory[id]),
        collection: [
            {
                id: 'mp',
                title: 'Mathematical pendulum'
            },
            {
                id: 'kepler',
                title: 'Kepler problem'
            },
            {
                id: 'dpm',
                title: 'Double pendulum (mathematical)'
            },
            {
                id: 'cr3bp',
                title: 'Circular restricted 3-body problem'
            }
        ]
    };
    res.render('ode/orbit', orbitModel);
};

exports.postResult = async (req, res) => {
    var reqData = req.body;
    console.log(req.body);
    var bring2array = function (s) {
        return JSON.parse((s.trim().startsWith('[') || !s.includes(','))? s: ('[' + s + ']'));
    };
    var bring2object = function (s) {
        return JSON.parse(s.trim().length == 0? '{}': s);
    }
    var configModel = {
        config: JSON.stringify({
            id: reqData.problem,
            integrator: reqData.method,
            params: bring2object(reqData.params),
            psi0: [bring2array(reqData.coordinate), bring2array(reqData.momentum)],
            time: [+reqData.time0, +reqData.time1],
            scale: ('scale' in reqData),
            step: [+reqData.steps, +reqData.skips]
        }, null, 4)
    };
    res.render('ode/result', configModel);
};
