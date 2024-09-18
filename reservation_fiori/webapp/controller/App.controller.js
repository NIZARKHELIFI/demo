sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'ns/reservationfiori/model/formatter',
    "ns/reservationfiori/job/AppConstants"
  ],
  function (BaseController, JSONModel, formatter, AppConstants) {
    "use strict";
    return BaseController.extend("ns.reservationfiori.controller.App", {
      _bExpanded: true,
      formatter: formatter,
      onInit: function () {

        this.userInfoModel = this.getOwnerComponent().getModel("userInfo");
        this.getView().setModel(this.userInfoModel, "userInfo");

        this.oEventBus = this.getOwnerComponent().getEventBus();
        this.getUserInfo(); 

        // if (!this.getOwnerComponent().getModel("biatMenu").getProperty("/bMenuCreated")) {
          this._createLaunchpadMenu();
        // }

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

      fnUserInfoSuccess: function (oResponse, oData) {
        var oCustomAttributes = {
          purchasingGroup: oResponse.purchasingGroup,
          position: oResponse.position
        };
        this.userInfoModel.setProperty("/customAttributes", oCustomAttributes);
      },

      fnUserInfoError: function (oResponse, oError) {

      },

      getBaseURL: function () {
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        return appModulePath;
      },

      _getRenderer: function () {
        var oDeferred = new jQuery.Deferred();
        this._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
        if (!this._oShellContainer) {
          oDeferred.reject("Illegal state: shell container not available");
        } else {
          var oRenderer = this._oShellContainer.getRenderer();
          if (oRenderer) {
            oDeferred.resolve(oRenderer);
          } else {
            this._onRendererCreated = function (oEvent) {
              oRenderer = oEvent.getParameter("renderer");
              if (oRenderer) {
                oDeferred.resolve(oRenderer);
              } else {
                oDeferred.reject("Illegal state: shell container not available");
              }
            };
            this._oShellContainer.attachRendererCreatedEvent(this._onRendererCreated);
          }
        }
        return oDeferred.promise();
      },

      _createLaunchpadMenu: function () {
        this._getRenderer().fail(function (sErrorMessage) {
          jQuery.sap.log.error(sErrorMessage, undefined, "shellExtended.shellExtend.Component");
        }).done(function (oRenderer) {
          if (oRenderer.getShellController().getView().getModel("shellModel").getProperty("/header/headItems").length === 0) {
            oRenderer.addHeaderItem({
              icon: sap.ui.core.IconPool.getIconURI("menu2"),
              press: this.onMenuPress.bind(this)
            }, true, false);
          }

        }.bind(this));
      },

      /**
     * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
     *
     * @public
     * @param {string} sI18nKey The key
     * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
     * @returns {Promise<string>} The promise
     */
      getBundleText: function (sI18nKey, aPlaceholderValues) {
        return this.getBundleTextByModel(sI18nKey, this.getOwnerComponent().getModel("i18n"), aPlaceholderValues);
      },

      onMenuPress: function () {
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();
        oToolPage.setSideExpanded(!bSideExpanded);
      },

      onItemSelect: function (oEvent) {
        var sKey = oEvent.getSource().getKey();
        this.getRouter().navTo(sKey);
      },

      getCurrentRouteName: function (router = this.getOwnerComponent().getRouter()) {
        const currentHash = router.getHashChanger().getHash();
        return router.getRouteInfoByHash(currentHash).name;
      }
    });
  }
);
