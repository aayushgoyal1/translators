'use strict';

var OpenT2T = require('opent2t').OpenT2T;
const SchemaName = 'org.opent2t.sample.binaryswitch.superpopular';

function runBinarySwitchTests(createTranslator, deviceId, test, setTestData) {

    function setData(t) {
        if(setTestData) {
            setTestData(t.title, t);
        }
    }

    test.serial('Valid Binary Switch Translator', t => {
        return createTranslator().then(translator => {
            t.is(typeof translator, 'object') && t.truthy(translator);
        });
    });

    test.serial('GetPlatform', t => {
        return createTranslator().then(translator => {
            return OpenT2T.invokeMethodAsync(translator, SchemaName, 'get', []).then((response) => {
                t.is(response.rt[0], SchemaName);
            });
        });
    });

    test.serial('GetPlatformExpanded', t => {
        return createTranslator().then(translator => {
            return OpenT2T.invokeMethodAsync(translator, SchemaName, 'get', [true])
                .then((response) => {
                    t.is(response.rt[0], SchemaName);

                    var resource = response.entities[0].resources[0];
                    t.is(resource.id, 'power');
                    t.is(resource.rt[0], 'oic.r.switch.binary');
                    t.true(resource.value !== undefined);
            });
        });
    });

    test.serial('GetPower', t => {
        return createTranslator().then(translator => {
            return OpenT2T.invokeMethodAsync(translator, SchemaName, 'getDevicesPower', [deviceId])
                .then((response) => {
                    t.is(response.rt[0], 'oic.r.switch.binary');
            });
        });
    });

    test.serial('SetPower', t => {
        setData(t);
        return createTranslator().then(translator => {
            return OpenT2T.invokeMethodAsync(translator, SchemaName, 'postDevicesPower', [deviceId, { 'value': true }])
                .then((response) => {
                    t.is(response.rt[0], 'oic.r.switch.binary');
                    t.is(response.id, 'power');
                    t.true(response.value === true);

                    return OpenT2T.invokeMethodAsync(translator, SchemaName, 'postDevicesPower', [deviceId, { 'value': false }])
                        .then((responseTwo) => {
                            t.is(responseTwo.id, 'power');
                            t.true(responseTwo.value === false);
                    });
            });
        });
    });

}

module.exports = runBinarySwitchTests;