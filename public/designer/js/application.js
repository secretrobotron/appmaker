/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["jquery", "l10n"], function($, l10n) {
    return {
      getCurrentApp: function(){
        var currentApp = localStorage.currentApp;
        return currentApp;
      },
      setCurrentApp: function(name){
        if (name && name !== l10n.get("Unsaved App")) {
          localStorage.currentApp = name;
        }
      },
      clearCurrentApp: function(){
        localStorage.removeItem("currentApp");
      },
      newApp: function(){
        var app = document.querySelector("ceci-app");
        var parent = app.parentNode;
        parent.removeChild(app);
        parent.appendChild(document.createElement('ceci-app'));
//      // TODO https://github.com/mozilla-appmaker/appmaker/issues/897
//      // we have to decouple appidChanged and initFirebase
        app.setAttribute("appid", "ceci-app-"+uuid());
      },
      renameApp: function(oldName,newName){
        var userState = document.querySelector('user-state');
        $.ajax('/api/rename_app', {
          data: {
            oldName: oldName,
            newName: newName
          },
          type: 'post',
          dataType : "json",
          success: function (data) {
            userState.appRenameOk(newName);
          },
          error: function (data) {
            userState.appRenameFailed();
          }
        });
      },
      publishApp: function(name, appid, html, alreadySaved, afterPublish) {
        // make sure to save first; If that succeeds, perform a publish
        var op = alreadySaved ? this.updateApp : this.saveApp;
        op(name, appid, html, function callAPIPublish(err) {
          if(err) {
            return console.error("publish failed in save step", err);
          }
          $.ajax('/api/publish', {
            data: {
              name: name,
              html: html
            },
            type: 'post',
            success: function (data) {
              setTimeout(function() {
                // FIXME: This should not be on window
                window.showPublishPane(name, data);
              },10);

              // update the user state menu to have an App URL entry
              var userState = document.querySelector('user-state');
              userState.setAppURL(data.app);

              // also notify API that we have a url now (or that it got updated)
              $.ajax('api/update_app', {
                data: {
                  name: name,
                  url: data.app,
                  html: html
                },
                type: 'post',
                success: function (updateData) {
                  console.log("app update (for publish url) succeeded");
                if(afterPublish) { afterPublish(false, data); }
                },
                error: function (data) {
                  console.error("app update (for publish url) failed", updateData);
                  if(afterPublish) { afterPublish(updateData, data); }
                }
              });
            },
            error: function (data) {
              console.error(data);
              if(afterPublish) { afterPublish(data); }
            }
          });
        });
      },
      saveApp: function(name, appid, html,next){
        $.ajax('/api/save_app', {
          data: {
            html: html,
            name: name,
            appid: appid
          },
          type: 'post',
          success: function (data) {
            console.log("App saved successfully");
            if(next) { next(false, data); }
          },
          error: function (data) {
            console.error("App was not saved successfully!");
            if(next) { next(data); }
          }
        });

      },
      updateApp: function(name,appid,html,next){
        $.ajax('/api/update_app', {
          data: {
            name: name,
            html: html
          },
          type: 'post',
          success: function (data) {
            console.log("App updated successfully!");
            if(next) { next(false, data); }
          },
          error: function (data) {
            console.log("App was not updated successfully!", data);
            if(next) { next(data); }
          }
        });

      },
      getOrInsertCeciApp: function(){
        var app = document.querySelector('ceci-app');
        if(!app){
          //ceci-app element doesn't exist
          var phoneBorderElement = document.querySelector(".phone-border");
          phoneBorderElement.appendChild(document.createElement("ceci-app"));
          return document.querySelector("ceci-app");
        } else {
          return app;
        }
      },
      loadAppByUrl: function(url) {
        var self = this;
        var userState = document.querySelector('user-state');

        // try to route through appmaker proxy server if protocols don't match
        if (window.location.protocol === 'https:' && url.indexOf('https') !== 0) {
          url = '/api/remix-proxy?url=' + encodeURIComponent(encodeURIComponent(url));
        }

        $.ajax(url, {
          type: 'get',
          success: function (data) {
            var openingTag = '<ceci-app';
            var closingTag = '</ceci-app>';
            var indexOfOpeningTag = data.indexOf(openingTag);
            var indexOfClosingTag = data.indexOf(closingTag);

            if (indexOfOpeningTag > -1 && indexOfClosingTag > -1) {
              var range = document.createRange();
              var container = document.body;
              range.selectNode(document.body);
              var fragment = range.createContextualFragment(data.substring(indexOfOpeningTag, indexOfClosingTag + closingTag.length));
              var newApp = fragment.querySelector('ceci-app');
              var currentApp = self.getOrInsertCeciApp();
              currentApp.parentNode.replaceChild(newApp, currentApp);
              newApp.setAttribute("appid", "ceci-app-"+uuid());
            }
            else {
              console.error('Error while parsing loaded app.');
              userState.failedAppLoad();
            }

            document.querySelector('ceci-card-nav').buildTabs();
          },
          error: function (data) {
            console.error('Error while loading app:');
            console.error(data);
            userState.failedAppLoad();
          }
        });
      },
      loadAppByName: function(name) {
        var userState = document.querySelector('user-state');
        var self = this;
        $.ajax('/api/app', {
          data: {
            name: name
          },
          type: 'get',
          success: function (data) {
            var app = self.getOrInsertCeciApp();
            var html = data.html;
            // our apps must be wrapped by a <ceci-app> element
            if(html.indexOf("<ceci-app") === -1 && html.indexOf("</ceci-app>") === -1) {
              var err = l10n.get("Malformed app HTML");
              err += " (appid: "+data.appid+")\n";
              err += l10n.get("This app will not be loaded");
              console.error(err);
              alert(err);
              return;
            }
            app.outerHTML = html;
            localStorage.currentApp = name;
            userState.okAppLoad(name, data);
            // Update the page/card tabs
            var cardNav = document.querySelector('ceci-card-nav');
            cardNav.buildTabs();
          },
          error: function (data) {
            console.error('Error while loading app:');
            console.error(data);
            userState.failedAppLoad();
          }
        });
      },
      deleteAppByName: function(name){
        $.ajax('/api/delete_app', {
          data: {
            name: name
          },
          type: 'delete',
          success: function (data) {

          },
          error: function (data) {
            console.log("Something went wrong!");
            console.error("Error while deleting app: " + data);
          }
        });
      }

    };
  }
);
