/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "ns/reservationfiori/model/models",
    "ns/reservationfiori/job/JobRepository",
    "ns/reservationfiori/job/AppConstants"
],
    function (UIComponent, models, JobRepository,AppConstants) {
        "use strict";

        return UIComponent.extend("ns.reservationfiori.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);



                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.JobRepository = new JobRepository(this); //instanciation du classe jobrepository

                var oEventBus = this.getEventBus();
                oEventBus.subscribe(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, this._onRunJob.bind(this), this);

            },

            _onRunJob: function (sChannel, sEvent, oData) {
                this.JobRepository.runjob(oData);
            },

            destroy: function () {
                var oEventBus = this.getEventBus();
                oEventBus.unsubscribe(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, this._onRunJob.bind(this), this);
                UIComponent.prototype.destroy.apply(this, arguments);

            }

        });
    }
);