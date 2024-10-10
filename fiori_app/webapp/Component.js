/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "ns/reservationfiori/model/models",
    "ns/reservationfiori/job/JobRepository",
    "ns/reservationfiori/job/AppConstants",
    'sap/ui/model/json/JSONModel'
],
    function (UIComponent, models, JobRepository, AppConstants, JSONModel) {
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

                this.userInfoModel = this.getModel("userInfo");

                this.subscribeEvent();    

                this.getUserInfo();

            },

            subscribeEvent: function(){
                this.oEventBus = this.getEventBus();
                this.oEventBus.subscribe(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, this._onRunJob.bind(this), this);
            },

            getUserInfo: function () {

                var sUrl = this.getBaseURL() + "/user-api/currentUser";
                var oModel = new JSONModel();

                var oMock = {
                    firstname: "Malek",
                    lastname: "TLILI",
                    email: "malek.tlili@aymax.fr",
                    name: "malek.tlili@aymax.fr",
                    displayName: "Malek TLILI (malek.tlili@aymax.fr)"
                };

                oModel.loadData(sUrl);
                oModel.dataLoaded()
                    .then(() => {
                        //check if data has been loaded
                        //for local testing, set mock data
                        if (!oModel.getProperty("/email")) {
                            this.userInfoModel.setProperty("/userInfo", oMock);
                        } else {
                            this.userInfoModel.setProperty("/userInfo", oModel.getData());
                        }

                        var oUserInfoJobConfig = {
                            jobId: AppConstants.Z_USER_INFO_EVENT,
                            successfn: this.fnUserInfoSuccess.bind(this),
                            errorfn: this.fnUserInfoError.bind(this),
                            finishEvent: AppConstants.RUN_JOB_EVENT,
                            jobChannel: AppConstants.JOB_CHANNEL,
                            email: this.userInfoModel.getProperty("/userInfo/email")
                        };

                        this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oUserInfoJobConfig);

                    })
                    .catch(() => {
                        this.userInfoModel.setProperty("/userInfo", oMock);
                    });
            },

            fnUserInfoSuccess: function (oResponse) {           
                var oCustomAttributes = {
                    departement: oResponse.dept,
                    role: oResponse.role
                };
                this.userInfoModel.setProperty("/customAttributes", oCustomAttributes);
            },

            fnUserInfoError: function (oResponse, oError) {

            },

            getBaseURL: function () {
                var appId = this.getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                return appModulePath;
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