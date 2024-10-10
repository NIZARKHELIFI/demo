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
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("home").attachPatternMatched(this._onRouteMatched, this);

        this.userInfoModel = this.getOwnerComponent().getModel("userInfo");
        this.getView().setModel(this.userInfoModel, "userInfo");

        this.oEventBus = this.getOwnerComponent().getEventBus();        
        this._createLaunchpadMenu();
      },

      _onRouteMatched: function (oEvent) {

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
        // Route name : this.getOwnerComponent().getRouter().getHashChanger().getHash()
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
